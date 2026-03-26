import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Invoice } from "../models/invoice.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createInvoice = asyncHandler( async (req, res) => {
    const { invoiceNumber, invoiceDate, totalAmount, gstRate, businessId } = req.body

    if (!invoiceNumber?.trim() || !totalAmount || !gstRate?.trim() || !businessId) {
        throw new ApiError(400, "invoiceNumber, totalAmount, gstRate, businessId are required")
    }

    const existedInvoice = await Invoice.findOne({
        invoiceNumber
    })

    if (existedInvoice) {
        throw new ApiError(409, "Invoice with this number already exists")
    }

    const gstRateNum = parseFloat(gstRate);
    const totalAmountNum = parseFloat(totalAmount);
    const taxableValue = totalAmountNum / (1 + (gstRateNum / 100));
    const totalGST = totalAmountNum - taxableValue;
    //console.log(totalGST.toFixed(2));

    const date = new Date(invoiceDate);

    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const newInvoice = await Invoice.create({
        invoiceNumber, 
        invoiceDate: formattedDate, 
        totalAmount, 
        gstRate, 
        businessId, 
        //totalGST: totalGST.toFixed(2),  store"18.54" instead of 18.5432"
        totalGST: Math.round(totalGST * 100) / 100, //store 18.54 instead of 18.5432"
    })

    return res.status(201).json(
        new ApiResponse(200, newInvoice, "Invoice created successfully")
    )
})

const getInvoices = asyncHandler( async (req, res) => {
    const {businessId} = req.body;

    if (!businessId) {
        throw new ApiError(400, "businessId is required")
    }
    const invoices = await Invoice.find({ businessId }).sort({ createdAt: -1 })
    return res.status(200).json(
        new ApiResponse(200, invoices, "Invoices fetched successfully")
    )
})


export {
    createInvoice,
    getInvoices,
}
