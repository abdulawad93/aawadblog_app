import React from "react";

function BoostrapTextInput(props) {

  //Setting text input value of the passed state
    function changeHandler(event) {
        const {value}=event.target;
        props.setTextInfo(value);
    }

    return <div className="input-group mb-3">
    <div className="input-group-prepend">
      <span className="input-group-text" id="inputGroup-sizing-default">{props.requestedInfo}</span>
    </div>
    <input type="text" onChange={changeHandler} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={props.initValue}/>
  </div>
}

export default BoostrapTextInput;