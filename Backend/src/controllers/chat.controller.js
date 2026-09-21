import { generateResponce,generateChatTitle} from "../services/ai.services.js"
import chatModel from "../models/chat.model.js"
import msgModel from "../models/message.model.js"


export async function chatController(req,res){
    const {message,chat:chatId}=req.body

    
    let chat=null,title=null
    const activeChatId=chatId
    
    if (!activeChatId) {
      title = await generateChatTitle(message);

      chat = await chatModel.create({
        user: req.user.userId,
        title
      });
    } 
    
    
    
    const Usermessage=await msgModel.create({
        chat:activeChatId || chat._id,
        content:message,
        role:"user"
    })

   
    
      
     let  messages=await msgModel.find({chat:activeChatId || chat._id})
    
    

   
    const result=await generateResponce(messages)


    const Aimessage=await msgModel.create({
        chat:activeChatId || chat._id,
        content:result,
        role:"ai"
    })


    res.status(201).json({
        title,
        chat,
        Aimessage
    })





}


export async function getChats(req,res){
  const user=req.user

  const chats=await chatModel.find({user:user.userId})

  res.status(200).json({
    message:"chta fetched suces..",
    chats
  })
}

export async function getMessages(req,res){
    const {chatId} =req.params
    console.log(chatId)
    const user=req.user
    const chat=await chatModel.findOne({
      user:user.userId,
      _id:chatId
    })
    if(!chat){
      return res.status(404).json({
        message:"chat not found"
      })
    }

    const messages=await msgModel.find({
      chat:chatId
    })

    res.status(200).json({
      message:"messages fetched sucessfully",
      messages
    })
}


export async function chatDelete(req,res){
  const user=req.user
  const {chatId}=req.params

 const chat= await chatModel.findOneAndDelete({
    _id:chatId,
    user:user.userId
  })

  await msgModel.deleteMany({
    chat:chatId
  })
  if(!chat){
    return res.status(200).json({
      message:"chat not found"
    })
  }

  res.status(200).json({
    message:"chat deleted"
  })
}







