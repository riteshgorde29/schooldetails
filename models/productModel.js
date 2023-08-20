const mongoose= require('mongoose')


const studentInfoSchema= mongoose.Schema(
    {
        firstName:{
            type:String,
            require:[true,"please enter a first name"]
        },
        lastName:{
            type:String,
            require:[true,"please enter a last name"]
        },
        age:{
            type:Number,
            require:true,
            default:0
        },
         rollno:{
            type:Number,
            require:true,
        },
        ditails:{
            type:String,
            require:[true,"please enter a product details"]

        },
        email:{
            type: String
        },
        password:{
            type: String
        },
        contactNumber:{
            type:Number,
            require:[true,"plese enter valid mobile number"]
        },
        address:[{
        street:{
            type:String,
            require:[true,"please enter a street name"]
        },
        city:{
            type:String,
            require:[true,"please enter a city name"]
        },
        state:{
            type:String,
            require:true 
        },
        postalCode:{
            type:Number,
            require:true,
        },
        country:{
            type:String,
            require:[true,"please enter a country details"]
        }  
        }]
    },
    {
        timestamps:true
    }
)
const Product = mongoose.model("studentInfo",studentInfoSchema);

module.exports = Product;
