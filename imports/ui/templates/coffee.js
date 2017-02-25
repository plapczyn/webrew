import './coffee.html';
import {ColorPallet} from '../body.js';

Template.coffee.helpers({
  coffeeColor(roast){
    return ColorPallet[roast];
  }
})
