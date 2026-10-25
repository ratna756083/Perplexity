import express from 'express'
import Authroutes from './routes/auth.routes.js'
import charRouter from './routes/chat.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'




const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(cors({
    origin:"https://perplexity-frontend-9e0x.onrender.com",
    credentials:true,
    methods:["GET","POST","PUT","PATCH"]
}))


app.use('/api/auth',Authroutes)
app.use('/api/chats',charRouter)



export default app