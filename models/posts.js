var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

//Create a schema
var Posts = new Schema({
  title: {
    type: String,
    required: [true, 'A title is required']
  },
  slug: {
    type: String,
    required: [true, 'A slug is required'],
    unique: true
  },
  image: String,
  description: String,
  keywords: String,
  body: String,
  caption: String,
  quote: String,
  creator: String,
  timeframe: {
    type: Date
  }
}, {timestamps: true
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   modified: {
//     type: Date
//   }
});

//Auto set the slug prior to validation
Posts.pre('validate', function(next){

  //Do not overwrite the slug if it already exists
  if(this.slug==undefined){
    if(this.title){
      this.slug = slug(this.title).toLowerCase();
    }
  }

  //If no timeframe has been provided use the current date
  if(this.timeframe==undefined){
    this.timeframe = new Date().toISOString();
  }
  //not sure how the line below appeared, but it isn't needed
  //this.timeframe = new Date().toISOString();

  next();
});
  
module.exports = mongoose.model('Posts', Posts);