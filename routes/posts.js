var express = require('express');
var router = express.Router();
var Posts = require('../models/posts');
var today = new Date();

// generates view intended to allow logged in users to see and edit their posts 
router.get('/app', function(req, res, next) {
  res.render('posts/app', { title: 'My Posts' });
});

// generates view intended to allow logged in users to see and edit their posts 
router.get('/app/:user_id', function(req, res, next) {
  Posts.find({user_id:req.params.user_id}, function(err, posts){
    //console.log(posts);
    if(err)
    {
      return handleError(err);
    }
      return res.render('posts/app', { title: 'Just My Posts' , posts:posts});
  });

  // res.render('posts/app', { title: 'Just My Posts' });
});

// generates public listing of all posts (rendered by posts>index.pug)
router.get('/', function(req, res, next) {
  //added timeframe sorting - does it work?
  Posts.find({}, function(err, posts){
    //console.log(posts);
    if(err)
    {
      return handleError(err);
    }
      return res.render('posts/index', { title: 'Gram-tales' , posts:posts});
  });
});

// generates public listing of clicked post (page view rendered by posts>view.pug)
//router.get('/:slug', function(req, res, next) {
router.get('/view/:slug', function(req, res, next) {
  Posts.findOne({slug:req.params.slug},function(err, posts){
    if(err)
    {
      return handleError(err);
    }
    else{
      // console.log('from_app');
      // console.log(req.params.slug);
      return res.render('posts/view', { title: 'Selected Story' , post:posts});
    }
  });
});

//from initial setup -- use this?
// router.get('/cms', function(req, res, next) {
//   res.render('articles/cms', { title: 'CMS' });
// });

module.exports = router;
