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
    action (params){
    BlazeLayout.render('app_body', {main:'mebrew', name:params.userName});
  }
});

FlowRouter.route('/me', {
    name: 'me',
    action (){
    BlazeLayout.render('app_body', {main:'mebrew'});
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
        BlazeLayout.render('brew');
    }
});
