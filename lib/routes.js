import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
FlowRouter.route('/',{
  name: 'Main',
  action (){
    BlazeLayout.render('app_body', {main:'Home'});
  }
});
FlowRouter.route('/mebrew/:userName', {
    name: 'mebrew',
     subscriptions: function(params) {
        this.register('myPost', Meteor.subscribe('brewfile', params.userName));
     },
    action (params){
    BlazeLayout.render('app_body', {main:'mebrew', name:params.userName});

  }
});

FlowRouter.route('/new', {
    name: 'newbrew',
    action (){
    BlazeLayout.render('app_body', {main:'newbrew'});
  }
});

FlowRouter.route('/brew/:brewId', {
    name: 'brew',
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
    subscriptions: function() {
      this.register('roommessages', Meteor.subscribe('roommessages'));
      this.register('roomusers', Meteor.subscribe('roomusers'));
    }, 
    action: function(){
      BlazeLayout.render('app_body', {main:'chat'});
  }
});