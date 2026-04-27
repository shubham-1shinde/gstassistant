import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    // ── Core Bill Info ───────────────────────────────────────────
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    purchaseDate: {
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

    // ── Vendor Info ──────────────────────────────────────────────
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorGstin: {
      type: String,
      trim: true,
      uppercase: true,
      default: null, // optional
    },
    vendorState: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Item Info ────────────────────────────────────────────────
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

    // ── GST ──────────────────────────────────────────────────────
    gstRate: {
      type: Number,
      required: true,
      enum: [0, 3, 5, 12, 18, 28],
      default: 18,
    },
    cgst: { type: Number, default: 0, min: 0 },
    sgst: { type: Number, default: 0, min: 0 },
    igst: { type: Number, default: 0, min: 0 },

    totalGST: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ── ITC ──────────────────────────────────────────────────────
    itcEligible: {
      type: Boolean,
      required: true,
      default: true,
    },
    itcClaimed: {
      type: Number,
      default: 0,
      min: 0,
    },
    itcStatus: {
      type: String,
      enum: ["unclaimed", "claimed", "reversed", "ineligible"],
      default: "unclaimed",
    },

    // ── Transaction ──────────────────────────────────────────────
    placeOfSupply: {
      type: String,
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

    // ── Business ─────────────────────────────────────────────────
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
  },
  { timestamps: true }
);


// ── ✅ FIXED INDEXES ─────────────────────────────────────────────

// invoiceNumber unique per business
purchaseSchema.index(
  { invoiceNumber: 1, businessId: 1 },
  { unique: true }
);

// vendor GSTIN unique per business (allows null)
purchaseSchema.index(
  { vendorGstin: 1, businessId: 1 },
  { unique: true, sparse: true }
);

// Other indexes
purchaseSchema.index({ businessId: 1, month: 1 });
purchaseSchema.index({ businessId: 1, financialYear: 1 });
purchaseSchema.index({ businessId: 1, itcEligible: 1 });
purchaseSchema.index({ businessId: 1, itcStatus: 1 });
purchaseSchema.index({ businessId: 1, paymentStatus: 1 });


// ── Virtuals ────────────────────────────────────────────────────
purchaseSchema.virtual("gstRateLabel").get(function () {
  return this.gstRate + "%";
});

purchaseSchema.virtual("itcPending").get(function () {
  if (!this.itcEligible) return 0;
  return this.itcStatus === "claimed" ? 0 : this.itcClaimed;
});


// ── Pre-save ────────────────────────────────────────────────────
purchaseSchema.pre("save", function (next) {
  this.taxableAmount = this.quantity * this.unitPrice;

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

  this.totalGST = gstAmount;
  this.totalAmount = this.taxableAmount + this.totalGST;

  this.itcClaimed = this.itcEligible ? this.totalGST : 0;

  if (!this.itcEligible) {
    this.itcStatus = "ineligible";
  }

  next();
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);