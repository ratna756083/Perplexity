import app from "./src/app.js"
import http from 'http'
import { initSocket } from "./src/sockets/server.socket.js"

const server=http.createServer(app)


initSocket(server)


server.listen(3000,()=>{
    console.log("server is runnin at 3000")
})