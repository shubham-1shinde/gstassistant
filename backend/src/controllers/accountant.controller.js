import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { Accountant } from "../models/accountant.model.js"


export const createAccountant = async (req, res) => {

  try {
    const { fullName, email, phone, firmName } = req.body;

    const createAcc = await Accountant.create({
      fullName,
      email, 
      phone,
      firmName
    })

    return res
    .status(200)
    .json(new ApiResponse(200, createAcc, "Accountant created successfully"))


  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAccountants = async (req, res) => {
  const response = await Accountant.aggregate([
    {
        $match: {},
    },
  ])

  return res
    .status(200)
    .json(
        new ApiResponse(200, response, "accountants fetched successfully")
    )

};