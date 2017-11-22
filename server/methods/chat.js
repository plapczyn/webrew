import { Messages } from '../../imports/api/collections/coffees.js';
import { RoomUsers } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    'chat.addUser'(id){
      let insertUser = {};
      insertUser.userid = Meteor.userId();
      insertUser.user = Meteor.user().username;
      insertUser.away = false;
      insertUser.creation_date = new Date();
      if(RoomUsers.findOne({userid: insertUser.userid})){
        RoomUsers.update({userid: insertUser.userid}, {$set: {creation_date: insertUser.creation_date, away: insertUser.away}});
      } else {
        RoomUsers.insert(insertUser);
      }
      return;
    },
    'chat.updateUser'(away){
      let updateaway = {};
      updateaway.away = away;
      updateaway.creation_date = new Date();
      RoomUsers.update({userid: Meteor.userId()}, {$set: {creation_date: updateaway.creation_date, away: updateaway.away}});
      return;
    },    
    'chat.removeUser'(id){
      RoomUsers.remove({userid: Meteor.userId()});
      return;
    },
    'chat.addMessage'(message){
      let insertMessage = {};
      insertMessage.user = Meteor.user().username;
      insertMessage.content = message.content.trim();
      insertMessage.creation_date = new Date();
      Messages.insert(insertMessage);
      RoomUsers.update({userid: Meteor.userId()}, {$set: {creation_date: insertMessage.creation_date, away: false}});
      return;
    },
    'chat.removeMessages'(id){
      Messages.remove({});
      return;
    },
  });

  //Make Users Away after Timeout Interval
  function usersAwayInterval(){
      let expireDate = new Date();
      expireDate.setSeconds(expireDate.getSeconds()-300);
      RoomUsers.update({creation_date: {$lt: expireDate }}, {$set: {away: true}});
  };

  //Remove Users after Timeout Interval
  function usersRemoveInterval(){
      let expireDate = new Date();
      expireDate.setSeconds(expireDate.getSeconds()-600);
      RoomUsers.remove({creation_date: {$lt: expireDate }});
  };

  setInterval(Meteor.bindEnvironment(usersAwayInterval),60000);
  setInterval(Meteor.bindEnvironment(usersRemoveInterval),60000);
}