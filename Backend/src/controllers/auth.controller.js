import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendEmail } from "../services/mail.services.js";



 
export const registerController = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();

        // Check whether username or email already exists
        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email: normalizedEmail }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            String(password),
            10
        );

        // Create user as unverified
        const user = await userModel.create({
            username,
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: false
        });

        // Generate email verification token
        const emailVerifyToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const verifyUrl =
            `https://perplexity-wbhi.onrender.com/api/auth/verify-email?token=${encodeURIComponent(emailVerifyToken)}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "Verify your PerplexCity account",
                html: `
                    <h2>Welcome to PerplexCity, ${user.username}!</h2>
                    <p>Please verify your email address to activate your account.</p>
                    <a href="${verifyUrl}">Verify Email</a>
                    <p>This link expires in 24 hours.</p>
                `
            });

            return res.status(201).json({
                success: true,
                emailSent: true,
                message: "Registration successful. Please check your email.",
                user: {
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified
                }
            });

        } catch (emailError) {
            console.error(
                "VERIFICATION EMAIL FAILED:",
                emailError.message
            );

            return res.status(202).json({
                success: true,
                emailSent: false,
                message: "Account created, but the verification email could not be sent. Please try again later.",
                user: {
                    username: user.username,
                    email: user.email,
                    isVerified: user.isVerified
                }
            });
        }

    } catch (error) {
        console.error("REGISTER ERROR:", error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};



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
                <a href="https://perplexity-wbhi.onrender.com/api/auth/login">Login</a>`

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



