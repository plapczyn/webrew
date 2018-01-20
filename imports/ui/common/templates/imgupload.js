import './imgupload.html';
import './imgupload.css'
import Common from '../scripts/common.js'

Template.imgupload.events({
    'change #imageFile' (event, template){
        if(!event.target.files || !window.FileReader) return;
        let imgDiv = document.getElementById("imgDiv");
        imgDiv.innerHTML = "";
        let file = event.target.files[0];
        //Is there a file
        if (!file) { 
          document.getElementById("imageURL").value = "";  
          document.getElementById("imageURL").removeAttribute("disabled",""); 
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
          document.getElementById("imageURL").value = file.name;
          document.getElementById("imageURL").setAttribute("disabled","");         
        }
        reader.readAsDataURL(file);
      }
});

uploadFile = function (id, method) {
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
      Meteor.call(method, id, file.name, reader.result, function(err, res) {
            if(!err){
              Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
              console.log("endUploadFileMeteorCall");
              console.log(res);
              return res;
            }
            else{
              Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
            }
        });
      };
      reader.readAsBinaryString(file);
    }
  }