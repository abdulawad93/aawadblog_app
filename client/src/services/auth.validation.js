
import axios from "axios"
var validator = require('validator');


let users=[];

//Getting usernames list from mongoDB database to compare with the entered username and confirm validity
const checkUsernameAvailability=(submittedUsername,setUsernameAvailbility)=>{
    setUsernameAvailbility(true);
    const uri="/auth/get-all-users";
    const headers={"content-type":"application/json"};
    axios.get(uri,headers).then((response)=>{
        users=response.data; 
        users.forEach(user=>{
            if(submittedUsername===user.user){
                setUsernameAvailbility(false)
            }
        })
 }).catch(err=>console.log(err));
}

//Getting usernames list from mongoDB database to compare with the entered email and confirm validity
const checkEmailAvailability=(submittedEmail,setEmailAvailability)=>{
    setEmailAvailability(true);
    const uri="/auth/get-all-users";
    const headers={"content-type":"application/json"};
    axios.get(uri,headers).then((response)=>{
        users=response.data;
        users.forEach(user=>{
            if(submittedEmail===user.email){
                setEmailAvailability(false);
            }
        })
    }).catch(err=>console.log(err));
}




const validatePassword=(password, setPasswordLengthFlag,setLowerCaseFlag,setUpperCaseFlag,setSpecialCharacterFlag,setNumberCharacterFlag,setUnacceptedCharacterFlag)=>{
        //Changing string to array of character
        const passwordArrayOfChar=[...password];
        //The following lines sort the character according to their ASCII info
        const unacceptedCharacters=[];
        let j=0;
        for(let i=0; i<=32; i++){
            unacceptedCharacters[j]=String.fromCharCode(i);
            j++;
        }
        unacceptedCharacters[j++]=String.fromCharCode(34);
        unacceptedCharacters[j++]=String.fromCharCode(92);
        unacceptedCharacters[j++]=String.fromCharCode(96);
        for(let i=127; i<=255; i++){
            unacceptedCharacters[j]=String.fromCharCode(i);
            j++;
        }
        j=0;
        const specialCharacters=[];
        specialCharacters[j++]=String.fromCharCode(33);
        for(let i=35; i<=47; i++){
            specialCharacters[j]=String.fromCharCode(i);
            j++;
        }
        for(let i=58; i<=64; i++){
            specialCharacters[j]=String.fromCharCode(i);
            j++;
        }
        specialCharacters[j++]=String.fromCharCode(91);
        for(let i=93; i<=95; i++){
            specialCharacters[j]=String.fromCharCode(i);
            j++;
        }
        for(let i=123; i<=126; i++){
            specialCharacters[j]=String.fromCharCode(i);
            j++;
        }
        j=0;
        const upperCaseCharacters=[];
        for(let i=65; i<=90; i++)
        {
            upperCaseCharacters[j]=String.fromCharCode(i);
            j++;
        }
        j=0;
        const lowerCaseCharacters=[];
        for(let i=97; i<=122; i++)
        {
            lowerCaseCharacters[j]=String.fromCharCode(i);
            j++;
        }
        j=0;
        const numberCharacters=[];
        for(let i=48; i<=57; i++)
        {
            numberCharacters[j]=String.fromCharCode(i);
            j++;
        }
        j=0;

        //Accept password if length equal to or higher than 10
        passwordArrayOfChar.length>=10?setPasswordLengthFlag(true):setPasswordLengthFlag(false);

        //Accept password if it has at least lowercase character
        let lowerCase;
        for(let i=0; i<lowerCaseCharacters.length; i++)
        {
            lowerCase=passwordArrayOfChar.find(character=>character===lowerCaseCharacters[i]);
            if(lowerCase)
            {
                break;
            }
        }
        lowerCase?setLowerCaseFlag(true):setLowerCaseFlag(false);

        //Accept password if it has at least uppercase character
        let upperCase;
        for(let i=0; i<upperCaseCharacters.length; i++)
        {
            upperCase=passwordArrayOfChar.find(character=>character===upperCaseCharacters[i]);
            if(upperCase)
            {
                break;
            }
        }
        upperCase?setUpperCaseFlag(true):setUpperCaseFlag(false);

        //Accept password if it has at least special character
        let specialCharacter;
        for(let i=0; i<specialCharacters.length; i++)
        {
            specialCharacter=passwordArrayOfChar.find(character=>character===specialCharacters[i]);
            if(specialCharacter)
            {
                break;
            }
        }
        specialCharacter?setSpecialCharacterFlag(true):setSpecialCharacterFlag(false);


        //Accept password if it has at least one number
        let numberCharacter;
        for(let i=0; i<numberCharacters.length; i++)
        {
            numberCharacter=passwordArrayOfChar.find(character=>character===numberCharacters[i]);
            if(numberCharacter)
            {
                break;
            }
        }
        numberCharacter?setNumberCharacterFlag(true):setNumberCharacterFlag(false);


        //Reject password if it has an unaccapted character
        let unacceptedCharacter;
        for(let i=0; i<unacceptedCharacters.length; i++){
            unacceptedCharacter=passwordArrayOfChar.find(character=>character===unacceptedCharacters[i]);
            if(unacceptedCharacter)
            {
                break;
            }
        }
        unacceptedCharacter?setUnacceptedCharacterFlag(true):setUnacceptedCharacterFlag(false);
}

const isEmailValid=(email,setEmailValidity)=>{
    //Using validator package for email validation
    setEmailValidity(validator.isEmail(email));
}
export {checkUsernameAvailability,checkEmailAvailability,validatePassword,isEmailValid};