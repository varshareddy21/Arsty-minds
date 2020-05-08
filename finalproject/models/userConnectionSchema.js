var mongoose = require('mongoose');
var userConnectionSchema = new mongoose.Schema({
    username: {type: String, required: true},
    userConnectionList: [
        {
        //user_Id:{type: String, required: true},
        connectionId: {type: String, required: true},
        connectionName: {type: String, required: true},
        connectionTopic: {type: String},
        rsvp: {type: String},
    }]

}, {collection: 'userconnections'});


module.exports.UserConnectionModel = mongoose.model('UserConnection',userConnectionSchema);
