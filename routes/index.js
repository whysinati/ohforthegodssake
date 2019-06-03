var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.session); //shows cookie & passport object in terminal window
  res.render('index', { title: 'Gram\'s 100th Birthday!' });
});

module.exports = router;
