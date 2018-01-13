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