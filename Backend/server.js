import dotenv from 'dotenv'
dotenv.config()
import app from "./src/app.js"
import http from 'http'
import { initSocket } from "./src/sockets/server.socket.js"
import connectDB from "./src/config/database.js"

const server=http.createServer(app)

const startServer = async () => {
    try {
        await connectDB()
        initSocket(server)
        server.listen(3000,()=>{
            console.log("server is runnin at 3000")
        })
    } catch (error) {
        console.error('Unable to start server because MongoDB connection failed:', error)
        process.exitCode = 1
    }
}

startServer()