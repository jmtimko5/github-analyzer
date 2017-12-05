"use strict"

const requestAllPages = require('request-all-pages');
const store = require('./PullRequestStore');
const Promise = require('bluebird');
const config = require('./config.js')
const debug = require('debug')('github-analyzer')


const maxDate = new Date(8640000000000000);
const minDate = new Date(-8640000000000000);


class GithubAnalyzer {
  constructor(org, options={}){

    this.org = org
    this.setupComplete = false
    this.store = new store()

    this.headers = this.makeHeaders(options)

    this.fetchInformation(this);

  }

  async searchPulls(searchOptions, repos=[]){
    await this.awaitSetup()

    if(repos.length == 0){
      repos = this.store.getRepoNames()
    }

    var result = []

    for(var i = 0 ; i < repos.length ; i++){
      if(typeof this.store.getPullsForRepo(repos[i]) !== 'undefined'){
        result = result.concat(this.store.getPullsForRepo(repos[i]))
      } else{
        debug("No pulls successfully stored for " + repos[i])
      }
    }

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
      debug("Remaining Pulls After Filtering on "+key+": "+result.length)
    }
    return result
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
        if (err) return debug(err);
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
        if (err) return debug(err);
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
        )
      }

      var finalPromise = Promise.all(promises).then(function(queryResults){
        for(var i = 0 ; i < queryResults.length ; i ++){
          debug("Storing fetch data for repo "+queryResults[i][0])
          self.store.storePulls(queryResults[i][0], queryResults[i][1])
        }
      }).finally(function(){
        debug("################# SETUP COMPLETE #################")
        self.setupComplete = true
      })
    })
    .catch(function (err) {
      debug("Error:", err);
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
                debug("Username and password required to set Basic Authentication headers.")
                throw new Error("Username and Password required")
              }
              break;
          case "token":
            if ('username' in options && 'password' in options){
              var authHeader = "token "
              authHeader += options.token
              headers["Authorization"] = authHeader
              break;
            } else{
              debug("Token required to set Token Authentication header.")
              throw new Error("Token Required")
            }
          default:
            debug("Only token and basic authentication supported. "+options.authorization+" is not supported.")
            throw new Error("Unsupported Authentication type")

      }
    }

    if ('useragent' in options){
      headers["User-Agent"] = options.useragent
    } else{
      headers["User-Agent"] = config.defaultUserAgent
    }
    return headers
  }

  async awaitSetup(){
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    debug("Awaiting Github Data Fetch Completion")
    var wait = !this.setupComplete
    while (wait){
      await sleep(500)
      wait = !this.setupComplete
    }
  }

}

module.exports = GithubAnalyzer;
