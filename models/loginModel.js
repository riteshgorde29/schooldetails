const mongoose= require('mongoose')


const loginDitalsSchema= mongoose.Schema(
    {
        firstName:String,
        lastName:String ,
        email:{ type: String ,unique:true },
      password: String,
      userType: String,
         },
         {
        collection:"loginditals"
    }
)
const LoginSignUp= mongoose.model("loginDitals",loginDitalsSchema);
module.exports = LoginSignUp; 
       
   

