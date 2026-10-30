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
        required:()=>{
           return !this.googleId
        },
        select:false
    },
    googleId:{
      type:String
   }

    
})

const userModel=mongoose.model("users",userSchema)

export default userModel