"use strict"

// const request = require('request');
const request = require('request-promise');
const store = require('./PullRequestStore');
const EventEmitter = require("events").EventEmitter;

var Promise = require("bluebird");




var requestAllPages = require('request-all-pages');


var myStore = new store()

var githubMethods = {
  getOrgRepos: function (uri, repos, headers, testScope) {

    return new Promise(request({
      "method": "GET",
      "uri": uri,
      "json": true,
      "resolveWithFullResponse": true,
      "headers": headers
    }).then(function(response) {
      if (!repos) {
        repos = [];
      }
      repos = repos.concat(response.body);
      // console.log(repos.length + " repos so far");
      // console.log(response.headers)
      // console.log(response.headers.link)

      myStore.emit('update-repos', response.body)

      if('link' in response.headers){
        if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
          console.log("There is more.");
          var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
          Promise(githubMethods.getOrgRepos(next, repos, headers));
        }
      }
      console.log(repos.length)
      console.log(testScope)
      // repos;
    }).finally(
      function(){
        console.log("THIS SHOULD BE LAST")
      }
    )
  );

    //   return request({
    //     "method": "GET",
    //     "uri": uri,
    //     "json": true,
    //     "resolveWithFullResponse": true,
    //     "headers": headers
    //   }).then(function(response) {
    //     if (!repos) {
    //       repos = [];
    //     }
    //     repos = repos.concat(response.body);
    //     // console.log(repos.length + " repos so far");
    //     // console.log(response.headers)
    //     // console.log(response.headers.link)
    //
    //     myStore.emit('update-repos', response.body)
    //
    //     if('link' in response.headers){
    //       if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
    //         console.log("There is more.");
    //         var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
    //         githubMethods.getOrgRepos(next, repos, headers);
    //       }
    //     }
    //     console.log(repos.length)
    //     repos;
    //   });
    }
}


class GithubAnalyzer extends EventEmitter {
  constructor(org, repo ="", options={}){
    super()


    // var options = {
    //   url: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
    //   method: 'GET',
    //   headers: {
    //     'User-Agent': 'github-analyzer'
    //   }
    // }

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
      return new Promise(function(resolve, reject) {
        var requestOpts = {
        uri: 'https://api.github.com/orgs/realm/repos',
        json: true,
        body: {},
        headers: headers
        };
        requestAllPages(requestOpts, function (err, pages) {
          if (err) return console.error(err);
          var names = pages
            .reduce(
              function (acc, page) {
                acc = acc.concat(page.body.map(function (repo) { return repo.name; }))
                return acc;
              }
            , []);
          console.log(names)
          console.log(names.length)
          myStore.emit('open', names)
          resolve(names)
        })
    })
  }

  getRepoPulls(self, uri, headers){
    return new Promise(function(resolve, reject) {
      var requestOpts = {
      uri: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
      json: true,
      body: {},
      headers: headers
      };
      requestAllPages(requestOpts, function (err, pages) {
        if (err) return console.error(err);
        var names = pages
          .reduce(
            function (acc, page) {
              acc = acc.concat(page.body)
              return acc;
            }
          , []);
        console.log(names.length)
        resolve(names)
      })
  })
  }

  fetchInformation(self){
    self.getOrgRepos(self, "lodash", self.headers)
    .then(function (results) {
      console.log("Done: results:", results);
      // self.emit('testEvent')
      self.getRepoPulls(self, "the uri we need", self.headers)
      .then(function(pulls){
        console.log("################################### PULLS ##################################")
        console.log(pulls.length)
      })
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
