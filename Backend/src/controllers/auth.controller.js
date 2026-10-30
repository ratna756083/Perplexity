import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'




 
export const registerController = async (req, res) => {
    const { username, email, password } = req.body;

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            String(password),
            10
        );

       
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
          
        });
        const token=jwt.sign({
            userId:user._id
        },process.env.JWT_SECRET,
        {expiresIn:"7d"})

      res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
       })

       res.status(201).json({
        message:"user created successfully",
        user:{
            username:user.username,
            email:user.email
        }
       })

        

    } catch(err){
        console.log(err)
    }

        
};
export const  googleCallback=async (req,res)=>{
    const {id,displayName,emails,photos}=req.user
    const email=emails[0].value
  
    let user=await userModel.findOne({email})
    if(!user){
        user=await userModel.create({
            fullname:displayName,
            email,
            googleId:id
        })
    }
    const token=jwt.sign({
        userId:user._id
    },config.JWT_SECRET,
    {expiresIn:"7d"})
  res.cookie("token",token,{
     httpOnly: true,
     secure: true,
     sameSite: "none",
     maxAge: 7 * 24 * 60 * 60 * 1000
  })

    res.redirect("https://perplexity-frontend-9e0x.onrender.com/")
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


    const token=jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message:"login successful",
        user:{
            username:user.username,
            email:user.email,
            
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
          
        }
    })
    
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



