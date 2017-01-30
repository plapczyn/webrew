import { Mongo } from 'meteor/mongo';

export const Favorites = new Mongo.Collection('favorites');
export const Coffees = new Mongo.Collection('coffees');
