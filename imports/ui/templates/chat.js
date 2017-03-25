import './chat.html';
import './chat.css';
import { Messages } from '../../api/collections/coffees.js';
import { RoomUsers } from '../../api/collections/coffees.js';

Template.chat.onRendered( function() {
  console.log("onRendered");
  //Add user
  Meteor.call('chat.addUser', {id: "id"}, (err, res) => {
    if(!err){
      console.log("added roomuser");
    } else {
      console.log("error adding roomuser");
    }
  });
});

Template.chat.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'click .send-message'(event){
    event.preventDefault();
    if( $('#messagebox').val().trim() == '') {
      return false;
    }
    let message = {};
    message.content = $('#messagebox').val().trim();
    //Clear messagebox
    $('#messagebox').val('');
    
    Meteor.call('chat.addMessage', message, (err, res) => {
      if(!err){
        console.log("added message");   
        //Set messages scroll to bottom
        $(".messages").scrollTop($(".messages")[0].scrollHeight);             
      } else {
        console.log("error adding message");
        $('#messagebox').val(message.content);
      }
    });    
  },
  'keyup .message' (event) {
    if(event.keyCode === 13){
      event.preventDefault();
      if( $('#messagebox').val().trim() == '') {
        return false;
      }
      let message = {};
      message.content = $('#messagebox').val().trim();
      //Clear messagebox
      $('#messagebox').val('');
      
      Meteor.call('chat.addMessage', message, (err, res) => {
        if(!err){
          console.log("added message");
          //Set messages scroll to bottom
          $(".messages").scrollTop($(".messages")[0].scrollHeight);                       
        } else {
          console.log("error adding message");
          $('#messagebox').val(message.content);
        }
      });       
    }
  },
  'click .send-disconnect'(event){
    event.preventDefault();
    Meteor.call('chat.removeUser', {id: "id"}, (err, res) => {
      if(!err){
        console.log("removed user");
      } else {
        console.log("error removing user");
      }
    });   
  },
  'click .send-clearmessages'(event){
    event.preventDefault();
    Meteor.call('chat.removeMessages', {id: "id"}, (err, res) => {
      if(!err){
        console.log("removed messages");
      } else {
        console.log("error removing messages");
      }
    });   
  },  
  'click .send-away'(event){
    console.log($('.send-away').val());
    if($('.send-away').val() == 'Set Away'){
      //Set User away
      console.log('Setting user away');
      Meteor.call('chat.updateUser', true, (err, res) => {
        if(!err){
          console.log("user is away");
          $('.send-away').val('Set Back');
        } else {
          console.log("error setting user away");
        }
    });
    } else {
      //Set User not away
      console.log('Setting user back');
      Meteor.call('chat.updateUser', false, (err, res) => {
        if(!err){
          console.log("user is back");
          $('.send-away').val('Set Away');
        } else {
          console.log("error setting user back");
      
        }
      });
    }
  }
});

Template.chat.helpers({
  name: FlowRouter.getParam("userName"),
  roomusers: function (){
    console.log(RoomUsers.find());
    return RoomUsers.find();
  },
  messages: function (){
    console.log(Messages.find());
    return Messages.find();
  },
  isConnected(){
    if (RoomUsers.findOne({userid: Meteor.userId()})) {
      console.log("connected true");
      return true;
    } else {
      console.log("connected false");
      return false;
    }
  },
  isPresent(){
    if (RoomUsers.find({userid: Meteor.userId()}).away == false) {
      console.log("isPresent true");
      return true;
    } else {
      console.log("isPresent false");
      return false;
    }
  }
});
