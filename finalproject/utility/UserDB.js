var User = require('../models/User');
var Userconnection = require('../models/UserConnection');
var Connection = require('../models/connection');
var Userprofile = require('../models/UserProfile');
var userModel = require('../models/userSchema');
var UserConnectionModel = require('../models/userConnectionSchema')


module.exports.getUserProfile = async function (username) {
   const userProfile = await UserConnectionModel.UserConnectionModel.findOne({'username': username}, function (err, docs) {
        console.log(docs)
    })
    console.log('usrshere',userProfile)
    return userProfile;
};
