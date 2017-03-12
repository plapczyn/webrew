/***********************************************************************
* Author Paul Lapczynski
* Class List
* {Brewfile}
* {Coffee}
* {Favorite}
* {AdvancedRebrew}
* {Rebrew}
***********************************************************************/


/***********
* Functions
************/

class _BaseCollection {
  constructor(){

  }

  Multi(listOfObjects){
    let returnObject = {};
    listOfObjects.forEach((e) => {
      returnObject.Assign(returnObject, e);
    });
    return returnObject;
  }
}

class _Brewfile {
  constructor(username, imageURL, tagline, _id){
    console.log(arguments);
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      // super();
      this._constructor(arguments[0]);
      return;
    }

    // super();
    this._id = _id
    this.Username = username;
    this.ImageUrl = imageURL;
    this.Tagline = tagline;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
        case '_id':
        this._id = advancedRebrew[e];
        break;
        case 'username':
        this.Username = advancedRebrew[e];
        break;
        case 'imageurl':
        this.ImageUrl = advancedRebrew[e];
        break;
        case 'tagline':
        this.Tagline = advancedRebrew[e];
        break;
        default:
      }
    });
  }

  Get(){
    let ret = {}
    Object.keys(this).forEach((e) => {
      ret[e] = (this[e] != null)? this[e] : null;
    });
    return ret;
  }

  Only_id(){
    return {
      _id: this._id
    }
  }

  OnlyUsername(){
    return {
      Username: this.Username
    }
  }

  OnlyImageUrl(){
    return {
      ImageUrl: this.ImageUrl
    }
  }

  OnlyTagline(){
    return {
      Tagline: this.Tagline
    }
  }
}

class _Coffee extends _BaseCollection {
  constructor(coffeeName, coffeeRoast, coffeeDescription, imageUrl, createdAt, coffeeOwner, username, averageRating, _id){

    super();
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      super();
      this._constructor(arguments[0]);
      return;
    }
    this._id = _id
    this.CoffeeName = coffeeName;
    this.CoffeeRoast = coffeeRoast;
    this.CoffeeDescription = coffeeDescription;
    this.ImageUrl = imageUrl;
    this.CreatedAt = createdAt;
    this.CoffeeOwner = coffeeOwner;
    this.Username = username;
    this.AverageRating = averageRating;
  }
  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
        case '_id':
        this._id = advancedRebrew[e];
        break;      case 'coffeename':
        this.CoffeeName = advancedRebrew[e];
        break;
        case 'coffeeroast':
        this.CoffeeRoast = advancedRebrew[e];
        break;
        case 'coffeedescription':
        this.CoffeeDescription = advancedRebrew[e];
        break;
        case 'imageurl':
        this.ImageUrl = advancedRebrew[e];
        break;
        case 'createdat':
        this.CreatedAt = advancedRebrew[e];
        break;
        case 'coffeeowner':
        this.CoffeeOwner = advancedRebrew[e];
        break;
        case 'username':
        this.Username = advancedRebrew[e];
        break;
        case 'averagerating':
        this.AverageRating = advancedRebrew[e];
        break;
        default:
      }
    });
  }

  Get(){
    let ret = {}
    Object.keys(this).forEach((e) => {
      ret[e] = (this[e] != null)? this[e] : null;
    });
    return ret;
  }

  Only_id(){
    return {
      _id: this._id
    }
  }

  OnlyCoffeeName(){
    return {
      CoffeeName: this.CoffeeName
    }
  }

  OnlyCoffeeRoast(){
    return {
      CoffeeRoast: this.CoffeeRoast
    }
  }

  OnlyCoffeeDescription(){
    return {
      CoffeeDescription: this.CoffeeDescription
    }
  }

  OnlyImageUrl(){
    return {
      ImageUrl: this.ImageUrl
    }
  }

  OnlyUsername(){
    return {
      Username: this.Username
    }
  }

  OnlyCreatedAt(){
    return {
      CreatedAt: this.CreatedAt
    }
  }

  OnlyCoffeeOwner(){
    return {
      CoffeeOwner: this.CoffeeOwner
    }
  }

  OnlyAverageRating(){
    return {
      AverageRating: this.AverageRating
    }
  }
}

class _Favorite extends _BaseCollection {

