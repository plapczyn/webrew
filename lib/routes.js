import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

FlowRouter.route('/login',{
  name: 'Login',
  action (){
    BlazeLayout.render('app_body', {main:'Login'});
  }
});

FlowRouter.route('/',{
  name: 'Main',
  triggersEnter: [redirectOnLogin],
  action (){
    BlazeLayout.render('app_body', {main:'Home'});
  }
});

FlowRouter.route('/browse',{
  name: 'Browse',
  triggersEnter: [redirectOnLogin],
  action (){
    BlazeLayout.render('app_body', {main:'Browse'});
  }
});

FlowRouter.route('/mebrew/:userName', {
    name: 'mebrew',
     subscriptions: function(params) {
        this.register('myPost', Meteor.subscribe('brewfile', params.userName));
     },
     triggersEnter: [redirectOnLogin],
     action (params){
    BlazeLayout.render('app_body', {main:'mebrew', name:params.userName});
  }
});

FlowRouter.route('/new', {
    name: 'newbrew',
    triggersEnter: [redirectOnLogin],
    action (){
    BlazeLayout.render('app_body', {main:'newbrew'});
  }
});

FlowRouter.route('/brew/:brewId', {
    name: 'brew',
    triggersEnter: [redirectOnLogin],
    action: function(params, queryParams) {
        BlazeLayout.render('app_body', {main:'brew'});
    },
    subscriptions: function(params){
      this.register('brew.coffees', Meteor.subscribe('brew', params.brewId));
      this.register('brew.rebrew', Meteor.subscribe('rebrews', params.brewId));   
    }
});

FlowRouter.route('/chat', {
    name: 'chat',
    triggersEnter: [redirectOnLogin, enterChat],
    action: function(){
      BlazeLayout.render('app_body', {main:'chat'});
    },
    triggersExit: [exitChat]
});

FlowRouter.route('/about',{
  name: 'About',
  action (){
    BlazeLayout.render('app_body', {main:'About'});
  }
});

function enterChat() {
  //Add user
  Meteor.call('chat.addUser', {id: "id"}, (err, res) => {
    if(!err){
    } else {
      // console.log("error adding roomuser");
    }
  });
}

function exitChat() {
  //Remove user
  Meteor.call('chat.removeUser', {id: "id"}, (err, res) => {
    if(!err){
    } else {
      // console.log("error removing user");
    }
  }); 
}

function redirectOnLogin() {
  Meteor.call('brewfile.user', {} , (err, res) => {
    if(res){
    } else {
      FlowRouter.go("/login");
    }
  });
}