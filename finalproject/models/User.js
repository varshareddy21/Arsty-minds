class User{


  constructor(username,firstName,lastName,email,AddressLine1,AddressLine2,City,State,PostalCode,Country){
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.AddressLine1 = AddressLine1;
    this.AddressLine2 = AddressLine2;
    this.City = City;
    this.State = State;
    this.PostalCode = PostalCode;
    this.Country = Country;
  }
}

module.exports = User;
