import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Favorites = new Mongo.Collection('favorites');
export const Coffees = new Mongo.Collection('coffees');
export const Rebrews = new Mongo.Collection('rebrew');
export const BrewFiles = new Mongo.Collection('brewfile');
export const Roasters = new Mongo.Collection('roasters');
export const Messages = new Mongo.Collection('messages');
export const RoomUsers = new Mongo.Collection('roomusers');
export const RatingNotes = new Mongo.Collection('ratingNotes')




function FillAdvancedReviewData()
{
  var aroma =
  [
    'Floral',
    'Exotic',
    'Smokey',
    'Spicy'
  ];

  var body =
  [
    'Light', 'Medium', 'Full', 'Syrupy'
  ];

  var flavour = [
      'Berry',
      'Bitterness',
      'Buttery',
      'Carmelly',
      'Citrus	',
      'Cocoa',
      'Earthy',
      'Juicy',
      'Smoky',
      'Wild',
      'Ashy',
      'Winey',
      'Spicy',
      'Stale',
      'Umami',
      'Chocolatey',
      'Fruity',
      'Herbal',
      'Nutty',
      'Oniony',
      'Papery',
      'Rancid',
      'Rubbery',
      'Scorched',
      'Sour',
      'Smooth',
      'Spicy',
      'Tobacco',
      'Woody'
    ];

    var acidity =
    [
      'Crisp (bright acidity)',
      'Tangy',
      'Sparkling',
      'Smooth',

    ];
    console.log(flavour);
    RatingNotes.insert({
      Aroma: aroma,
      Acidity: acidity,
      Body: body,
      Flavour: flavour
    });

  }

  // FillAdvancedReviewData();
  /*
  db.roasters.insert({Name: "Duncan Donut's"});
db.roasters.insert({Name: "Maxwell House"});
db.roasters.insert({Name: "Folgers"});
db.roasters.insert({Name: "Nescafe"});
db.roasters.insert({Name: "Eight O'Clock Coffee"});
db.roasters.insert({Name: "Jacobs"});
db.roasters.insert({Name: "Sanka"});
db.roasters.insert({Name: "Peet's"});
db.roasters.insert({Name: "Sarbucks"});
db.roasters.insert({Name: "Higher Ground Roasters});
  */

//  Roasters.insert({Name: "Duncan Donut's"});
//  Roasters.insert({Name: "Maxwell House"});
//  Roasters.insert({Name: "Folgers"});
//  Roasters.insert({Name: "Nescafe"});
//  Roasters.insert({Name: "Eight O'Clock Coffee"});
//  Roasters.insert({Name: "Jacobs"});
//  Roasters.insert({Name: "Sanka"});
//  Roasters.insert({Name: "Peet's"});
//  Roasters.insert({Name: "Sarbucks"});
//  Roasters.insert({Name: "Higher Ground Roasters"});