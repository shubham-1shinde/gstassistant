import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Purchase } from "../models/purchase.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createPurchase = asyncHandler( async (req, res) => {
    const { invoiceNumber, vendorName, vendorGSTIN, gstRate, businessId, purchaseDate, totalAmount  } = req.body

    if (!invoiceNumber?.trim() || !vendorGSTIN || !gstRate?.trim() || !businessId || !vendorName?.trim() || !purchaseDate) {
        throw new ApiError(400, "All purchase fields are required")
    }

    const existedPurchase = await Purchase.findOne({
        invoiceNumber
    })

    if (existedPurchase) {
        throw new ApiError(409, "Invoice with this number already exists")
    }

    const gstRateNum = parseFloat(gstRate);
    const totalAmountNum = parseFloat(totalAmount);
    const taxableValue = totalAmountNum / (1 + (gstRateNum / 100));
    const totalGST = totalAmountNum - taxableValue;
    
    //console.log(totalGST.toFixed(2));

    const date = new Date(purchaseDate);

    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    console.log(formattedDate);

    const newPurchase = await Purchase.create({
        invoiceNumber, 
        purchaseDate: formattedDate, 
        totalAmount, 
        vendorName,
        vendorGSTIN,
        gstRate, 
        businessId, 
        totalGST: Math.round(totalGST * 100) / 100,
    })

    return res.status(201).json(
        new ApiResponse(200, newPurchase, "Purchase created successfully")
    )
})

const getPurchases = asyncHandler( async (req, res) => {
    const {businessId} = req.body;

    if (!businessId) {
        throw new ApiError(400, "businessId is required")
    }
    const purchases = await Purchase.find({ businessId }).sort({ createdAt: -1 })
    return res.status(200).json(
        new ApiResponse(200, purchases, "Purchases fetched successfully")
    )
})


export {
    createPurchase,
    getPurchases,
}
