var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

require('./core/mongo');

var authValidator = require('./util/auth-validator');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PATCH, PUT');
    next();
});

app.use(function(req, res, next) {
    if (req.url !== '/api/signin') {
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

app.use('/api', router);

var port = process.env.PORT || 5000;

app.listen(port, function (err) {
    if (err) {
        console.log("Error occurred while running app. ", err);
    } else {
        console.log("App is running on port: ", port);
    }
});