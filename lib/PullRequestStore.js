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
    // var result = []
    // for(var name in this.repositories){
    //   result.push(name)
    // }
    //
    // console.log("In getting repo names")
    // console.log(result)
    // console.log("OG", Object.keys(this.repositories))
    return Object.keys(this.repositories)
    // return result
  }

  storePulls(repo, pulls){
    this.pulls[repo] = pulls
  }

  getAllPulls(){

  }

  getPullsForRepo(repo){
    return this.pulls[repo]
  }



}

module.exports = PullRequestStore
