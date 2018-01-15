import './meModal.html';
import Common from '../../../common/scripts/common.js';
import '../../../common/templates/imgupload.js'

Template.meBrewModal.events({
'submit .modalOk'(event){
    event.preventDefault();
    let form = Common.WebrewModal.GetForm(event);
    let url = form.imageURL.value;
    let Tagline = form.tagline.value;
    let Email = form.email.value;
    //Upload if imageURL has attribute disabled for file
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      let userid= Meteor.userId();
      url = uploadFile(userid, "brewfile.upload");
      console.log(url);
    }

    let secure = Promise.resolve(Meteor.user()).then(function(data){
        let user = Meteor.user().username;
    if(Meteor.user().username == FlowRouter.getParam('userName')){
      let brewfile = {Username: user, Tagline: Tagline, ImageUrl: url, Email: Email};
      Meteor.call('brewfile.updateProfile',brewfile, (err, res) => {
        Common.WebrewModal.Hide();
        Common.WebrewToast.Show("Brew Profile Updated","success");
      });
    }
  })
}
});

