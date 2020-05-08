var mongoose = require('mongoose');

var ConnectionSchema = new mongoose.Schema({
  username:{type:String, required: true},
  connectionName: {type: String,required: true},
  connectionTopic: {type: String,required: true},
  Details: {type: String,required: true},
  Date: {type: String,required: true},
  Time: {type: String,required: true},
  imageUrl: {type: String,required: true},
  location: {type: String,required: true}
},{collection:'connections'});
module.exports.connection = mongoose.model("connection", ConnectionSchema);
