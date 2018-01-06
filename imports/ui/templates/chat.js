import './chat.html';
import './chat.css';
import { Messages } from '../../api/collections/coffees.js';
import { RoomUsers } from '../../api/collections/coffees.js';
import '../common/templates/webrewLoader.html';

Template.chat.onCreated( function (){
  this.subscribe('roommessages', function () {
    //subsReady
    $('.loader').fadeOut('fast', function(){
      $('.loading-wrapper').fadeIn('slow');
      $(".messages").scrollTop($(".messages")[0].scrollHeight);
    });
  });
  this.subscribe('roomusers');
});

Template.chat.onRendered( function() {
  $('.loader').fadeIn();
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
        //Set messages scroll to bottom
        $(".messages").scrollTop($(".messages")[0].scrollHeight);             
      } else {
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
          //Set messages scroll to bottom
          $(".messages").scrollTop($(".messages")[0].scrollHeight);                       
        } else {
          $('#messagebox').val(message.content);
        }
      });       
    }
  },
  'click .send-away'(event){
    let status = $('.send-away').val();
    
    if(status == 'Set Away'){
      //Set User away
      Meteor.call('chat.updateUser', true, (err, res) => {
        if(!err){
          $('.send-away').val('Set Back');
        } else {
          console.log("error setting user away");
        }
      });
    } 
    
    if(status == 'Set Back') {
      //Set User not away
      Meteor.call('chat.updateUser', false, (err, res) => {
        if(!err){
          $('.send-away').val('Set Away');
        } else {
          console.log("error setting user back");
        }
      });
    }

    if(status == 'Reconnect') {
      //Reconnect User
      Meteor.call('chat.addUser', {id: "id"}, (err, res) => {
        if(!err){
        } else {
          console.log("error adding roomuser");
        }
      });
    }    
  }
});

Template.chat.helpers({
  name: FlowRouter.getParam("userName"),
  roomusers: function (){
    return RoomUsers.find();
  },
  messages: function (){
    return Messages.find({}, {sort: {creation_date: 1}});
  },
  isConnected(){
    if (RoomUsers.findOne({userid: Meteor.userId()})) {
      return true;
    } else {
      return false;
    }
  },
  isPresent(){
    if (RoomUsers.find({userid: Meteor.userId()}).away == false) {
      return true;
    } else {
      return false;
    }
  }
});
