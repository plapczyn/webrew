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
export const Config = new Mongo.Collection('config')



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
