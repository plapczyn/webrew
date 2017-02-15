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
      console.log(this);
        this.register('myPost', Meteor.subscribe('brewfile', params.userName));
        this.register('coffeesForBrewfileClient', Meteor.subscribe('coffeesForBrewfile', params.userName));
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
        console.log("Brew is:", params.brewId);
        BlazeLayout.render('app_body', {main:'brew'});
    }
});
