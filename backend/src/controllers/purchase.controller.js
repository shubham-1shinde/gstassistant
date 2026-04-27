import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Purchase } from "../models/purchase.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getMonthFromDate(dateStr) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[new Date(dateStr).getMonth()];
}

function getFinancialYear(dateStr) {
  const date  = new Date(dateStr);
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 4) return `${year}-${String(year + 1).slice(2)}`;
  return `${year - 1}-${String(year).slice(2)}`;
}

function round2(num) {
  return Math.round(num * 100) / 100;  // your original rounding logic
}

// ── Create Purchase ───────────────────────────────────────────────────────────
const createPurchase = asyncHandler(async (req, res) => {
  const {
    // ── existing ──────────────────────────────────
    invoiceNumber,
    vendorName,
    vendorGstin,
    gstRate,
    businessId,
    purchaseDate,

    // ── new: vendor ───────────────────────────────
    vendorState,

    // ── new: item ─────────────────────────────────
    itemDescription,
    hsnCode,
    quantity,
    unitPrice,

    // ── new: itc ──────────────────────────────────
    itcEligible,

    // ── new: supply ───────────────────────────────
    transactionType,
    placeOfSupply,

    // ── new: status ───────────────────────────────
    paymentStatus,
  } = req.body;

  console.log("Received purchase data:", req.body); // your original log

  // ── Validation (your original fields first, then new) ────────────────────
  if (
    !invoiceNumber?.trim()   ||
    !vendorName?.trim()      ||
    !vendorGstin?.trim()     ||
    !gstRate                 ||
    !businessId              ||
    !purchaseDate            ||
    !vendorState?.trim()     ||
    !itemDescription?.trim() ||
    !hsnCode?.trim()         ||
    !quantity                ||
    !unitPrice               ||
    !transactionType?.trim()
  ) {
    throw new ApiError(
      400,
      "invoiceNumber, vendorName, vendorGSTIN, gstRate, businessId, purchaseDate, vendorState, itemDescription, hsnCode, quantity, unitPrice, transactionType are required"
    );
  }

  // ── Duplicate check (your original logic) ─────────────────────────────────
  const existedPurchase = await Purchase.findOne({ invoiceNumber });
  if (existedPurchase) {
    throw new ApiError(409, "Invoice with this number already exists");
  }

  // ── Calculations ──────────────────────────────────────────────────────────
  const gstRateNum    = parseFloat(gstRate);
  const qty           = parseFloat(quantity);
  const price         = parseFloat(unitPrice);

  const taxableAmount = round2(qty * price);
  const gstAmount     = round2((taxableAmount * gstRateNum) / 100);
  const totalAmount   = round2(taxableAmount + gstAmount);

  const cgst = transactionType === "intrastate" ? round2(gstAmount / 2) : 0;
  const sgst = transactionType === "intrastate" ? round2(gstAmount / 2) : 0;
  const igst = transactionType === "interstate"  ? gstAmount             : 0;

  // ITC — only eligible bills get credit
  const isItcEligible = itcEligible === true || itcEligible === "true";
  const itcClaimed    = isItcEligible ? gstAmount : 0;
  const itcStatus     = isItcEligible ? "unclaimed" : "ineligible";

  // ── Date formatting (your original logic) ─────────────────────────────────
  const date          = new Date(purchaseDate);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });

  //console.log(formattedDate); // your original log

  // ── Create ────────────────────────────────────────────────────────────────
  const newPurchase = await Purchase.create({
    // existing
    invoiceNumber,
    vendorName,
    vendorGstin:   vendorGstin.toUpperCase(),
    gstRate:       gstRateNum,
    businessId,
    purchaseDate:  formattedDate,

    // auto-derived from date
    month:         getMonthFromDate(purchaseDate),
    financialYear: getFinancialYear(purchaseDate),

    // vendor
    vendorState,

    // item
    itemDescription,
    hsnCode,
    quantity:      qty,
    unitPrice:     price,

    // calculated (your original round2 logic)
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalGST:      round2(gstAmount),   // same as your Math.round(totalGST * 100) / 100
    totalAmount,

    // itc
    itcEligible:   isItcEligible,
    itcClaimed,
    itcStatus,

    // supply
    placeOfSupply: placeOfSupply || vendorState,
    transactionType,

    // status
    paymentStatus: paymentStatus || "pending",
  });

  return res.status(201).json(
    new ApiResponse(201, newPurchase, "Purchase created successfully")
  );
});

// ── Get All Purchases ─────────────────────────────────────────────────────────
const getPurchases = asyncHandler(async (req, res) => {
  const { businessId } = req.body;

  if (!businessId) {
    throw new ApiError(400, "businessId is required");
  }

  const purchases = await Purchase.find({ businessId }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, purchases, "Purchases fetched successfully")
  );
});

