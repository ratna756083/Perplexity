import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, createAgent, HumanMessage, tool } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage } from "langchain";
import * as z from "zod"
import { searchInternet } from "./internet.services.js";
import dotenv from 'dotenv'
dotenv.config()




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
    new SystemMessage(`You generate short, natural chat titles from the first message. Rules:
      - Return only the title text, no quotes, no explanation, no extra words.
      - Keep it to 2 to 4 words.
      - Make it clear, relevant, and sensible for everyday conversation topics.
      - Use natural English and title case.
      - If the message is vague, infer the likely topic and create a clean title.
      - Examples: "Plan a trip to Bali" -> "Bali Trip Plan"; "Explain React hooks" -> "React Hooks"; "Help me write a cover letter" -> "Cover Letter Help"`),

    new HumanMessage(`Generate a title for this chat based on the first message: "${message}"`)
  ])

  return response.text.trim()
}