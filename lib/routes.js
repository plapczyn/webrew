FlowRouter.route('/',{
  name: 'Main',
  action (){
    BlazeLayout.render('app_body', {main:'Home'});
  }
});
FlowRouter.route('/mebrew/:userName', {
    name: 'mebrew',
    action (){
    BlazeLayout.render('app_body', {main:'mebrew'});
  }
});

FlowRouter.route('/brew/new', {
    name: 'newbrew',
    action (){
    BlazeLayout.render('app_body', {main:'newbrew'});
  }
});

FlowRouter.route('/brew/:brewId', {
    name: 'brew',
    action: function(params, queryParams) {
        console.log("Brew is:", params.brewId);
        BlazeLayout.render('brew', {name: params.brewId});
    }
});
