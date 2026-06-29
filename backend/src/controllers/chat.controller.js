/*import ai from "../config/gemini.js";

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    // Guard: ensures we never fall back to Google ADC.
   
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert GST Tax Assistant for India.
        Answer in simple language using bullet points whenever possible.
        User: ${message}`,
    });

    


    res.json({
      success: true,
      reply: response.candidates?.[0]?.content?.parts?.[0]?.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import genAI from "../config/gemini.js";

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(
      `You are an expert GST Tax Assistant for India. 
      Answer in simple bullet points.
      User: ${message}`
    );

    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      reply: text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/

import { GoogleGenAI } from "@google/genai";
import { Chat } from "../models/chat.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


export const chatWithGemini = async (req, res) => {

  try {
    const { message, userId } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: 
        `You are an expert GST Tax Assistant for India.

        RULES:
        - Do NOT use markdown symbols like ###, **, *, or ▸
        - Use simple plain text
        - Use bullet points with "-"

        User: ${message}`,
    });
    console.log(response);

    //console.log("only resp", response.output_text);
    //console.log("derived resp", response.data.reply.output_text);

    const createConvo = await Chat.create({
      userId,
      message, 
      reply: response.output_text,
    })

    res.status(200).json({
      success: true,
      reply: response.output_text,
      message: "conversation created successfully",
    });


  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getConvo = async (req, res) => {
  const {userId} = req.params;
  console.log(userId);

  const response = await Chat.aggregate([
  {
    $match: {
      userId,
    },
  },
  {
    $sort: { createdAt: 1 },
  },
  {
    $project: {
      message: 1,
      reply: 1,
      createdAt: 1,
    },
  },
]);
  console.log("chats:",response)

  return res
    .status(200)
    .json(
        new ApiResponse(200, response, "chats fetched successfully")
    )

};