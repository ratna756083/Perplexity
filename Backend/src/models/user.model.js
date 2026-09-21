import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    
    password:{
        type:String,
        required:[true,"password is required"],
        select:false
    },
    isVerified:{
        type:Boolean,
        default:false
    }

    
})

const userModel=mongoose.model("users",userSchema)

export default userModel