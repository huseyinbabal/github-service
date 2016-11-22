'use strict';

var Github = require('octonode');

module.exports.list = function(req, res, next) {
    var user = req.authPayload.user;
    var githubClient = new Github.client(user.access_token);
    githubClient.get('/users/' + user.username + '/repos', {}, function(err, status, body, headers) {
        if (err) {
            console.log("Error occurred while fetching user repositories for %s, err: %s", user.username, err.message);
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

module.exports.get = function(req, res, next) {
    var user = req.authPayload.user;
    var githubClient = new Github.client(user.access_token);
    githubClient.get('/repos/' + user.username + '/' + req.params.name, {}, function(err, status, body, headers) {
        if (err) {
            console.log("Error occurred while fetching user repository for %s, err: %s", user.username, err.message);
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