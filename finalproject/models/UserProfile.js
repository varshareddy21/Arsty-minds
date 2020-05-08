var UserConnection = require('./Userconnection');


class UserProfile {
  constructor(username) {
    this.username= username;
    this.userConnectionList=[];
  }
}

module.exports = UserProfile;
