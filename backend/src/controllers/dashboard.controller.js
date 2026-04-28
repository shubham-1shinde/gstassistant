import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Invoice } from "../models/invoice.model.js"
import { Purchase } from "../models/purchase.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


const getNumericalValues = asyncHandler(async (req, res) => {

    const { businessId } = req.body;

    if (!businessId) {
        throw new ApiError(400, "businessId is required");
    }

    const objectBusinessId = new mongoose.Types.ObjectId(businessId);

    const result = await Invoice.aggregate([
        {
            $match: { businessId: objectBusinessId }
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalAmount" },
                outputGST: { $sum: "$totalGST" }
            }
        }
    ]);

    const totalSales = result[0]?.totalSales || 0;
    const outputGST = result[0]?.outputGST || 0;

    const resultInputITC = await Purchase.aggregate([
        {
            $match: { businessId: objectBusinessId }
        },
        {
            $group: {
                _id: null,
                inputITC: { $sum: "$totalGST" }
            }
        }
    ]);
    const inputITC = resultInputITC[0]?.inputITC || 0;

    const netGST = outputGST - inputITC;


    return res.json({
        success: true,
        totalSales,
        inputITC,
        outputGST,
        netGST: netGST.toFixed(2),
    });

});

export {
    getNumericalValues,
}
