"use strict"

const request = require('request');
const store = require('./PullRequestStore');
const EventEmitter = require("events").EventEmitter;

var myStore = new store()


var testString = "PRINT THIS FUCKING THING"

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

    myStore.emit('open', "this is coming from an event really!")

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














    ///////THIS IS WHAT WORKS BELOW
    // request({
    //   headers: {
    //       'User-Agent': 'github-analyzer'
    //   },
    //   uri: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
    //   method: 'GET'
    // }, function (err, res, body) {
    //   console.log("GOT HERE")
    //   console.log(testGuy)
      // console.log("ERROR: ", err)
      // console.log("RES: ", res)
      // console.log("BODY: ", JSON.parse(body)[0])
      //it works!
    // });
  }

  eventTest(){
    myStore.on('update',  s => myStore.testMethod(s))

    // myStore.emit('update', testString)
    this.emit('update', testString)
  }
}




module.exports = GithubAnalyzer;
