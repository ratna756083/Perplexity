import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, createAgent, HumanMessage, tool } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage } from "langchain";
import * as z from "zod"
import { searchInternet } from "./internet.services.js";




const model = new ChatGoogleGenerativeAI({
  // model: "gemini-3.7-flash",
  model:"gemini-3.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
});


const mistralModel = new ChatMistralAI({
    model: "ministral-3b-latest",
    apiKey:process.env.MISTRAL_API_KEY
   
})

const searchInternetTool=tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"Use this tool to get the latest information from the internet",
    scema:z.object({
      query:z.string().describe("The search query to look up on the internet")
    })
  }
)

const agent=createAgent({
  model:model,
  tools:[searchInternetTool]
})

export async function generateResponce(messages){
  const response=await agent.invoke({
    messages:messages.map(msg=>{
    if(msg.role=="user"){
      return new HumanMessage(msg.content)
    }else if(msg.role == "ai"){
      return new AIMessage(msg.content)
    }
  })
  })
  
  return response.messages[response.messages.length-1].text
}

export async function generateChatTitle(message){
  const response=await mistralModel.invoke([
    new SystemMessage(`You are helpful assistant that generates concise and descriptive titles for the chat convertions
      User will provide you with the first message of a chat coversation and you will generate a title that captures the essence of the conversations in 2-4 words .The title should be clear 
      relevent and engaging giving users a quike understanding of the chat topic
      `),

    new HumanMessage(`Generate title for a chat conversation based on following first message: "${message}"`)
  ])

  return response.text
}