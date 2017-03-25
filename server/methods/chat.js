import { Messages } from '../../imports/api/collections/coffees.js';
import { RoomUsers } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    'chat.addUser'(id){
      console.log("Method addUser");
      let insertUser = {};
      insertUser.userid = Meteor.userId();
      insertUser.user = Meteor.user().username;
      insertUser.away = false;
      insertUser.creation_date = new Date();
      //console.log(RoomUsers.find({userid: insertUser.userid}));
      if(RoomUsers.findOne({userid: insertUser.userid})){
        RoomUsers.update({userid: insertUser.userid}, {$set: {creation_date: insertUser.creation_date, away: insertUser.away}});
        console.log("Updated roomuser " + Meteor.userId());
      } else {
        RoomUsers.insert(insertUser);
        console.log("Added roomuser " + Meteor.userId());
      }
      return;
    },
    'chat.updateUser'(away){
      console.log("Method updateUser");
      let updateaway = {};
      updateaway.away = away;
      updateaway.creation_date = new Date();
      //console.log(RoomUsers.find({userid: Meteor.userId()}));
      RoomUsers.update({userid: Meteor.userId()}, {$set: {creation_date: updateaway.creation_date, away: updateaway.away}});
      console.log("Updated roomuser " + Meteor.userId());
      console.log(updateaway.away);
      return;
    },    
    'chat.removeUser'(id){
      console.log("Method removeUser");
      RoomUsers.remove({userid: Meteor.userId()});
      console.log("Removed roomuser " + Meteor.userId());
      return;
    },
    'chat.addMessage'(message){
      console.log("Method addMessage");
      let insertMessage = {};
      insertMessage.user = Meteor.user().username;
      insertMessage.content = message.content.trim();
      insertMessage.creation_date = new Date();
      Messages.insert(insertMessage);
      RoomUsers.update({userid: Meteor.userId()}, {$set: {creation_date: insertMessage.creation_date, away: false}});
      console.log(Meteor.user().username + " added message ");
      return;
    },
    'chat.removeMessages'(id){
      console.log("Method removeMessages");
      Messages.remove({});
      console.log(Meteor.user().username + " Removed all messages");
      return;
    },
  });

  //Make Users Away after Timeout Interval
  function usersAwayInterval(){
      console.log("making users away");
      let expireDate = new Date();
      console.log(expireDate);
      expireDate.setSeconds(expireDate.getSeconds()-300);
      console.log(expireDate);
      RoomUsers.update({creation_date: {$lt: expireDate }}, {$set: {away: true}});
  };

  //Remove Users after Timeout Interval
  function usersRemoveInterval(){
      console.log("removing users");
      let expireDate = new Date();
      console.log(expireDate);
      expireDate.setSeconds(expireDate.getSeconds()-3000);
      console.log(expireDate);
      RoomUsers.remove({creation_date: {$lt: expireDate }});
  };

  setInterval(Meteor.bindEnvironment(usersAwayInterval),300000);
  setInterval(Meteor.bindEnvironment(usersRemoveInterval),600000);
}