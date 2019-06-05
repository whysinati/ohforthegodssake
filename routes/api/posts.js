var express = require('express');
var router = express.Router();
var Posts = require('../../models/posts');

router.get('/', function(req, res, next) {
    Posts.find({}, null, {sort: '-timeframe'}, function(err, posts){
        if(err){
         return res.json({'success':false, 'error': err});
       }
        return res.json({'success':true, 'posts': posts});
      });
});

//router.get('/:articleId', function(req,res){});
// router.get('/:slug', function(req,res){
//   var id = req.params.slug;
//   Posts.findOne({slug:req.params.slug}, function(err, post){
router.get('/:id', function(req,res){

  var id = req.params.id;
   Posts.findOne({'_id':id}, function(err, post){
     if(err){
      return res.json({'success':false, 'error': err});
    }
     return res.json({'success':true, 'post': post});
   });
});

//does this show just the user's own posts?
router.get('/byUser/:userID', function(req,res){
  var userID = req.params.userID;
  Posts.find({'userID':userID}, null, {sort: '-timeframe'}, function(err, posts){
    if(err){
      return res.json({'success':false, 'error': err});
    }
      return res.json({'success':true, 'posts': posts});
    });
});

router.post('/', function(req, res) {
  Posts.create(new Posts({
    title: req.body.title,
    caption: req.body.caption,
    quote: req.body.quote,
    body: req.body.body,
    description: req.body.description,
    keywords: req.body.keywords,
    timeframe: req.body.timeframe
  }), function(err, post){
    
    if(err){
      return res.json({success: false, post: req.body, error: err});
    }

    return res.json({success: true, post: post});
    
  });
});

router.put('/', function(req, res){

  Posts.findOne({'_id': req.body._id}, function(err, post){

   if(err) {
     return res.json({success: false, error: err});
   }else if(post) {

      let data = req.body;

      if(data.title){
      post.title = data.title;
      }

      if(data.caption){
        post.caption = data.caption;
        }

      if(data.quote){
        post.quote = data.quote;
        }

      if(data.body){
      post.body = data.body;
      }

      if(data.description){
      post.description = data.description;
      }

      if(data.keywords){
        post.keywords = data.keywords;
        }
    
      if(data.timeframe){
        post.timeframe = data.timeframe;
        post.offset = new Date(data.timeframe).getTimezoneOffset();
        }
      
      post.save(function(err){
        if(err){
          return res.json({success: false, error: err});
        }else{
          return res.json({success: true, post:post});
        }
      });

    }

  });
  
});

router.delete('/:postId', function(req,res){

  var postId = req.params.postId;

  Posts.remove({'_id':postId}, function(err,removed){

    if(err){
      return res.json({success: false, error: err});
    }

    return res.json({success: true, status: removed});

  });

});

module.exports = router;