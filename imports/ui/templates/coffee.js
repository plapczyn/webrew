import './coffee.html';
import {ColorPallet} from '../body.js';
import './coffee.css';
import Common from '../common/scripts/common.js'

Template.coffee.helpers({
  coffeeColor(roast){
    return ColorPallet[roast];
  },
  CoffeeDescriptionShort(){
    let description = this.CoffeeDescription;
    if(description.length >= 200)
    {
      return description.substr(0, 200) + "..."
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
    if(this.CoffeeName.length >= 65){
      return this.CoffeeName.substr(0, 65) + "..."
    }
    else{
      return this.CoffeeName;
    }
  }
})
