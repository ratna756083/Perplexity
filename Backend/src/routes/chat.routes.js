import { Router } from "express";
import { chatController,getChats,getMessages,chatDelete } from "../controllers/chat.controller.js";
import verifyUser from "../middleware/auth.middleware.js";


const chatRouter=Router()

chatRouter.post("/message",verifyUser,chatController)
chatRouter.get("/",verifyUser,getChats)
chatRouter.get("/:chatId/messages",verifyUser,getMessages)
chatRouter.delete("/delete/:chatId",verifyUser,chatDelete)



export default chatRouter