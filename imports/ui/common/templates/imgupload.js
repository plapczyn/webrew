import './imgupload.html';
import './imgupload.css'

Template.imgupload.events({
    'change #imageFile' (event, template){
        if(!event.target.files || !window.FileReader) return;
        template.isFileUpload.set( false ); 
        let imgDiv = document.getElementById("imgDiv");
        imgDiv.innerHTML = "";
        let file = event.target.files[0];
        //Is there a file
        if (!file) { 
          document.getElementsByName("imageURL")[0].value = "";  
          return; 
        }
        //Check filetype
        if (!(file.type.match('image.*'))){
          Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error");
          return;
        }
        //Check filesize
        if (file.size > 1024*1024*2) {
          Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 2MB", "error")
          return;
        }
        
        let reader = new FileReader();
        reader.onload = function (event) {
          imgDiv.innerHTML = "<img src=\"" + event.target.result + "\">";
          template.isFileUpload.set( true ); 
          document.getElementsByName("imageURL")[0].value = file.name;          
        }
        reader.readAsDataURL(file);
      }
});

uploadFile = function (id) {
    var file = document.getElementById("imageFile").files[0];
    if (file) {
      //Check filetype
      if (!(file.type.match('image.*'))){
        Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error")
        return;
      }
      //Check filesize
      if (file.size > 1024*1024*2) {
        Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 2MB", "error")
        return;
      }
      
      var reader = new FileReader();
      reader.onload = function(fileLoadEvent) {
      //call created upload method and pass file name, and file-reader info
      console.log("startUploadFileMeteorCall");
      Meteor.call('image.upload', id, file.name, reader.result, function(err, res) {
            if(!err){
              Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
              console.log("endUploadFileMeteorCall");
            }
            else{
              Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
            }
        });
      };
      reader.readAsBinaryString(file);
    }
  }