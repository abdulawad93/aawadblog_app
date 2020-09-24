import React from "react";

function Dropdown(props){
    const {optionData}=props;

    const changeHandler=(event)=>{
        const {value}=event.target;
        props.setSelectedValue(value);
        //When dropdown description of birth month is selected, call function set number of days according to the selected month
        if(props.dropdownDescription==="birth-month"){
            props.setDaysAccordingToMonth(value);
        }
    };


    return <select onChange={changeHandler} className="custom-select" id="inputGroupSelect01" value={props.initValue&&props.initValue}>
    {/*Default option*/}
    <option value={0}>Choose...</option>
    {/*Mapping optionData into option elements*/}
    {optionData&&optionData.map((optionValue, index)=><option key={index} value={optionValue}>{optionValue}</option>)}
  </select>
}

export default Dropdown;