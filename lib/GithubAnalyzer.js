"use strict"

const requestAllPages = require('request-all-pages');
const store = require('./PullRequestStore');
const Promise = require('bluebird');
const config = require('./config.js')

const maxDate = new Date(8640000000000000);
const minDate = new Date(-8640000000000000);


class GithubAnalyzer {
  constructor(org, options={}){

    this.org = org
    this.setupComplete = false
    this.store = new store()

    this.headers = this.makeHeaders(options)

    ///////////////TODOs
    //TODO: look into efficient modes of storag

    this.fetchInformation(this);

  }

  searchPulls(searchOptions, repos=[]){
    console.log("SEARCHING PULLS")

    if(repos.length == 0){
      repos = this.store.getRepoNames()
    }

    var result = []

    for(var i = 0 ; i < repos.length ; i++){
      console.log("length for ", repos[i])
      console.log(this.store.getPullsForRepo("lodash.com").length)
      //TODO: deal with it potentially being undefined
      //TODO:bounce this shit code
      if(typeof this.store.getPullsForRepo(repos[i]) !== 'undefined'){
        result = result.concat(this.store.getPullsForRepo(repos[i]))
      }
      console.log("RESULT LENGTH", result.length)
    }

    console.log("Final result length")
    console.log(result.length)

    for(var key in searchOptions){
      switch(key) {
        case 'merged_by':
        case 'user':
          result = result.filter(function(pull){
            if(typeof pull[key] === 'undefined'){
              return false
            }
            if(searchOptions[key].includes(pull[key].login)){
              return true
            } else{
              return false
            }
          })
          break;

        case 'merged_at':
        case 'created_at':
        case 'updated_at':
        case 'closed_at':
          if (searchOptions[key].range_start == "start"){
            var rangeStart = minDate
          } else{
            var rangeStart = new Date(searchOptions[key].range_start)
          }

          if (searchOptions[key].range_end == "end"){
            var rangeEnd = maxDate
          } else{
            var rangeEnd = new Date(searchOptions[key].range_end)
          }

          result = result.filter(function(pull){
            var date = new Date(pull[key])
            return date < rangeEnd && date > rangeStart
          })
          break;

        default:
          result = result.filter(function(pull){
            if(typeof pull[key] === 'undefined'){
              return false
            }
            if(searchOptions[key].includes(pull[key])){
              return true
            } else{
              return false
            }
          })
      }
      console.log("Result length post filter on ",key)
      console.log(result.length)
    }
  }

  getOrgRepos(self, org, headers){
    var repoUri = config.githubApi + config.orgs + config.slash + org + config.repos

    return new Promise(function(resolve, reject) {
      var requestOpts = {
      uri: repoUri,
      json: true,
      body: {},
      headers: headers
      };
      requestAllPages(requestOpts, function (err, pages) {
        if (err) return console.error(err);
        var repos = pages
          .reduce(
            function (acc, page) {
              acc = acc.concat(page.body)
              return acc;
            }
          , []);
        resolve(repos)
      })
    })
  }

  getRepoPulls(self, org, repo, headers){
    var pullsUri = config.githubApi + config.repos + config.slash + org + config.slash + repo + config.allPulls

    return new Promise(function(resolve, reject) {
      var requestOpts = {
      uri: pullsUri,
      json: true,
      body: {},
      headers: headers
      };
      requestAllPages(requestOpts, function (err, pages) {
        if (err) return console.error(err);
        var pulls = pages
          .reduce(
            function (acc, page) {
              acc = acc.concat(page.body)
              return acc;
            }
          , []);
        resolve([repo, pulls])
      })
    })
  }

  fetchInformation(self){
    self.getOrgRepos(self, self.org, self.headers)
    .then(function (repos) {
      self.store.storeRepos(repos)

      var repoNames = self.store.getRepoNames()
      var promises = []

      for (var i = 0 ; i < repoNames.length; i++){
        promises.push(
          self.getRepoPulls(self, self.org, repoNames[i], self.headers)
          .then(function(results){
            console.log("################################### PULLS ##################################")
            console.log(results[1].length)
            self.store.storePulls(results[0], results[1])
          })
        )
      }

    })
    .catch(function (err) {
      console.log("Error:", err);
    })
  }


  makeHeaders(options){
    var headers = {}
    if ('authorization' in options){
      switch(options.authorization) {
          case "basic":
              if ('username' in options && 'password' in options){
                var authHeader = "Basic "
                authHeader += new Buffer(options.username + ":" + options.password).toString('base64')
                headers["Authorization"] = authHeader
              } else {
                //TODO: raise bad auth inputs exception here
              }
              break;
          case "token":
              var authHeader = "token "
              authHeader += options.token
              headers["Authorization"] = authHeader
              break;
          default:
              //TODO: Raise some sort of bad auth exception here
      }
    }

    if ('useragent' in options){
      headers["User-Agent"] = options.useragent
    } else{
      headers["User-Agent"] = config.defaultUserAgent
    }
    return headers
  }

}

module.exports = GithubAnalyzer;
