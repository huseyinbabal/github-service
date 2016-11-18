'use strict';

var Github = require('octonode');

var githubClient = new Github.client(process.env.GITHUB_TOKEN);

module.exports.list = function(req, res, next) {
    githubClient.get('/users/' + req.params.username + '/repos', {}, function(err, status, body, headers) {
        if (err) {
            console.log("Error occurred while fetching user repositories for %s, err: %s", req.params.username, err.message);
            res.json({
                status: false,
                data: err.message
            });
        } else {
            res.json({
                status: true,
                data: body
            });
        }
    });
};