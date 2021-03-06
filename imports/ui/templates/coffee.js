import './coffee.html';
import './coffee.css';
import Common from '../common/scripts/common.js'

Template.coffee.helpers({
  CoffeeDescriptionShort(){
    let description = this.CoffeeDescription;
    if(description.length >= 100)
    {
      return description.substr(0, 100) + "..."
    }
    else
    {
      return description;
    }
  },
  getColor(){
    return Common.WebrewColorPallet.GetColor(this.CoffeeRoast);
  },
  CoffeeNameShort(){
    if(this.CoffeeName.length >= 55){
      return this.CoffeeName.substr(0, 55) + "..."
    }
    else{
      return this.CoffeeName;
    }
  },
  hasAverageRating(){
    return this.AverageRating > 0;
  },
  GetCoffeeRating(){
    if(this.AverageRating > 0){
      return Math.round(this.AverageRating*2)/2.0;
    }
    else{
      return 0
    }
  }
})
