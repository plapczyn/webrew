/***********************************************************************
* Author Paul Lapczynski
* Class List
* {Brewfile}
* {Coffee}
* {Favorite}
* {AdvancedRebrew}
* {Rebrew}
***********************************************************************/

/**********
* Exports
**********/
export const Brewfile = _Brewfile;
export const AdvancedRebrew = _AdvancedRebrew;
export const Rebrew = _Rebrew;
export const Favorite = _Favorite;
export const Coffee = _Coffee;

/***********
* Functions
************/

class _Brewfile {
  constructor(username, imageURL, tagline){
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      return;
    }

    this.Username = username;
    this.ImageUrl = imageURL;
    this.Tagline = tagline;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
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
}

class _Coffee {
  constructor(coffeeName, coffeeRoast, coffeeDescription, imageUrl, createdAt, coffeeOwner, username, averageRating){
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      this._constructor(arguments[0]);
      return;
    }
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
        case 'coffeename':
        this.CoffeeName = advancedRebrew[e];
        break;
        case 'cofferoast':
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
}

class _Favorite {

  constructor(username, coffeeId){
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      this._constructor(arguments[0]);
      return;
    }
    this.Username = username;
    this.CoffeeId = coffeeId;
  }

  _constructor(advancedRebrew){
    console.log(advancedRebrew)
    Object.keys(advancedRebrew).forEach((e) => {
      switch (e.toLowerCase()) {
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
}

class _Rebrew {
  constructor(coffeeId, coffeeName, rebrew, rating, title, reviewDate, owner, user){
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      this._constructor(arguments[0]);
      return;
    }
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
}

class _AdvancedRebrew {
  constructor(aroma, body, acidity, flavour, balance){
    // Is a loosly formatted objected passed in?
    if(arguments !== null && arguments.length === 1 && typeof arguments[0] === 'object'){
      this._constructor(arguments[0]);
      return;
    }

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
}
