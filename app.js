var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

require('./core/mongo');

var authValidator = require('./util/auth-validator');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PATCH, PUT');
    next();
});

app.use(function(req, res, next) {
    if (req.url !== '/api/signin' && req.method !== 'OPTIONS') {
        var authHeader = req.headers["authorization"];
        authValidator.validateAuth(authHeader, function(authPayload) {
            if(!authPayload) {
                res.status(401).json({
                    status: false,
                    data: "Unauthorized"
                });
            } else {
                req.authPayload = authPayload;
                next();
            }
        });
    } else {
        next();
    }
});

var repositoryController = require('./controller/repository');
var authController = require('./controller/auth');

var router = express.Router();

router.route('/signin')
    .post(authController.signin);

router.route('/repositories')
    .get(repositoryController.list);

router.route('/repositories/:name')
    .get(repositoryController.get);

router.route('/repositories/:name/readme')
    .get(repositoryController.getReadme);

app.use('/api', router);

var port = process.env.PORT || 5000;

var server = app.listen(port, function (err) {
    if (err) {
        console.log("Error occurred while running app. ", err);
    } else {
        console.log("App is running on port: ", port);
    }
});

module.exports = server;
