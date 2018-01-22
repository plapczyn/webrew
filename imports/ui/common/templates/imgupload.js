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
      
      //var reader = new FileReader();
      //reader.onload = function(fileLoadEvent) {
        //call created upload method and pass file name, and file-reader info
        console.log("startUploadImgur");
        console.log("startUploadImgur_getToken");

        //Get refresh_token, client_id, client_secret from DB)

        // Meteor.call(method, id, file.name, reader.result, function(err, res) {
        //       if(!err){
        //         Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
        //         console.log("endUploadImgur");
        //         console.log(res);
        //         return res;
        //       }
        //       else{
        //         Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
        //       }
        //   });

        let tokenDetails = { "refresh_token": "792443c89bd88ebae5ee3a825839bbd77d8841e3",
        "client_id": "608616661ea9814",
        "client_secret": "85020c4c0c4a8e9023675c8625224fc81ec0ba82",
        "grant_type": "refresh_token"};
        let url = "https://api.imgur.com/oauth2/token";
        let xhttp = new XMLHttpRequest();
        let json;
        var token = "c0b120c06a89b024eeaed90a9c461fd4641c8a27";
        // xhttp.open("POST",url,false);
        // xhttp.setRequestHeader("Content-type", "application/json");
      
        //Asynchronous?
        // xhttp.onreadystatechange = function () {
        //   if (xhttp.readyState === 4 && xhttp.status === 200) {
        //       let json = JSON.parse(xhttp.responseText);
        //       console.log("access_token: " + json.access_token); 
        //       //c2de450eb4a0dae018cc822de3adc9f348f9822c
        //       console.log("refresh_token: " + json.refresh_token);
        //       //c38893fc920c9b76fbf9caf8b9142c279bae025e

        //       //log refresh token in db
        //       //Meteor.call();

        //       //Return token to be used for upload
        //       return json.access_token;
        //   }
        // };
        // xhttp.send(JSON.stringify(tokenDetails));

        //Synchronous?
        // if (xhttp.readyState === 4 && xhttp.status === 200) {
        //   json = JSON.parse(xhttp.responseText);
        //   console.log("access_token: " + json.access_token); 
        //   //c2de450eb4a0dae018cc822de3adc9f348f9822c
        //   console.log("refresh_token: " + json.refresh_token);
        //   //c38893fc920c9b76fbf9caf8b9142c279bae025e

        //   //log refresh token in db
        //   //Meteor.call();

        //   //Return token to be used for upload
        //   token = json.access_token;
        // }

        if (token) {
          let imageDetails = new FormData();
          imageDetails.append("image", file);
          imageDetails.append("album", "xrWEY");
          imageDetails.append("type", "file");
          imageDetails.append("name", file.name);
          url = "https://api.imgur.com/3/image";
          xhttp = new XMLHttpRequest();          
          xhttp.open("POST",url,false);
          // xhttp.setRequestHeader("Authorization", "Client-ID " + tokenDetails.client_id );
          xhttp.setRequestHeader("Authorization", "Bearer " + token );
          
          xhttp.send(imageDetails);
          
          //Synchronous?
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            json = JSON.parse(xhttp.responseText);
            console.log(json); 
            console.log(json.data.link);

            //log link as imageurl db
            //Meteor.call();
          }
          else{
            console.log(xhttp.responseText);
          }

        }

     // };
     // reader.readAsBinaryString(file);
    }
  }

  //delete hash
  //xQFexgA8D9rI2bb
  //https://i.imgur.com/AoXYp0K.jpg
  //u2cNh6t

  //access c0b120c06a89b024eeaed90a9c461fd4641c8a27
  //refresh 792443c89bd88ebae5ee3a825839bbd77d8841e3

  function tester(){
    var form = new FormData();
form.append("refresh_token", "792443c89bd88ebae5ee3a825839bbd77d8841e3");
form.append("client_id", "608616661ea9814");
form.append("client_secret", "85020c4c0c4a8e9023675c8625224fc81ec0ba82");
form.append("grant_type", "refresh_token");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.imgur.com/oauth2/token",
  "method": "POST",
  "headers": {},
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
  }