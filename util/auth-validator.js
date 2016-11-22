'use strict';

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken');

var User = mongoose.model('User');

module.exports = {
    validateAuth: function (data, callback) {
        if(!data) {
            callback(null);
            return;
        }

        data = data.split(" ");
        if(data[0] !== "Bearer" || !data[1]) {
            callback(null);
            return;
        }

        var token = data[1];
        try {
            var payload = jwt.verify(token, process.env.JWT_SECRET);

            User.findOne({ username: payload.sub }, function(err, user) {
                if(err) {
                    console.error("Error occured while getting user on validating auth: ", err);
                } else {
                    callback({
                        user: user,
                        jwt: payload
                    });
                }
            });
        } catch(err) {
            console.error("Error occured while validating auth: ", err);
            callback(null);
        }
    }
};