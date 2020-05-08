var express=require('express');
var router=express.Router();
var bodyParser= require('body-parser');
var session = require('express-session');
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var User = require('../models/userSchema');
var userDB= require('../utility/UserDB');
var passport = require('passport');
var { check, validationResult } = require('express-validator');

var Userprofile = require('../models/UserProfile');
var connectionDB = require('../utility/connectiondb');
var UserConnection = require('../models/UserConnection');
var UserConnectionModel = require('../models/userConnectionSchema');
router.use(bodyParser.urlencoded({
    extended: false
}));


// user login functionality
router.get('/signin', function(req,res)
{
    res.render('login',{valid:false,error:undefined});
});

router.post('/login',urlEncodedParser,[
  check('username').isEmail().withMessage('username must be a email')],function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
          var errors =validationResult(req);
          if(!errors.isEmpty()){
              return res.render('login',{valid:false,error:errors.array()})
          }
          if (err) { return next(err); }
          if (!user) { return res.render('login',{valid:true,error:undefined}); }
          req.logIn(user, async function(err) {
              if (err) { return next(err); }
              req.session.userProfile =  await userDB.getUserProfile(req.user.username);
              console.log(req.session.userProfile);
              if(req.session.userProfile == null)
              {
                  req.session.userProfile = new Userprofile(req.user.username);
                  const userprofile = new UserConnectionModel.UserConnectionModel(req.session.userProfile);
                  userprofile.save();
              }
              console.log("User Data",req.session.userProfile);
              console.log('user logged in');
              //req.flash('success',`logged in as ${req.user.firstName}`);
              return res.redirect('/myconnections');
          });
      })(req, res, next);
  });





//user logout functionality
router.get('/signout',  function(req,res)
{
    req.logout();
    req.session.destroy();
    res.redirect("/");

});

router.get("/register", function(req,res){
    return res.render("register",{error:undefined, verror:undefined});
});

router.post("/register", [check('username').isEmail().withMessage('username must be a email'),
    check('password').isLength({ min: 8, max: 20})
        .withMessage('Password must be 8-20 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i')
        .withMessage('Password must include lowercase,uppercase, special characters & number'),
    check('city').matches(/^[a-zA-Z ]*$/).withMessage('city name should only consist Alphabets and spaces'),
    check('state').matches(/^[a-zA-Z ]*$/).withMessage('state name should only consist Alphabets and spaces'),
    check('zipCode').isNumeric().withMessage('zipCode must be a number'),
    check('country').matches(/^[a-zA-Z ]*$/).withMessage('country name should only consist Alphabets and spaces')],
function(req, res){
  var errors =validationResult(req);
  if(!errors.isEmpty()){
      return res.render('register',{error:undefined, verror:errors.array()})
  }
    var newUser = new User.UserModel({
                            username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            address1:req.body.address1,
                            address2:req.body.address2,
                            city:req.body.city,
                            state:req.body.state,
                            zipCode:req.body.zipCode,
                            country:req.body.country
                            });
        User.UserModel.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register",{verror:undefined,error : err});
        }
        passport.authenticate("local")(req, res, function(){
          //req.flash('success','Successfully Registered..Please login to explore new features')
          res.redirect("/");
        });
    });
});


router.get('/savedConnections', function(req,res)
{
  var data = req.session.userProfile;
  res.render('savedConnections', {data:data, error:req.flash('error')});
    //, message:req.flash('error'), success:req.flash('success')});
})


router.get('/savedConnections/delete/:id', function(req,res)
{
  var id = req.params.id;
  console.log(req.session.userProfile.userConnectionList);
  UserConnectionModel.UserConnectionModel.findOne({'username':req.user.username},function(err, doc)
  {
      if(err)
      {
          console.log(err);
      }
      else
      {
          console.log(doc.userConnectionList);
          var index = getSelectedconnection(req.session.userProfile.userConnectionList, id)
          if(index === -1)
          {
              console.log("items not in list");
              res.redirect("/");
          }
          else {
                  doc.userConnectionList.splice(index,1)
                  doc.save();
                  req.session.userProfile.userConnectionList.splice(index, 1);
                  console.log(req.session.userProfile.userConnectionList)
                  res.redirect('/savedConnections');
          }

      }
  })
});


router.get('/connections/connection/:id/save/:rsvp',async function(req,res) {
    UserConnectionModel.UserConnectionModel.findOne({'username': req.user.username},async function (err, doc) {
      console.log('doc',doc);
            var index = getSelectedconnection(doc.userConnectionList, req.params.id);
            if (index === -1) {
                let connection = await connectionDB.getConnection(req.params.id);
                console.log('new connection value', connection);
                let newconnection = new UserConnection(connection.connectionId, connection.connectionName, connection.connectionTopic, req.params.rsvp);
                console.log(newconnection);
                doc.userConnectionList.push(newconnection);
                doc.save();
                req.session.userProfile.userConnectionList.push(newconnection)
                req.session.save();
                //req.flash("success", "new connection was saved to 'Your Connections'")
                res.redirect('/savedConnections');
            } else {
                let connection = await connectionDB.getConnection(req.params.id);
                let newconnection = new UserConnection(connection.connectionId, connection.connectionName, connection.connectionTopic, req.params.rsvp);
                console.log('updated connection',newconnection);
                doc.userConnectionList[index] = newconnection;
                doc.save();
                req.session.userProfile.userConnectionList[index] = newconnection;
                req.session.save();
                //req.flash("success", "A connection response was updated in 'Your Connections'")
                res.redirect('/savedConnections');
            }

        }
    )
})

var getSelectedconnection = function(list,id)
{
  for(let index= 0; index< list.length; index++)
  {
    if(list[index].connectionId == id)
    {
      return index;
    }
  }
  return -1;
}

// router.get('/*',function(req,res){
//   res.render('/');
// });


module.exports = router;
