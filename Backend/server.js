import http from 'http'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) })

const [{ default: app }, { initSocket }, { default: connectDB }] = await Promise.all([
    import("./src/app.js"),
    import("./src/sockets/server.socket.js"),
    import("./src/config/database.js")
])

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