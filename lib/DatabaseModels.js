class _Brewfile {
  constructor(username, imageURL, tagline){
    this.Username = username;
    this.ImageUrl = imageURL;
    this.Tagline = tagline;
  }
  Get(){
    return {
      Username: this.Username,
      ImageUrl: this.ImageUrl,
      Tagline: this.Tagline
    }
  }
}
export const Brewfile = _Brewfile;

class _Coffee {
  constructor(coffeeName, coffeeRoast, coffeeDescription, imageUrl, createdAt, coffeeOwner, username, averageRating){
    this.CoffeeName = coffeeName;
    this.CoffeeRoast = coffeeRoast;
    this.CoffeeDescription = coffeeDescription;
    this.ImageUrl = imageUrl;
    this.CreatedAt = createdAt;
    this.CoffeeOwner = coffeeOwner;
    this.Username = username;
    this.AverageRating = averageRating;
  }
  Get(){
    return {
      CoffeeName: this.CoffeeName,
      CoffeeRoast: this.CoffeeRoast,
      CoffeeDescription: this.CoffeeDescription,
      ImageUrl: this.ImageUrl,
      CreatedAt: this.CreatedAt,
      CoffeeOwner: this.CoffeeOwner,
      Username: this.Username,
      AverageRating: this.AverageRating
    }
  }
}
export const Coffee = _Coffee;

class _Favorite {
  constructor(username, coffeeId){
    this.Username = username;
    this.CoffeeId = coffeeId;
  }

  Get(){
    return{
      Username: this.Username,
      CoffeeId: this.CoffeeId
    }
  }
}
export const Favorite = _Favorite;

class _Rebrew {
  constructor(coffeeId, coffeeName, rebrew, rating, title, reviewDate, owner, user){
    this.CoffeeId = coffeeId;
    this.CoffeeName = coffeeName;
    this.Rebrew = rebrew;
    this.Rating = rating;
    this.Title = title;
    this.ReviewDate = reviewDate;
    this.Owner = owner;
    this.User = user;
  }

  Get(){
    return {
      BrewId:  this.BrewId,
      Brew: this.Brew,
      Rebrew: this.Rebrew,
      Rating: this.Rating,
      Title: this.Title,
      ReviewDate: this.ReviewDate,
      Owner: this.Owner,
      User: this.User
    }
  }
}
export const Rebrew = _Rebrew;
