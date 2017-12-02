"use strict"

// const request = require('request');
const request = require('request-promise');
const requestAllPages = require('request-all-pages');
const store = require('./PullRequestStore');
const Promise = require('bluebird');
const config = require('./config.js')
const EventEmitter = require('events').EventEmitter;


class GithubAnalyzer extends EventEmitter {
  constructor(org, options={}){
    super()

    this.org = org
    this.store = new store()

    ///////////////TODOs
    //TODO: modify a list outside the request
    //TODO: deal with pagination
    //TODO: deal with username and password
    //TODO: deal with getting all for organzation
    //TODO: deal with specific repo being passed
    //TODO: extend EventEmitter with the repository class

    //TODO: look into efficient modes of storage


  this.on('testEvent', this.testThisEmit)

  this.headers = { 'User-Agent': 'github-analyzer' }

  this.fetchInformation(this);

  }

  testThisEmit(){
    console.log("GITHUB ANALYZER EVENTEMITTER TRIGGERED")
  }

  getOrgRepos(self, org, headers){
    var repoUri = config.githubApi + config.orgs + config.slash + org + config.repos
    console.log(repoUri)
    // 'https://api.github.com/orgs/realm/repos'
    // https://api.github.com/orgs/lodash/repos
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
    console.log(pullsUri)
    //'https://api.github.com/repos/lodash/lodash.com/pulls?state=all'
    // https://api.github.com/repos/lodash/lodash.com/pulls?state=all
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
      console.log("STORING RESULTS")
      self.store.storeRepos(repos)

      var repoNames = self.store.getRepoNames()
      console.log(repoNames)

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
    .then(function(){
      console.log("testing second then")
      }
    )
    .catch(function (err) {
      console.log("Error:", err);
    });
  }

}

module.exports = GithubAnalyzer;
