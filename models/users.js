var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose');
//try? var crypto = require('crypto');

//Create a schema
var Users = new Schema({
  hash: {
    type: String,
    required: [
      true,
      'There was a problem creating your password'
    ]
  },
  salt: {
    type: String,
    required: [
      true,
      'There was a problem creating your password'
    ]
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: [true, 'Email must be unique']
  },
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: [true, 'Usernames must be unique']
  },
  first_name: String,
  last_name: String,
  bio: String,
  image: String, //blob,
  admin: {
    type: Boolean,
    default: false
  }
}, {timestamps: true
  // created: {
  //   type: Date,
  //   default: Date.now
  // },
  // modified: {
  //   type: Date,
  //   default: Date.now
  // }

});

//Add unique validation properties to the model
Users.plugin(uniqueValidator, {message: 'is already taken.'});
Users.plugin(passportLocalMongoose);

// Users.pre('save', function(next){
//   this.modified = new Date().toISOString();
//   next();
// });

//try? method to set passwords
// Users.methods.setPassword = function(password){
//   this.salt = crypto.randomBytes(16).toString('hex');
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
// };
//try? method to validate passwords
// Users.methods.validPassword = function(password) {
//   var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
//   return this.hash === hash;
// };
//see https://thinkster.io/tutorials/node-json-api/creating-the-user-model

module.exports  = mongoose.model('Users', Users);
