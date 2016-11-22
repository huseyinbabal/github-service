'use strict';
var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    uuid = require('node-uuid');

var User = mongoose.model('User');

module.exports.signin = function(req, res, next) {
    var accessToken = req.body.access_token;
    var githubData = req.body.github;

    User.findOne({username: githubData.login}, function(err, user) {
        if (err) {
            console.error("Error occurred while getting user: ", err);
            res.json({
                status: false,
                data: "Technical error occurred"
            });
        } else {
            if (user != null) {
                user.access_token = accessToken;
                user.save(function (err, user) {
                    if (err) {
                        console.error("Error occurred while saving user: ", err);
                        res.json({
                            status: false,
                            data: "Technical error occurred"
                        });
                    } else {
                        res.json({
                            status: true,
                            data: jwt.sign({
                                jti: uuid.v4()
                            }, process.env.JWT_SECRET, {
                                subject: user.username,
                                issuer: process.env.JWT_ISSUER
                            })
                        });
                    }
                });
            } else {
                var userModel = new User();
                userModel.name = githubData.name;
                userModel.username = githubData.login;
                userModel.github = githubData;
                userModel.access_token = accessToken;
                userModel.save(function (err, user) {
                    if (err) {
                        console.error("Error occurred while saving user: ", err);
                        res.json({
                            status: false,
                            data: "Technical error occurred"
                        });
                    } else {
                        res.json({
                            status: true,
                            data: jwt.sign({
                                jti: uuid.v4()
                            }, process.env.JWT_SECRET, {
                                subject: user.username,
                                issuer: process.env.JWT_ISSUER
                            })
                        })
                    }
                })
            }
        }
    });
};