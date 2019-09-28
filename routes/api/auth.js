//Register a new user
var express = require('express');
var router = express.Router();
var passport = require('passport');

var Users = require('../../models/users');

router.post('/register', function(req,res,next){
  var data = req.body;

  Users.register(new Users({
    username: data.username,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name
  }),
  data.password,
  function(err, user){

    if(err){

      return res.json({
        success: false,
        user: req.body,
        errors: err
      });

    }

    return res.json({
      success: true,
      user: user
    });

  });

});

router.post('/login', function(req, res, next) {
  
  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return res.json({success:false, error: err});
    }

    if (!user) {
      return res.json({success:false, error: info.message });
    }

    req.logIn(user, function(err) {

      if (err) {
        return res.json({success:false, error: err });
      }

      //we will use a console.log() to test the session data
      console.log(req.session); //shows cookie & passport object in terminal window

      return res.json({success:true, user: user });
    });
  })(req, res, next);
});

router.delete('/logout', function(req, res){
//router.get('/logout', function(req, res){ //this was the initial logout function
  //navigate to http://localhost:3001/api/auth/logout to test console log statements
  //console.log(req.session); //shows cookie and passport (in terminal window) before logout
  req.logout();
  //console.log(req.session); //shows cookie and passport (in terminal window) after logout
//   // if(!req.session.passport.user){ //caused errors in other sites using this api
  if(!req.session.passport){
    return res.json({success: 'true'});
  }else{
    return res.json({success: 'false'});
  }
});

module.exports = router;