// ── Get Single Purchase ───────────────────────────────────────────────────────
const getPurchaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const purchase = await Purchase.findById(id);
  if (!purchase) {
    throw new ApiError(404, "Purchase not found");
  }

  return res.status(200).json(
    new ApiResponse(200, purchase, "Purchase fetched successfully")
  );
});

// ── Update Payment Status ─────────────────────────────────────────────────────
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!["paid", "pending", "cancelled"].includes(paymentStatus)) {
    throw new ApiError(400, "paymentStatus must be paid, pending or cancelled");
  }

  const purchase = await Purchase.findByIdAndUpdate(
    id,
    { $set: { paymentStatus } },
    { new: true }
  );

  if (!purchase) {
    throw new ApiError(404, "Purchase not found");
  }

  return res.status(200).json(
    new ApiResponse(200, purchase, "Payment status updated successfully")
  );
});

// ── Update ITC Status ─────────────────────────────────────────────────────────
const updateItcStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { itcStatus } = req.body;

  if (!["unclaimed", "claimed", "reversed", "ineligible"].includes(itcStatus)) {
    throw new ApiError(
      400,
      "itcStatus must be unclaimed, claimed, reversed or ineligible"
    );
  }

  const purchase = await Purchase.findById(id);
  if (!purchase) {
    throw new ApiError(404, "Purchase not found");
  }

  if (!purchase.itcEligible) {
    throw new ApiError(400, "Cannot update ITC status — this bill is not ITC eligible");
  }

  purchase.itcStatus = itcStatus;
  await purchase.save();

  return res.status(200).json(
    new ApiResponse(200, purchase, "ITC status updated successfully")
  );
});

// ── Delete Purchase ───────────────────────────────────────────────────────────
const deletePurchase = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const purchase = await Purchase.findByIdAndDelete(id);
  if (!purchase) {
    throw new ApiError(404, "Purchase not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Purchase deleted successfully")
  );
});

// ── Monthly ITC Summary for Dashboard ────────────────────────────────────────
const getMonthlySummary = asyncHandler(async (req, res) => {
  const { businessId, financialYear } = req.query;

  if (!businessId || !financialYear) {
    throw new ApiError(400, "businessId and financialYear are required");
  }

  const summary = await Purchase.aggregate([
    {
      $match: {
        businessId:    new mongoose.Types.ObjectId(businessId),
        financialYear,
        paymentStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id:            "$month",
        totalPurchases: { $sum: "$taxableAmount" },
        totalGSTPaid:   { $sum: "$totalGST" },
        inputITC:       { $sum: "$itcClaimed" },   // only eligible ITC
        totalCGST:      { $sum: "$cgst" },
        totalSGST:      { $sum: "$sgst" },
        totalIGST:      { $sum: "$igst" },
        billCount:      { $sum: 1 },
        ineligibleGST: {
          $sum: {
            $cond: [{ $eq: ["$itcEligible", false] }, "$totalGST", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json(
    new ApiResponse(200, summary, "Monthly summary fetched successfully")
  );
});

// ── Combined Dashboard (Sales + Purchases) ────────────────────────────────────
const getDashboardSummary = asyncHandler(async (req, res) => {
  const { businessId, financialYear } = req.query;

  if (!businessId || !financialYear) {
    throw new ApiError(400, "businessId and financialYear are required");
  }

  const MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

  const { Invoice } = await import("../models/invoice.model.js");

  const [salesData, purchaseData] = await Promise.all([
    Invoice.aggregate([
      {
        $match: {
          businessId:    new mongoose.Types.ObjectId(businessId),
          financialYear,
          paymentStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id:        "$month",
          totalSales: { $sum: "$taxableAmount" },
          outputGst:  { $sum: "$totalGST" },
        },
      },
    ]),
    Purchase.aggregate([
      {
        $match: {
          businessId:    new mongoose.Types.ObjectId(businessId),
          financialYear,
          paymentStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id:      "$month",
          inputITC: { $sum: "$itcClaimed" },
        },
      },
    ]),
  ]);

  // Index by month name for easy lookup
  const salesMap    = Object.fromEntries(salesData.map((r) => [r._id, r]));
  const purchaseMap = Object.fromEntries(purchaseData.map((r) => [r._id, r]));

  const dashboard = {
    months:        MONTHS,
    totalSales:    MONTHS.map((m) => salesMap[m]?.totalSales  ?? 0),
    outputGst:     MONTHS.map((m) => salesMap[m]?.outputGst   ?? 0),
    inputItc:      MONTHS.map((m) => purchaseMap[m]?.inputITC ?? 0),
    netGstPayable: MONTHS.map((m) => {
      const output = salesMap[m]?.outputGst   ?? 0;
      const itc    = purchaseMap[m]?.inputITC ?? 0;
      return round2(Math.max(0, output - itc));
    }),
  };

  return res.status(200).json(
    new ApiResponse(200, dashboard, "Dashboard summary fetched successfully")
  );
});

export {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePaymentStatus,
  updateItcStatus,
  deletePurchase,
  getMonthlySummary,
  getDashboardSummary,
};