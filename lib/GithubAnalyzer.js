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
    // this.eventTest();

    // myStore.testMethod("PRINT BUT NOT FROM AN EVENT")

    // var ring = function()
    // {
    //     console.log('from an event this time');
    // }


    // myStore.on('open', ring);

    // myStore.on('open', myStore.testMethod);

    // this.on('open', function(){
    //   console.log("hmmm but this works")
    // })

    // myStore.emit('open', "this is coming from an event really!")

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





    // console.log(Promise.resolve(this.getOrgRepos("https://api.github.com/orgs/lodash/repos")))
    // var agh  = githubMethods.getOrgRepos("https://api.github.com/orgs/realm/repos", [], {"User-Agent": "github-analyzer"}, "IS THIS IN SCOPE IN REQUEST?")
    // console.log(agh)
    // agh.then(console.log("STUFF FINISHED UP ##########################"))


    // var requestOpts = {
    // uri: 'https://api.github.com/orgs/realm/repos'
    // , json: true
    // , body: {}
    // , headers: { 'user-agent': 'request-all-pages' }
    // };

  // requestAllPages(requestOpts, function (err, pages) {
  //   if (err) return console.error(err);
  //   var names = pages
  //     .reduce(
  //       function (acc, page) {
  //         acc = acc.concat(page.body.map(function (repo) { return repo.name; }))
  //         return acc;
  //       }
  //     , []);
  //   console.log(names)
  //   console.log(names.length)
  //   myStore.emit('open', names)
  //   // console.log('%s\nTotal: %s', names.join(', '), names.length);
  // })

  var a = function () {
    return new Promise(function(resolve, reject) {
      var requestOpts = {
      uri: 'https://api.github.com/orgs/realm/repos'
      , json: true
      , body: {}
      , headers: { 'user-agent': 'request-all-pages' }
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
        // console.log('%s\nTotal: %s', names.join(', '), names.length);
      })
  })
}

  // a([]).then(function(results){
  //   console.log("PRINTING RESULTS")
  //   console.log(results)
  // })

  this.on('testEvent', this.testThisEmit)


  var callABC = function (self) {
    console.log("callABC()...");
    a()
    .then(function (results) {
      console.log("Done: results:", results);
      self.emit('testEvent')
    })
    .catch(function (err) {
      console.log("Error:", err);
    });
  }

  callABC(this);













    ///////THIS IS WHAT WORKS BELOW
    // request({
    //   headers: {
    //       'User-Agent': 'github-analyzer'
    //   },
    //   uri: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
    //   method: 'GET'
    // }, function (err, res, body) {
    //   // console.log("GOT HERE")
    //   // console.log(testGuy)
    //   // console.log("ERROR: ", err)
    //   // console.log("RES: ", res)
    //   // console.log("BODY: ", JSON.parse(body)[0])
    //   // it works!
    //   myStore.emit('open', JSON.parse(body)[0])
    // });
  }


  getOrgRepos(uri, repos) {
      return request({
        "method": "GET",
        "uri": uri,
        "json": true,
        "resolveWithFullResponse": true,
        "headers": {
          // "Authorization": "Bearer " + github.token,
          "User-Agent": "github-analyzer"
        }
      }).then(function(response) {
        if (!repos) {
          repos = [];
        }
        repos = repos.concat(response.body);
        // console.log(repos.length + " repos so far");
        // console.log(response.headers)
        // console.log(response.headers.link)

        myStore.emit('open', repos)

        if('link' in response.headers){
          if (response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) }).length > 0) {
            console.log("There is more.");
            var next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function(link){ return link.match(/rel="next"/) })[0])[1];
            return this.getOrgRepos(next, repos);
          }
        }
        console.log(repos.length)
        return repos;
      });
    }


    testThisEmit(){
      console.log("GITHUB ANALYZER EVENTEMITTER TRIGGERED")
    }







}




module.exports = GithubAnalyzer;
