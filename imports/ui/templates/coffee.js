import './coffee.html';
import {ColorPallet} from '../body.js';

Template.coffee.helpers({
  coffeeColor(roast){
    console.log(roast)
    return ColorPallet[roast];
  }
})
