"use strict"

const request = require('request');


class GithubAnalyzer {
  constructor(org, repo ="", options={}){
    request.get('https://api.github.com/repos/lodash/lodash.com/pulls?state=all')
    .on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response) // 'image/png'
      })
  }
}




export default GithubAnalyzer;
