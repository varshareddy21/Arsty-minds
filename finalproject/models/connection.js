var connection=function(username, connectionId, connectionName, connectionTopic, details, date, time,imageUrl,location)
{
  var connectionModel = {
    username:username,
    connectionId:connectionId,
    connectionName:connectionName,
    connectionTopic:connectionTopic,
    Details:details,
    Date:date,
    Time:time,
    imageUrl:imageUrl,
    location:location};
  return connectionModel;
}

module.exports.connection = connection;
