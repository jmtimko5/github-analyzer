const EventEmitter = require("events").EventEmitter;

//We know that the objects are stored by reference
class PullRequestStore extends EventEmitter{
  constructor(){
    super()
    this.repositories = {}
    this.pulls = {}
  }

  storeRepos(repos){
    for (var i = 0; i < repos.length; i++){
      this.repositories[repos[i].name] = repos[i]
    }
  }

  getRepoNames(){
    return Object.keys(this.repositories)
  }

  storePulls(repo, pulls){
    this.pulls[repo] = pulls
  }

  getPullsForRepo(repo){
    return this.pulls[repo]
  }
}

module.exports = PullRequestStore
