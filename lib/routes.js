import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

FlowRouter.route('/',{
  name: 'Main',
  action (){
    BlazeLayout.render('app_body', {main:'Home'});
  }
});
FlowRouter.route('/browse',{
  name: 'Main',
  action (){
    BlazeLayout.render('app_body', {main:'Browse'});
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
    triggersEnter: [enterChat],
    action: function(){
      BlazeLayout.render('app_body', {main:'chat'});
    },
    triggersExit: [exitChat]
});

function enterChat() {
  //Add user
  Meteor.call('chat.addUser', {id: "id"}, (err, res) => {
    if(!err){
    } else {
      console.log("error adding roomuser");
    }
  });
}

function exitChat() {
  //Remove user
  Meteor.call('chat.removeUser', {id: "id"}, (err, res) => {
    if(!err){
    } else {
      console.log("error removing user");
    }
  }); 
}