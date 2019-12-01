var express = require('express');
var router = express.Router();
const path = require('path');
const upload = require('../../uploadMiddleware');
const Resize = require('../../Resize');
var Posts = require('../../models/posts');
// const multer = require('multer'); // nodeimageupload

router.get('/', function(req, res, next) {
    Posts.find({}, null, {sort: '-timeframe'}, function(err, posts){
        if(err){
         return res.json({'success':false, 'error': err});
       }
        return res.json({'success':true, 'posts': posts});
      });
});

//router.get('/:articleId', function(req,res){});

router.get('/:slug', function(req,res){
  var slug= req.params.slug;
  // console.log('api');
  // console.log(slug);
  // console.log(req.url);
  Posts.findOne({'slug':slug}, function(err, post){
// router.get('/:id', function(req,res){

//   var id = req.params.id;
//   Posts.findOne({'_id':id}, function(err, post){
    if(err){
      return res.json({'success':false, 'error': err});
    }
      return res.json({'success':true, 'post': post});
  });
});

//does this show just the user's own posts? or an admin clicks on a user to see their posts?
router.get('/byUser/:user_id', function(req,res){
  var userID = req.params.user_id;
  Posts.find({'user_id':userID}, null, {sort: '-timeframe'}, function(err, posts){
    if(err){
      return res.json({'success':false, 'error': err});
    }
      return res.json({'success':true, 'posts': posts});
    });
});

router.post('/', upload.single('image'), async function(req, res) {
  // var filename = '';
  if (req.file) {
    // console.log(req.file, req.file.buffer.length);
    const imagePath = 'public/images/uploads';
    const fileUpload = new Resize(imagePath);
    filename = await fileUpload.save(req.file.buffer);
    console.log(filename);
  }
  // console.log("hey");
  Posts.create(new Posts({
    title: req.body.title,
    caption: req.body.caption,
    quote: req.body.quote,
    body: req.body.body,
    // image: filename,
    description: req.body.description,
    keywords: req.body.keywords,
    timeframe: req.body.timeframe,
    user_id: req.session.passport.user.id //'5cf177898a08f059cce02bf6'
  }), function(err, post){
    
    if(err){
      return res.json({success: false, post: req.body, error: err});
    }

    // return res.json({success: true, post: post});
    return res.redirect('../posts/')
  });
});

router.put('/', function(req, res){

  Posts.findOne({'slug': req.body.slug}, function(err, post){

    if(err) {
      return res.json({success: false, error: err});
    }
   //}else if(post) {
    if(post) {
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

      if(data.image){
        post.image = data.image;
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

router.delete('/:slug', function(req,res){

  var slug = req.params.slug;

  Posts.deleteOne({'slug':slug}, function(err,removed){

    if(err){
      return res.json({success: false, error: err});
    }

    return res.json({success: true, status: removed});

  });

});

module.exports = router;