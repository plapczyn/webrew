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
        if (file.size > 1024*1024*10) {
          Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 10MB", "error")
          return;
        }
        
        let reader = new FileReader();
        reader.onload = function (event) {
          imgDiv.innerHTML = "<img src=\"" + event.target.result + "\">";
          document.getElementById("imageURL").value = file.name;
          document.getElementById("imageURL").setAttribute("disabled","");
          let c = document.getElementById("imageClear");
          c.classList.remove("image-upload-hidden");         
        }
        reader.readAsDataURL(file);
  },
  'keyup #imageURL' ( event, template) {
    let value = event.target.value.trim();
    let e = document.getElementById("imageClear");
    if (value.length > 0 ){
      e.classList.remove("image-upload-hidden");
    } else {
      e.classList.add("image-upload-hidden");
    }
  },
  'change #imageURL' ( event, template) {
    var value = event.target.value.trim();
    var e = document.getElementById("imageClear");
    if (value.length > 0 ){
      e.classList.remove("image-upload-hidden");
      var img = new Image();
      img.onload = function() {
        imgDiv.innerHTML = "<img src=\"" + value + "\">";
      };
      img.onerror = function(){
        Common.WebrewToast.Show("The entered image URL is invalid or an error has occurred image, please try again.", "error");
      };        
      img.src = value;
    } else {
      e.classList.add("image-upload-hidden");
    }
  },
  'click .image-upload-clear'(event, template){
    event.preventDefault();
    let c = document.getElementById("imageClear");
    let e = document.getElementById("imageURL");
    c.classList.add("image-upload-hidden");
    e.removeAttribute("disabled",""); 
    e.value = "";
    document.getElementById("imgDiv").innerHTML = "";
    document.getElementById("imageFile").value = "";
  }
});

// uploadFile = function (id, method) {
//     var file = document.getElementById("imageFile").files[0];
//     if (file) {
//       //Check filetype
//       if (!(file.type.match('image.*'))){
//         Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error")
//         return;
//       }
//       //Check filesize
//       if (file.size > 1024*1024*2) {
//         Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 2MB", "error")
//         return;
//       }
      
//       var reader = new FileReader();
//       reader.onload = function(fileLoadEvent) {
//       //call created upload method and pass file name, and file-reader info
//       Meteor.call(method, id, file.name, reader.result, function(err, res) {
//             if(!err){
//               Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
//               return res;
//             }
//             else{
//               Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
//             }
//         });
//       };
//       reader.readAsBinaryString(file);
//     }
//   }

  uploadImgur = function (id, method) {
    var file = document.getElementById("imageFile").files[0];
    if (file) {
      //Check filetype
      if (!(file.type.match('image.*'))){
        Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error")
        return;
      }
      //Check filesize
      if (file.size > 1024*1024*10) {
        Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 10MB", "error")
        return;
      }
      Common.WebrewToast.Show(file.name + " upload in process", "info")
      var reader = new FileReader();
      reader.onload = function(fileLoadEvent) {
        //call created upload method and pass file name, and file-reader info
        Meteor.call(method, id, file.name, btoa(fileLoadEvent.target.result), function(err, res) {
          if(!err){
            Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
            return res;
          } else {
            Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  };