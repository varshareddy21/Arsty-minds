var connection = require('../models/connection');
var mongoose = require('mongoose');
var ConnectionSchema = require('../models/ConnectionSchema');



module.exports.getConnections = async function()
{
  let connections =[];
  let x;
  await ConnectionSchema.connection.find(function(err, connectionArray){
    //console.log('connection',connectionArray);
    for(let i = 0; i< connectionArray.length; i++)
  {
    x = connection.connection(
        connectionArray[i].username,
        connectionArray[i]._id,
        connectionArray[i].connectionName,
        connectionArray[i].connectionTopic,
        connectionArray[i].Details,
        connectionArray[i].Date,
        connectionArray[i].Time,
        connectionArray[i].imageUrl,
        connectionArray[i].location),
        connections.push(x);
       //console.log(typeof(connectionArray[i].connectionId)) ;
  }
  });
  console.log('connections',connections);

  return connections;
};



module.exports.getConnection = async function (connectionId) {
  console.log("varsha connection Id" + connectionId);
  console.log(typeof (connectionId));
  //console.log(data.length);
  let x;

    await ConnectionSchema.connection.findOne({'_id': connectionId}, function (err, connectionArray) {
      if(err)
      {
        console.log(err);
        return;
      }
      else
      {
        if (!connectionArray) {
          return;
        }
      console.log('connection by ID', connectionArray);
       x = connection.connection(
         connectionArray.username,
         connectionArray._id,
         connectionArray.connectionName,
         connectionArray.connectionTopic,
         connectionArray.Details,
         connectionArray.Date,
         connectionArray.Time,
         connectionArray.imageUrl,
         connectionArray.location);
       console.log('connection ID',JSON.stringify(connectionArray._id))
      }
})
  return x;
}
