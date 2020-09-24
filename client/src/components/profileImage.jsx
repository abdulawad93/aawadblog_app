import React from "react";
//Profile Image Display
function ProfileImage(props) {
    return <div className={props.parentClass}>
    <img src={props.imgSrc} alt={props.imgAlt} className="img-thumbnail"/>
</div>;
}

export default ProfileImage;