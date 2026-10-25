import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendEmail } from "../services/mail.services.js";



 export const registerController=async (req,res)=>{
    const {username,email,password}=req.body

    const AlreadyUser=await userModel.findOne({
        $or:[{username},{email}]
    })

    if(AlreadyUser){
        return res.status(200).json({
            message:"user already exist",
            success:false
        })
    }
    let hash=await bcrypt.hash(String(password),10)

    let user=await userModel.create({
        username,
        email,
        password:hash
    })

   const emailVerifyToken=jwt.sign({
    email:user.email
   },process.env.JWT_SECRET)
    

    await sendEmail({
        to:email,
        subject:"Welcome to Perplexity",
        html:`<p>Hi ${username},</p>
              <h1>Welcome to our app</h1>
              <p>We are excited to have you on board. Please verify your email by clicking the link below:</p>
              <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerifyToken}">Verify Email</a>
              <p> if you did not sign up for this account, please ignore this email.</p>
              <p>Thank you </p>`
             

    })

    
    res.status(201).json({
        message:"user register sucessfully",
        user:{
            username:user.username,
            email:user.email,
            isVerified:user.isVerified
        }
    })


}


export const loginController=async (req,res)=>{
    const {email,password}=req.body

    const user=await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(404).json({
            message:"Invalid credentials",
            success:false
        })
    }

    const isMatch=await bcrypt.compare(String(password),user.password)

    if(!isMatch){
        return res.status(400).json({
            message:"Invalid credentials",
            success:false
        })
    }

    if(!user.isVerified){
        return res.status(400).json({
            message:"Please verify your email before logging in",
            success:false
        })
    }

    const token=jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("token",token)

    res.status(200).json({
        message:"login successful",
        user:{
            username:user.username,
            email:user.email,
            isVerified:user.isVerified
        }
       
    })

}


export const getMeController=async (req,res)=>{
    const decoded=req.user
    const user=await userModel.findById(decoded.userId)
    if(!user){
        return res.status(404).json({
            message:"Invallid token",
            success:false
        })
    }

    res.status(200).json({  
        user:{
            username:user.username,
            email:user.email,
            isVerified:user.isVerified
        }
    })
    
}






export const verifyEmailController=async (req,res)=>{
    const {token}=req.query 

    try{ 
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await userModel.findOne({email:decoded.email})

    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            success:false
        })
    }

    user.isVerified=true
    await user.save()

    const html=`<h1>Email Verified Successfully</h1>
                <p>Thank you for verifying your email. You can now log in to your account.</p>
                <a href="http://localhost:3000/api/auth/login">Login</a>`

           res.send(html)
            


    }catch(err){
        console.error(err)
        res.status(400).json({
            message:"Invalid token",
            success:false
        })
    }
}



export const logout=async (req,res)=>{
    const token=req.cookies.token 
    if(!token){
        return res.status(404).json({
            message:"token not provided"
        })
    }

    res.clearCookie("token",{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    })

    res.status(200).json({
        message:"logout successfully"
    })
}



