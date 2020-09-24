import React from "react";


function ImageInput(props) {

  //Fires when file uploaded
    function changeHandler(event) {
      const {files}= event.target;
      //If file is uploaded do this
      if(files[0]){
        //Checking the type of the image and making sure it matches backend requirments
        if(files[0].type==="image/jpeg"||files[0].type==="image/png"){
        //Image Selected Flag prevent gender default image from overriding
        props.setImageSelectedFlag(true);
        /*Defining new File object to change the name of the image with jpeg extension.
          This is a simple solution to replace stored profile image in the server*/
        const newFile=new File([files[0]],props.username+"-Profile.jpeg",{type:files[0].type});
        //Defining new FormData object
        const imgFormObject= new FormData();
        //Setting the image for preview
        props.setImage(URL.createObjectURL(newFile));
        //Appending image data to be recognized and uploaded using multer package for file uploading
        imgFormObject.append("profileImgName",props.username+"-profile-"+new Date().toLocaleDateString());
        imgFormObject.append("profileImgData",newFile);
        //Setting the data to be sent to the backend.
        props.setImageFormObj(imgFormObject);
        }
        else
        {
          //If the file uploaded is neither jpeg or png files
          alert("Please only upload jpeg or png files.");
        }
      }
    }

    return <div className="input-group mb-1">
    <div className="input-group-prepend">
      {/*Specifying the image input use. Currently only one image input required in the app, which is profile image*/}
      <span className="input-group-text" id="inputGroupFileAddon01">{props.imgUse}</span>
    </div>
    <div className="custom-file">
      {/*File input only accepting jpeg/jpg file format*/}
      <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
      <input onChange={changeHandler} type="file" accept="image/jpeg" className="custom-file-input" id="inputGroupFile01"/>
    </div>
  </div>
}

export default ImageInput;