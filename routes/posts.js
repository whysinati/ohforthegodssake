var express = require('express');
var router = express.Router();
var Posts = require('../models/posts');
var today = new Date();

// generates view intended to allow users to see and edit their posts 
router.get('/app', function(req, res, next) {
  res.render('posts/app', { title: 'My Posts' });
});
// generates public listing of all posts (still need to create page view!!!)
router.get('/', function(req, res, next) {
  //added timeframe sorting - does it work?
  Posts.find({}, function(err, posts){
    //console.log(posts);
    if(err)
    {
      return handleError(err);
    }
      return res.render('posts/index', { title: 'Posts / Blog' , posts:posts});
  });
});
//router.get('/:slug', function(req, res, next) {
router.get('/view/:slug', function(req, res, next) {
  Posts.findOne({slug:req.params.slug},function(err, post){
    if(err)
    {
      return handleError(err);
    }
    else{
      return res.render('posts/view', { title: 'My Selected Post' , post:post});
    }
  });
});

//from initial setup -- use this?
// router.get('/cms', function(req, res, next) {
//   res.render('articles/cms', { title: 'CMS' });
// });

module.exports = router;
