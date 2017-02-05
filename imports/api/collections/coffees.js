import { Mongo } from 'meteor/mongo';

export const Favorites = new Mongo.Collection('favorites');
export const Coffees = new Mongo.Collection('coffees');
export const Rebrews = new Mongo.Collection('rebrew');
export const BrewFiles = new Mongo.Collection('brewfile');
