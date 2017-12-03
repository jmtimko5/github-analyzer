"use strict"

const requestAllPages = require('request-all-pages');
const store = require('./PullRequestStore');
const Promise = require('bluebird');
const config = require('./config.js')


class GithubAnalyzer {
  constructor(org, options={}){

    this.org = org
    this.store = new store()

    this.headers = this.makeHeaders(options)

    ///////////////TODOs
    //TODO: look into efficient modes of storag

    this.fetchInformation(this);

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
      console.log(requestOpts)
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
        resolve(pulls)
      })
  })
  }

  fetchInformation(self){
    self.getOrgRepos(self, self.org, self.headers)
    .then(function (repos) {
      self.store.storeRepos(repos)

      var repoNames = self.store.getRepoNames()

      for (var i = 0 ; i < repoNames.length; i++){
        console.log(repoNames[i])
        self.getRepoPulls(self, self.org, repoNames[i], self.headers)
        .then(function(pulls){
          console.log("################################### PULLS ##################################")
          console.log(pulls.length)
          self.store.storePulls(repoNames[i], pulls)
        })
      }


    })
    .catch(function (err) {
      console.log("Error:", err);
    });
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
