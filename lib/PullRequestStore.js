const EventEmitter = require("events").EventEmitter;


class PullRequestStore extends EventEmitter{
  constructor(){
    super()
    this.setEventEmitters()

    this.dict = {}


  }

  testMethod(s){
    // this.dict["test"] = s
    // this.dict["willitchange"] = s
    // console.log("Loggin something")
    // console.log(s);
    console.log("yeah we got here we are working on it")
    // this.mutate();
  }

  // mutate(){
  //
  //   //TODO THEY ARE PASS BY REFERENCE LFG LFG LFG LFG LFG
  //   console.log("##############################################################")
  //   console.log(this.dict["test"])
  //   // this.dict["test"] = "hahahha"
  //   this.dict["test"].url = "hahahaha"
  //   console.log("##############################################################")
  //
  //   console.log(this.dict["test"])
  //   console.log("##############################################################")
  //
  //   console.log("IS THIS ANY DIFFERENT FROM ABOVE?!?!?!?!?!?")
  //   console.log(this.dict["willitchange"])
  //
  //   this.check()
  // }

  // check(){
  //   console.log(this.dict["test"].url)
  //   console.log(this.dict["willitchange"].url)
  //
  //   this.dict["willitchange"].url = "cash me ouutside how bou da"
  //
  //   console.log("################## POST CHANGE #################")
  //   console.log(this.dict["willitchange"].url)
  //   console.log(this.dict["test"].url)
  // }

  setEventEmitters(){
    this.on('open', this.testMethod)
  }


}

module.exports = PullRequestStore
