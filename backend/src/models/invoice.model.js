import mongoose, {Schema} from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    month: {
      type: String,
      required: true,
      enum: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
    },
    financialYear: {
      type: String,
      required: true,
      default: "2025-26",  
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerGstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,         // null for unregistered customers (B2C)
    },
    customerState: {
      type: String,
      required: true,
      trim: true,
    },

    itemDescription: {
      type: String,
      required: true,
      trim: true,
    },
    hsnCode: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    taxableAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    gstRate: {
      type: Number,           // stored as number: 18, 12, 5, 28, 3, 0
      required: true,
      enum: [0, 3, 5, 12, 18, 28],
      default: 18,
    },
    cgst: {
      type: Number,
      default: 0,
      min: 0,
    },
    sgst: {
      type: Number,
      default: 0,
      min: 0,
    },
    igst: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalGST: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {             // taxableAmount + totalGST (invoice_total)
      type: Number,
      required: true,
      min: 0,
    },

    placeOfSupply: {
      type: String,
      required: true,
      trim: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["intrastate", "interstate"],
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "pending", "cancelled"],
      default: "pending",
    },

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ businessId: 1, month: 1 });
invoiceSchema.index({ businessId: 1, financialYear: 1 });
invoiceSchema.index({ businessId: 1, paymentStatus: 1 });
invoiceSchema.index({ invoiceNumber: 1, businessId: 1 });

invoiceSchema.virtual("gstRateLabel").get(function () {
  return this.gstRate + "%";
});

invoiceSchema.pre("save", function (next) {
  // taxableAmount from quantity × unitPrice
  this.taxableAmount = this.quantity * this.unitPrice;

  // For intrastate → split into CGST + SGST, zero out IGST
  // For interstate → full GST goes to IGST, zero out CGST/SGST
  const gstAmount = (this.taxableAmount * this.gstRate) / 100;

  if (this.transactionType === "intrastate") {
    this.cgst = gstAmount / 2;
    this.sgst = gstAmount / 2;
    this.igst = 0;
  } else {
    this.cgst = 0;
    this.sgst = 0;
    this.igst = gstAmount;
  }

  this.totalGST   = gstAmount;
  this.totalAmount = this.taxableAmount + this.totalGST;

  next();
});

invoiceSchema.statics.getMonthlySummary = async function (businessId, financialYear) {
  return this.aggregate([
    {
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
        financialYear,
        paymentStatus: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$month",
        totalSales:    { $sum: "$taxableAmount" },
        outputGst:     { $sum: "$totalGST" },
        totalCGST:     { $sum: "$cgst" },
        totalSGST:     { $sum: "$sgst" },
        totalIGST:     { $sum: "$igst" },
        invoiceCount:  { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    ]);
}

export const Invoice = mongoose.model("Invoice", invoiceSchema)