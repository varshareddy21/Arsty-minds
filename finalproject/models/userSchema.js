var mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: {type:String,required:true},
    password: {type:String},
    firstName: {type:String},
    lastName: {type:String},
    AddressLine1:{type:String},
    AddressLine2:{type:String},
    City:{type:String},
    State:{type:String},
    PostalCode:{type:String},
    Country:{type:String}
},{collection:'users'});

userSchema.plugin(passportMongoose);
module.exports.UserModel = mongoose.model('UserData',userSchema);
