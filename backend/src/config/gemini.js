import { GoogleGenAI } from "@google/genai";

//console.log("key", process.env.GEMINI_API_KEY)

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default ai;
/*
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default genAI;
*/