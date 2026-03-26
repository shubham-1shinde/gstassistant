import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Business } from "../models/business.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createBusiness = asyncHandler( async (req, res) => {
    const { businessName, gstin, state } = req.body
    //console.log("createBusiness", { businessName, gstin, state })

    if ([businessName, gstin, state].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedBusiness = await Business.findOne({
        $or: [{ gstin }]
    })

    if (existedBusiness) {
        throw new ApiError(409, "Business with GSTIN already exists")
    }

    const newBusiness = await Business.create({
        businessName,
        gstin,
        state,
        ownerId: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(200, newBusiness, "Business created successfully")
    )
})

const getBusinesses = asyncHandler( async (req, res) => {
    const businesses = await Business.find({ ownerId: req.user._id }).sort({ createdAt: -1 })
    return res.status(200).json(
        new ApiResponse(200, businesses, "Businesses fetched successfully")
    )
})

const getBusiness = asyncHandler( async (req, res) => {
    const { _id } = req.body
    const business = await Business.findOne({ ownerId: req.user._id, _id })
    return res.status(200).json(
        new ApiResponse(200, business, "Business fetched successfully")
    )
})

export {
    createBusiness,
    getBusiness,
    getBusinesses
}
