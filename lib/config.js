"use strict"

module.exports.githubApi = "https://api.github.com";

module.exports.repos = "/repos"

module.exports.orgs = "/orgs"

module.exports.slash = "/"

module.exports.allPulls = "/pulls?state=all"

module.exports.defaultUserAgent = "github-analyzer"

//GET all repos for org
// https://api.github.com/orgs/lodash/repos

//GET all pull request for repo in org
// https://api.github.com/repos/lodash/lodash.com/pulls?state=all
