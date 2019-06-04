var express = require('express');
var router = express.Router();
var Posts = require('../models/posts');
var today = new Date();

router.get('/app', function(req, res, next) {
  res.render('posts/app', { title: 'Post Management' });
});

router.get('/', function(req, res, next) {
  //added timeframe sorting - does it work?
  Posts.find({}, {sort: '-timeframe'}, function(err, posts){
    console.log(posts);
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
