import React from "react";
//Simple label to components that show text match props.labelText
function Label(props) {
 return <div className="input-group-prepend">
 <label className="input-group-text" htmlFor={props.htmlForProp}>{props.labelText}</label>
</div>
}

export default Label;