"use strict"

const request = require('request');


class GithubAnalyzer {
  constructor(org, repo ="", options={}){

    // var options = {
    //   url: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
    //   method: 'GET',
    //   headers: {
    //     'User-Agent': 'github-analyzer'
    //   }
    // }
    request({
      headers: {
          'User-Agent': 'github-analyzer'
      },
      uri: 'https://api.github.com/repos/lodash/lodash.com/pulls?state=all',
      method: 'GET'
    }, function (err, res, body) {
      console.log("GOT HERE")
      console.log("ERROR: ", err)
      console.log("RES: ", res)
      console.log("BODY: ", body)
      //it works!
    });
  }
}




module.exports = GithubAnalyzer;
