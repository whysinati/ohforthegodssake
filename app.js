var createError = require('http-errors');
var express = require('express'); //Z import the express framework into my app 
var path = require('path'); //Z for working with and handling paths
var cookieParser = require('cookie-parser'); //ZExpress middleware that helps handle cookies -- the request object will have a cookies object which can be accessed in the app
var logger = require('morgan'); //Z Express middleware for logging requests and responses--use during dev to see what requests are being made, but can remove w/o consequences
var Recaptcha = require('express-recaptcha').RecaptchaV3;
//import Recaptcha from 'express-recaptcha'
var recaptcha = new Recaptcha('SITE_KEY', 'SECRET_KEY');
var dateFormat = require('dateformat');
var mongoose = require('mongoose'); //ODM (Object Document Mapper)
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/users');
//Z 'dummy' pages to show how routing works and/or to separate some of the routing into other files for easier management
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var apiUsersRouter = require('./routes/api/users');
var apiAuthRouter = require('./routes/api/auth');
var apiPostsRouter = require('./routes/api/posts');
var app = express();

if(process.env.NODE_ENV==='production'){
  var config = require('../config.prod');
}else{
//Test the dev config file //remove for production
  var config = require('./config.dev');
}
//Connect to MongoDB
mongoose.connect(config.mongodb, { useNewUrlParser: true });
// view engine setup //Z path.join() method normalizes all the arguments into a path string
app.set('views', path.join(__dirname, 'views')); //Z __dirname with path.join() sets the apps view folder to .../gram/views (however doesn't check if path exists! -- mainly used to transform path strings)
//Z line above: tells Express to use the /views folder in the app (gram) directory
app.set('view engine', 'pug'); //Z tells Express to use the Pug templating engine (it simplifies the HTML files and --really handy-- conditionals. files will be saved as .pug instead of .html)
//Z app.use() tells the app to use the parameters it's given, such as a path or a path and a function
app.use(logger('dev')); //Z logs requests to the console, such as method, status code and response time
app.use(express.json()); //Z why not use bodyParser.json()? is this providing the ability to parse JSON?
// app.use(express.urlencoded({ extended: false })); //Z allows the app to read data from URL GET requests; by default {extended: true}, but querystring module will be needed
app.use(express.urlencoded({ extended: true })); // changed for reCAPTCHA
app.use(cookieParser()); //Z adds a cookie object to all the requests you get
app.use(dateFormat);
app.use(express.static(path.join(__dirname, 'public'))); //Z tells the app to use the /public directory where images, stylesheets and scripts are stored

app.use(require('express-session')({
  //Define the session store
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  //Set the secret
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    domain: config.cookie.domain,
    //httpOnly: true,
    //secure: true,
    maxAge:3600000 //1 hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Users.createStrategy());
passport.serializeUser(function(user, done){
  done(null,{
    id: user._id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    admin: user.admin
  });
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

app.use(function(req,res,next){
  console.log('LOCALSXXXXX'); // + res.locals);
  res.locals.session = req.session;
  //these six lines are from 1903
  res.locals.showLogin = true;
  // console.log('res.locals BEFORE ' + res.locals.showlogin); //undefined
  if(req.session.passport){
    if(req.session.passport.user){
      res.locals.showLogin = false;
    }
  }
  // console.log('res.locals AFTER ' + res.locals.showlogin); //undefined
  next();
});

//Session based access control
app.use(function(req,res,next){
  //Uncomment the following line to allow access to everything.
  //return next();

  //Allow any endpoint that is an exact match. The server does not
  //have access to the hash so /auth and /auth#xxx would both be considered 
  //exact matches.
  var whitelist = [
    '/',
    '/auth',
    '/posts'
  ];

  //req.url holds the current URL
  //indexOf() returns the index of the matching array element
  //-1, in this context means not found in the array
  //so if NOT -1 means is found in the whitelist
  //return next(); stops execution and grants access
  if(whitelist.indexOf(req.url) !== -1){
    return next();
  }

  //Allow access to dynamic end points
  var subs = [
    '/public/',
    '/api/auth/',
    '/posts/'
  ];

  //The query string provides a partial URL match beginning
  //at position 0. Both /api/auth/login and /api/auth/logout would would 
  //be considered a match for /api/auth/
  for(var sub of subs){
    if(req.url.substring(0, sub.length)===sub){
      return next();
    }
  }

  //There is an active user session, allow access to all endpoints.
  if(req.isAuthenticated()){
    return next();
  }

  //There is no session nor are there any whitelist matches. Deny access and
  //redirect the user to the login screen.
  return res.redirect('/auth#login');
});
//Z these are the routing methods 
//Z (first parameter is the path and the second is the function to execute)
//Z (for example, the app goes to /routes/auth.js (?) to find/execute the authRouter function)
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users/', usersRouter); //remove this feature?
app.use('/posts/', postsRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/auth', apiAuthRouter);
app.use('/api/posts', apiPostsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Test the dev config file
//remove for production
//console.log(config); //cli npm start reveals JSON mongodb connection

module.exports = app;
