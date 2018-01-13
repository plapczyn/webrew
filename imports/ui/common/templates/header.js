import './header.html';

Template.Header.onRendered( function() {
  let path = FlowRouter.current().route.path;
  let e;
  switch(path) {
    case "/":
      e = document.getElementById("hbhome"); e.classList.add("active");
      break;
    case "/browse":
      e = document.getElementById("hbbrowse"); e.classList.add("active");
      break;
    case "/new":
      e = document.getElementById("hbnew"); e.classList.add("active");
      break;
    case "/chat":
      e = document.getElementById("hbchat"); e.classList.add("active");
      break;
    case "/mebrew/:userName":
      e = document.getElementById("hbprofile"); e.classList.add("active");
      break;
    case "/brew/:brewId":
      e = document.getElementById("hbbrowse"); e.classList.add("active");
      break;
    default:
      e = document.getElementById("hbhome"); e.classList.add("active");
  }
});

Template.Header.events({
    'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username})
    },
    'click .goOut' (event) {
      Meteor.logout();
      FlowRouter.go("/login");
    },
    'click .headerbutton' (event) {
        let e = document.getElementsByClassName("headerbutton");
        for (i=0; i < e.length; i++) {
            e[i].classList.remove("active");
        }
    }
  });
  