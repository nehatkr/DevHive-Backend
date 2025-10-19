const validator = require('validator')

const validateSignUpData= (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First Name and Last Name is required");
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("FirstName should be 4-50 characters")   
    }else if(!validator.isEmail(emailId)){
        throw new Error("Your email Id is not valid. please enter a valid email Id")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password.")
    }
}

module.exports={
    validateSignUpData,
}