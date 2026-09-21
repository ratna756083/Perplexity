import { createSlice } from "@reduxjs/toolkit";


const chatSlice=createSlice({
    name:"chat",
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{
        createNewChat:(state,action)=>{
            const {chatId,title}=action.payload
            const existingChat = state.chats[chatId]

            state.chats[chatId] = {
                ...(existingChat || {}),
                id: chatId,
                title: title || existingChat?.title || 'New Chat',
                messages: existingChat?.messages || [],
                lastUpdated: new Date().toISOString(),
            }
        },
        addNewMessage:(state,action)=>{
            const {chatId,content,role}=action.payload

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: 'New Chat',
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                }
            }

            state.chats[chatId].messages.push({ content, role })
        },
        addMessages:(state,action)=>{
            const {chatId,messages=[]}=action.payload
            const existingChat = state.chats[chatId] || {}

            state.chats[chatId] = {
                ...existingChat,
                id: chatId,
                title: existingChat.title || 'New Chat',
                messages: Array.isArray(messages) ? messages : [],
                lastUpdated: new Date().toISOString(),
            }
        },
        setChats:(state,action)=>{
            state.chats=action.payload
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload
        },
        setIsLoading:(state,action)=>{
            state.isLoading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        }
    }
})

export const {setChats,setCurrentChatId,setIsLoading,setError,createNewChat,addNewMessage,addMessages}=chatSlice.actions
export default chatSlice.reducer