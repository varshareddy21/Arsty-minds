var express=require('express');
var router=express.Router();
var connectionDB= require('../utility/connectiondb.js');
var UserProfile = require('../models/UserProfile');
var Userconnection = require('../models/UserConnection');
var ProfileController = require('./ProfileController');
var connectionModel = require('../models/ConnectionSchema');
var bodyParser = require('body-parser');
var { check, validationResult } = require('express-validator');
var middleware = require('../middleware/middleware')

router.get('/',function(req,res)
{
  res.render('index');
});

router.use(bodyParser.urlencoded({
    extended: false
}));
connections = async function (req, res) {
  var connectionTypes = await getconnectionTopic();
  var connections = await connectionDB.getConnections();
  console.log(connections);
  var data = {
    'types': connectionTypes,
    'connections': connections
  }
  res.render('connections', {data: data});
    //, success:req.flash('success')});
}


 connection = async function(req,res)
 {
   res.render('newConnection',{vtime:undefined, error:undefined});
 }

individualconnection = async function (req, res) {
  //console.log("blah blah" + req.params.connectionId);
  var unique_conn = await connectionDB.getConnection(req.params.connectionId);
  console.log(unique_conn);
  if (!unique_conn) {
    console.log('/');
    req.flash("error", "connection you're trying to update was deleted by the Owner");
    return res.redirect('/savedConnections/delete/'+req.params.connectionId);
  }
  res.render('connection', {data: unique_conn});
  //, success:req.flash('success')});
}


userconnections = function(req,res)
  {
    res.render('myconnections');
  }

  router.get('/about' ,function(req,res)
  {
    res.render('about');
  });

  router.get('/contact',function(req,res)
  {
    res.render('contact');
  });

  var getconnectionTopic = async function () {
    let connectionTopics = [];
    let data = await connectionDB.getConnections();
    //console.log('this data is not executing', data);
    data.forEach(function (connection) {
      if (!connectionTopics.includes(connection.connectionTopic)) {
        console.log(connection.connectionTopic)
        connectionTopics.push(connection.connectionTopic);
      }
    });
    return connectionTopics;
  }

  router.get('/connections', connections);
  router.get('/savedConnections', userconnections);
  router.get('/connections/newConnection', connection);
  router.get('/connections/connection/:connectionId', individualconnection);
  router.get('/connections/newConnection' ,connection);


  router.post('/connections/newConnection',[
 check('connectionName').isLength({ min: 3 }).withMessage('must be Alphabets'),
 check('location').isLength({min:5}).withMessage('location must contain minimum 5 characters'),
 check('details').isLength({ min: 10}).withMessage('details contain minimum 10 characters'),
], function(req,res){
  var errors =validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    res.render('newConnection',{error:errors.array(), vtime:undefined})
  }
  else{
    console.log(req.body);
    const connection = new connectionModel.connection(
        {
          username:req.user.username,
          connectionName: req.body.connectionName,
          connectionTopic: req.body.connectionTopic,
          hostName: req.user.firstName,
          imageUrl: "/images/photo.jpg",
          Date: req.body.date,
          Time:req.body.Time,
          location: req.body.location,
          Details: req.body.details
        })
        console.log(connection,"in connection controller");
        connection.save(function(err, doc)
        {
          if(err)
          {
            console.log(err);
          }
          console.log('document body',doc);
          //req.flash('success','New connection was posted');
          res.redirect('/connections');

        });
      }
  });


  router.get("/connections/connection/:id/edit", middleware.checkOwnership, function(req, res){
      connectionModel.connection.findById(req.params.id, function(err, connection){
          console.log(connection);
          res.render("editcon", {connection: connection});
          });
      });


      router.put("/connections/connection/:id", middleware.checkOwnership, function(req, res){
          // find and update the correct campground
          req.body.username = req.user.username;
          req.body.hostName = req.user.firstName;
          req.body.imgUrl = "/images/photo.jpg";
          connectionModel.connection.findByIdAndUpdate(req.params.id, req.body, function(err, updatedcon){
              if(err) {
                  console.log(updatedcon);
                  res.redirect("/connections");
              }
              else {
                  //redirect somewhere(show page)
                  //req.flash('success','connection was successfully edited');
                  console.log("/connections/connection"+req.params.id);
                  res.redirect("/connections/connection/"+req.params.id);
              }
          });
      })



      router.delete("/connections/connection/:id",middleware.checkOwnership,  function(req, res){
          connectionModel.connection.findByIdAndRemove(req.params.id, function(err){
              if(err){
                  res.redirect("/connections");
              }
              else {
                  //req.flash('success','connection was successfully deleted');
                  res.redirect("/connections");
              }
          });
      });







  router.get('/*',function(req,res)
  {
    res.redirect('/');
  });

module.exports = router;
