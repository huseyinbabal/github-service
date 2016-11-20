var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PATCH, PUT');
    next();
});

var repositoryController = require('./controller/repository');

var router = express.Router();

router.route('/repositories/:username')
    .get(repositoryController.list);

app.use('/api', router);

var port = process.env.PORT || 3000;

app.listen(port, function (err) {
    if (err) {
        console.log("Error occurred while running app. ", err);
    } else {
        console.log("App is running on port: ", port);
    }
});