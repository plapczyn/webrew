import './login.html';
import './login.css'

Template.Login.onCreated( function (){
  let template = Template.instance();
  
  template.autorun( () => {
    if ( Meteor.user() ){
      FlowRouter.go("/");
    }
  });
});

Template.Login.events({
  'click #signup' (event, template){
    $("#login-sign-in-link").click();
    var checkExists = setInterval(function (){
      if ( $("#signup-link").length ) {
        clearInterval(checkExists);
        $("#signup-link").click();
      }
    }, 10);
    
  }
});
