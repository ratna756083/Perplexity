import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage,getChats, getMessages } from "../service/chat.api";
import { setIsLoading, setCurrentChatId, setError, createNewChat, addNewMessage, setChats,addMessages } from '../chat.slice'
import { useDispatch } from 'react-redux'

export const useChat = () => {
    const dispatch = useDispatch()

    async function handelSendMessage({ message, chatId }) {
        dispatch(setIsLoading(true))

        try {
            const data = await sendMessage({ message, chatId })
            const { chat, Aimessage } = data
            const activeChatId = chat?._id || chatId

            if (activeChatId) {
                dispatch(createNewChat({
                    chatId: activeChatId,
                    title: chat?.title || 'New Chat'
                }))
                dispatch(addNewMessage({
                    chatId: activeChatId,
                    content: message,
                    role: 'user'
                }))

                if (Aimessage) {
                    dispatch(addNewMessage({
                        chatId: activeChatId,
                        content: Aimessage.content,
                        role: Aimessage.role
                    }))
                }

                dispatch(setCurrentChatId(activeChatId))
            }
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || 'Failed to send message'))
        } finally {
            dispatch(setIsLoading(false))
        }
    }


    async function handelGetChats(){
        dispatch(setIsLoading(true))
        try {
            const data = await getChats()
            const { chats } = data

            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title || 'New Chat',
                    messages: Array.isArray(chat.messages)
                        ? chat.messages.map(msg => ({
                            content: msg.content,
                            role: msg.role,
                          }))
                        : [],
                    lastUpdated: chat.updatedAt || new Date().toISOString(),
                }
                return acc
            }, {})))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || 'Failed to load chats'))
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    async function handelOpenChats(chats,chatId){
    //   if(chats[chatId]?.messages.length === 0){
          const data=await getMessages(chatId)
        const {messages}=data
        const formattedMessages=messages.map(msg=>({
            content:msg.content,
            role:msg.role
        }))
        dispatch(addMessages({
            chatId,
            messages:formattedMessages
        }))
        dispatch(setCurrentChatId(chatId))
    //   }
    }

    return {
        initializeSocketConnection,
        handelSendMessage,
        handelGetChats,
        handelOpenChats
    }
}