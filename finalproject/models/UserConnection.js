class UserConnection {
  constructor( connectionId, connectionName, connectionTopic, rsvp) {
    //this.user_Id=user_Id;
    this.connectionId=connectionId;
    this.connectionName=connectionName;
    this.connectionTopic=connectionTopic;
    this.rsvp=rsvp;
  }
}

module.exports=UserConnection;
