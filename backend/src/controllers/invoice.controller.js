import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Invoice } from "../models/invoice.model.js";

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
  return Math.round(num * 100) / 100;
}

// ── Create Invoice ────────────────────────────────────────────────────────────
const createInvoice = asyncHandler(async (req, res) => {
  const {
    // ── existing ──────────────────────────────────
    invoiceNumber,
    invoiceDate,
    gstRate,
    businessId,

    // ── new: customer ─────────────────────────────
    customerName,
    customerGstin,
    customerState,

    // ── new: item ─────────────────────────────────
    itemDescription,
    hsnCode,
    quantity,
    unitPrice,

    // ── new: supply ───────────────────────────────
    transactionType,
    placeOfSupply,

    // ── new: status ───────────────────────────────
    paymentStatus,
  } = req.body;

  console.log("Received Invoice Data:", req.body);

  // ── Validation ────────────────────────────────────────────────────────────
  if (
    !invoiceNumber?.trim()  ||
    !invoiceDate            ||
    !gstRate                ||
    !businessId             ||
    !customerName?.trim()   ||
    !customerState?.trim()  ||
    !itemDescription?.trim()||
    !hsnCode?.trim()        ||
    !quantity               ||
    !unitPrice              ||
    !transactionType?.trim()
  ) {
    throw new ApiError(
      400,
      "invoiceNumber, invoiceDate, gstRate, businessId, customerName, customerState, itemDescription, hsnCode, quantity, unitPrice, transactionType are required"
    );
  }

  // ── Duplicate check ───────────────────────────────────────────────────────
  const existedInvoice = await Invoice.findOne({ invoiceNumber });
  if (existedInvoice) {
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

  // ── Date formatting (your original logic) ────────────────────────────────
  const date          = new Date(invoiceDate);

  // ── Create ────────────────────────────────────────────────────────────────
  const newInvoice = await Invoice.create({
    // existing
    invoiceNumber,
    invoiceDate:   date,
    gstRate:       gstRateNum,
    businessId,

    // auto-derived from date
    month:         getMonthFromDate(invoiceDate),
    financialYear: getFinancialYear(invoiceDate),

    // customer
    customerName,
    customerGstin: customerGstin?.toUpperCase() || null,
    customerState,

    // item
    itemDescription,
    hsnCode,
    quantity:      qty,
    unitPrice:     price,

    // calculated
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalGST:      gstAmount,
    totalAmount,

    // supply
    placeOfSupply: placeOfSupply || customerState,
    transactionType,

    // status
    paymentStatus: paymentStatus || "pending",
  });

  return res.status(201).json(
    new ApiResponse(201, newInvoice, "Invoice created successfully")
  );
});

// ── Get All Invoices ──────────────────────────────────────────────────────────
const getInvoices = asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  //console.log("Fetching invoices for businessId:", businessId);

  if (!businessId) {
    throw new ApiError(400, "businessId is required");
  }

  const invoices = await Invoice.find({ businessId }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, invoices, "Invoices fetched successfully")
  );
});

// ── Get Single Invoice ────────────────────────────────────────────────────────
const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice fetched successfully")
  );
});

// ── Update Payment Status ─────────────────────────────────────────────────────
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus } = req.body;

  if (!["paid", "pending", "cancelled"].includes(paymentStatus)) {
    throw new ApiError(400, "paymentStatus must be paid, pending or cancelled");
  }

  const invoice = await Invoice.findByIdAndUpdate(
    id,
    { $set: { paymentStatus } },
    { new: true }
  );

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Payment status updated successfully")
  );
});

// ── Delete Invoice ────────────────────────────────────────────────────────────
const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await Invoice.findByIdAndDelete(id);
  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Invoice deleted successfully")
  );
});

// ── Monthly Summary for Dashboard ────────────────────────────────────────────
const getMonthlySummary = asyncHandler(async (req, res) => {
  const { businessId, financialYear } = req.query;

  if (!businessId || !financialYear) {
    throw new ApiError(400, "businessId and financialYear are required");
  }

  const summary = await Invoice.aggregate([
    {
      $match: {
        businessId:    new mongoose.Types.ObjectId(businessId),
        financialYear,
        paymentStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id:          "$month",
        totalSales:   { $sum: "$taxableAmount" },
        outputGst:    { $sum: "$totalGST" },
        totalCGST:    { $sum: "$cgst" },
        totalSGST:    { $sum: "$sgst" },
        totalIGST:    { $sum: "$igst" },
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.status(200).json(
    new ApiResponse(200, summary, "Monthly summary fetched successfully")
  );
});

export {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updatePaymentStatus,
  deleteInvoice,
  getMonthlySummary,
};