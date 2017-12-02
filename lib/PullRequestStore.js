const EventEmitter = require("events").EventEmitter;

//We know that the objects are stored by reference
class PullRequestStore extends EventEmitter{
  constructor(){
    super()
    this.repositoryDict = {}
    this.pullsDict = {}


  }

  storeRepos(repos){
    for (var i = 0; i < repos.length; i++){
      this.repositoryDict[repos[i].name] = repos[i]
    }
  }

  getRepoNames(){
    return Object.keys(this.repositoryDict)
  }

  storePulls(repo, pulls){
    this.pullsDict[repo] = pulls
  }



}

module.exports = PullRequestStore
