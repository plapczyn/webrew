import './meModal.html';
import Common from '../../../common/scripts/common.js';
import '../../../common/templates/imgupload.js'

Template.meBrewModal.events({
'submit .modalOk'(event){
    event.preventDefault();
    let form = Common.WebrewModal.GetForm(event);
    let brewfile = {};
    brewfile.Tagline = form.tagline.value;
    brewfile.Email = form.email.value;
    //Upload if imageURL has attribute disabled for file
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      brewfile.ImageUrl = "/img/coffee.gif";
      uploadImgur( Meteor.userId() , "brewfile.uploadImgur");
    } else {
      brewfile.ImageUrl = form.imageURL.value;
    }

    let secure = Promise.resolve(Meteor.user()).then(function(data){
      brewfile.Username = Meteor.user().username;
    if(Meteor.user().username == FlowRouter.getParam('userName')){
      Meteor.call('brewfile.updateProfile',brewfile, (err, res) => {
        Common.WebrewModal.Hide();
        Common.WebrewToast.Show("Brew Profile Updated","success");
      });
    }
  })
}
});

