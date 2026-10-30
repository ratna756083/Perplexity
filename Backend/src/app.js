import express from 'express'
import Authroutes from './routes/auth.routes.js'
import charRouter from './routes/chat.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"




const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"https://perplexity-frontend-9e0x.onrender.com",
    credentials:true,
    methods:["GET","POST","PUT","PATCH"]
}))

app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"https://perplexity-wbhi.onrender.com/api/auth/google/callback"
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))


app.use('/api/auth',Authroutes)
app.use('/api/chats',charRouter)



export default app