const EventEmitter = require("events").EventEmitter;


class PullRequestStore extends EventEmitter{
  constructor(){
    super()
    this.setEventEmitters()


  }

  testMethod(s){

    console.log("Loggin something")
    console.log(s);
  }

  setEventEmitters(){
    this.on('open', this.testMethod)
    this.on('update', function(toPrint){{
      console.log("THIS IS A WEIRD TEST AS WELL");
    }});
  }


}

module.exports = PullRequestStore
