var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('auth/index', { title: 'Authenticate User' });
});
router.get('/logout', function(req, res){
  req.logout();
  //res.redirect('/auth');  //this will redirect to login
  res.redirect('/'); //this will go back to home, based on current settings
});
module.exports = router;
