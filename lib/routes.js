FlowRouter.route('/',{
  name: 'Main',
  action (){
    BlazeLayout.render('app_body', {main:'Home'});
  }
});
FlowRouter.route('/mebrew', {
    name: 'mebrew',
    action (){
    BlazeLayout.render('app_body', {main:'mebrew',name:"TEST"});
  }
});
