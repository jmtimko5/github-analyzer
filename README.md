# github-analyzer
An npm module that will allow user to search through pull requests to an organizations repositories.

A tiny JavaScript debugging utility modelled after Node.js core's debugging technique. Works in Node.js and web browsers.

## Installation

```
$ npm install debug
```
## Usage

github-analyzer will fetch every pull-request associated with the repos in the org specified on instantiation.  Through the searchPulls method the user can filter the organization's pull requests by any top level member variable on the pull request.  Pull request response structure can be found at https://developer.github.com/v3/pulls/.  The result is returned in a Promise. Additionally through the options passed in searchPulls you can filter by the user who submitted the pull request and merged the pull request. Additionally you can filter pull requests by providing a range that you would like restrict your results within.  Instantiating with Github credentials is recommended to prevent Github Rate Limiting issues.  Please see https://developer.github.com/v3/#rate-limiting for more detail.  Examples of how to specify the various query parameters are provided below.  


Example app.js:
```
const analyzer = require('github-analyzer')

var myAnalyzer = new analyzer("lodash",
                              {'authorization': 'basic',
                                'username': <your_username>,
                                'password': <your_password>,
                                'useragent':'test app for github-analyzer'});

//Search within a date range, specifying to restrict results to pulls
//within the lodash.com and lodash repos.
var result = myAnalyzer.searchPulls(
                                  {

                                    'state':['closed'],
                                    'user':['veksen', 'jdalton'],
                                    "created_at":{
                                                  "range_start": "2012-12-02T07:42:33Z",
                                                  "range_end": "2016-12-02T07:42:33Z"
                                                }
                                  },
                                    ["lodash.com", "lodash"]
                                )

//Not specifying any repository searches all the repositories in the organization.  Passing "start" as range_start tells the module to make the date range filter from the beginning of the repository until to the specified end date.  Similarly, passing "end" as range_end tells the module to use the end of time as the upper time range limit.
var result_two = myAnalyzer.searchPulls(
                                  {

                                    'state':['open'],
                                    'merged_by':['jdalton'],
                                    "created_at":{
                                                  "range_start": "start",
                                                  "range_end": "2016-12-02T07:42:33Z"
                                                }
                                  }  
                                  )



```
Note: Whether you want to restrict the pulls returned to match a single or multiple parameter such as ```'user'```, the value of the parameter must be in an array.