  constructor(username, coffeeId, _id){
    // Is a loosly formatted objected passed in?

    super();
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      this._constructor(arguments[0]);
      return;
    }
    this._id = _id;
    this.Username = username;
    this.CoffeeId = coffeeId;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
        case '_id':
        this._id = advancedRebrew[e];
        break;
        case 'username':
        this.Username = advancedRebrew[e];
        break;
        case 'coffeeid':
        this.CoffeeId = advancedRebrew[e];
        break;
        default:
      }
    });
  }

  Get(){
    let ret = {}
    Object.keys(this).forEach((e) => {
      ret[e] = (this[e] != null)? this[e] : null;
    });
    return ret;
  }

  OnlyUsername(){
    return {
      Username: this.Username
    }
  }

  OnlyCoffeeId(){
    return {
      CoffeeId: this.CoffeeId
    }
  }

  Only_id(){
    return {
      _id: this._id
    }
  }
}

class _Rebrew extends _BaseCollection {
  constructor(coffeeId, coffeeName, rebrew, rating, title, reviewDate, owner, user, _id){

    super();
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      super();
      this._constructor(arguments[0]);
      return;
    }
    this._id = _id
    this.CoffeeId = coffeeId;
    this.CoffeeName = coffeeName;
    this.Rebrew = rebrew;
    this.Rating = rating;
    this.Title = title;
    this.ReviewDate = reviewDate;
    this.Owner = owner;
    this.User = user;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
        case '_id':
        this._id = advancedRebrew[e];
        break;
        case 'coffeeid':
        this.CoffeeId = advancedRebrew[e];
        break;
        case 'coffeename':
        this.CoffeeName = advancedRebrew[e];
        break;
        case 'rebrew':
        this.Rebrew = advancedRebrew[e];
        break;
        case 'rating':
        this.Rating = advancedRebrew[e];
        break;
        case 'title':
        this.Tile = advancedRebrew[e];
        break;
        case 'reviewdate':
        this.ReviewDate = advancedRebrew[e];
        break;
        case 'owner':
        this.Owner = advancedRebrew[e];
        break;
        case 'user':
        this.User = advancedRebrew[e];
        break;
        default:
      }
    });
  }

  Get(){
    let ret = {}
    Object.keys(this).forEach((e) => {
      ret[e] = (this[e] != null)? this[e] : null;
    });
    return ret;
  }

  OnlyCoffeeId(){
    return {
      CoffeeId: this.CoffeeId
    }
  }

  Only_id(){
    return {
      _id: this._id
    }
  }

  OnlyCoffeeName(){
    return {
      CoffeeName: this.CoffeeName
    }
  }

  OnlyRebrew(){
    return {
      Rebrew: this.Rebrew
    }
  }

  OnlyRating(){
    return {
      Rating: this.Rating
    }
  }

  OnlyTile(){
    return {
      Tile: this.Tile
    }
  }

  OnlyReviewDate(){
    return {
      ReviewDate: this.ReviewDate
    }
  }

  OnlyOwner(){
    return {
      Owner: this.Owner
    }
  }

  OnlyUser(){
    return {
      User: this.User
    }
  }
}

class _AdvancedRebrew extends _BaseCollection {
  constructor(aroma, body, acidity, flavour, balance, _id){

    super();
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      super();
      this._constructor(arguments[0]);
      return;
    }
    this._id = _id
    this.Aroma = aroma;
    this.Body = body;
    this.Acidity = acidity;
    this.Flavour = flavour;
    this.Balance = balance;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
        case '_id':
        this._id = advancedRebrew[e];
        break;
        case 'aroma':
        this.Aroma = advancedRebrew[e];
        break;
        case 'body':
        this.Body = advancedRebrew[e];
        break;
        case 'acidity':
        this.Acidity = advancedRebrew[e];
        break;
        case 'flavour':
        this.Flavour = advancedRebrew[e];
        break;
        case 'balance':
        this.Balance = advancedRebrew[e];
        break;
        default:
      }
    });
  }

  Get(){
    let ret = {}
    Object.keys(this).forEach((e) => {
      ret[e] = (this[e] != null)? this[e] : null;
    });
    return ret;
  }

  Only_id(){
    return {
      _id: this._id
    }
  }

  OnlyAroma(){
    return {
      Aroma: this.Aroma
    }
  }

  OnlyBody(){
    return {
      Body: this.Body
    }
  }

  OnlyAcidity(){
    return {
      Acidity: this.Acidity
    }
  }

  OnlyFlavour(){
    return {
      Flavour: this.Flavour
    }
  }

  OnlyBalance(){
    return {
      Balance: this.Balance
    }
  }
}

/**********
* Exports
**********/
export const Brewfile = _Brewfile;
export const AdvancedRebrew = _AdvancedRebrew;
export const Rebrew = _Rebrew;
export const Favorite = _Favorite;
export const Coffee = _Coffee;
