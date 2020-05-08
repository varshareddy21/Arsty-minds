var express =require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var viewPath = path.join(__dirname, './views');
var flash = require('connect-flash');
var catalogcontroller = require('./controller/connectioncontroller.js');
var profilecontroller = require('./controller/profileController.js');
const mongoose = require('mongoose');
const helmet = require('helmet');
const passport    = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/userSchema');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', viewPath);

app.use(methodOverride("_method"));
app.use(express.static('assets'));
app.use(helmet());
app.use(session({secret:"voyage",
  resave: false,
  saveUninitialized: true,}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.UserModel.authenticate()));
passport.serializeUser(User.UserModel.serializeUser());
passport.deserializeUser(User.UserModel.deserializeUser());


app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.userprofile = req.session.userProfile;
  next()
})


mongoose.connect('mongodb://localhost/Event5',{ useNewUrlParser: true },function(err){
  if(err) throw err;
  console.log("Successfully connected!!");
});


app.use('/',profilecontroller);
app.use('/',catalogcontroller);


app.listen(8080);
console.log("server started, listening to port 8080");
