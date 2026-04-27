import mongoose, {Schema} from "mongoose";

const purchaseSchema = new Schema(
  {
    // ── Core Bill Info ───────────────────────────────────────────
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
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
      default: null,          // null for unregistered vendors
    },
    vendorState: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Item / Line Info ─────────────────────────────────────────
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

    // ── GST Breakdown ────────────────────────────────────────────
    gstRate: {
      type: Number,           // 0, 3, 5, 12, 18, 28
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
    totalAmount: {            // taxableAmount + totalGST (bill_total)
      type: Number,
      required: true,
      min: 0,
    },

    // ── ITC (Input Tax Credit) ───────────────────────────────────
    itcEligible: {
      type: Boolean,
      required: true,
      default: true,
        // false for: diesel, alcohol, personal-use items,
        // blocked credits under Section 17(5)
    },
    itcClaimed: {
      type: Number,
      default: 0,
      min: 0,
        // = totalGST if itcEligible, else 0
    },
    itcStatus: {
      type: String,
      enum: ["unclaimed", "claimed", "reversed", "ineligible"],
      default: "unclaimed",
    },

    // ── Supply & Transaction Info ────────────────────────────────
    placeOfSupply: {
      type: String,
      trim: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["intrastate", "interstate"],
    },

    // ── Status ───────────────────────────────────────────────────
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "pending", "cancelled"],
      default: "pending",
    },

    // ── Business Reference ───────────────────────────────────────
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

// ── Indexes for fast dashboard queries ───────────────────────────────────────
purchaseSchema.index({ businessId: 1, month: 1 });
purchaseSchema.index({ businessId: 1, financialYear: 1 });
purchaseSchema.index({ businessId: 1, itcEligible: 1 });
purchaseSchema.index({ businessId: 1, itcStatus: 1 });
purchaseSchema.index({ businessId: 1, paymentStatus: 1 });
purchaseSchema.index({ invoiceNumber: 1, businessId: 1 });

// ── Virtual: GST rate as string (e.g. "18%") ─────────────────────────────────
purchaseSchema.virtual("gstRateLabel").get(function () {
  return this.gstRate + "%";
});

// ── Virtual: ITC yet to be claimed ───────────────────────────────────────────
purchaseSchema.virtual("itcPending").get(function () {
  if (!this.itcEligible) return 0;
  return this.itcStatus === "claimed" ? 0 : this.itcClaimed;
});

// ── Pre-save: auto-calculate totals & ITC ────────────────────────────────────
purchaseSchema.pre("save", function (next) {
  // Step 1 — taxable amount from quantity × unit price
  this.taxableAmount = this.quantity * this.unitPrice;

  // Step 2 — GST split based on transaction type
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

  this.totalGST    = gstAmount;
  this.totalAmount = this.taxableAmount + this.totalGST;

  // Step 3 — ITC: only eligible bills get credit
  // Ineligible examples: diesel (2710), alcohol, electricity (2716)
  this.itcClaimed = this.itcEligible ? this.totalGST : 0;

  // Step 4 — auto-set itcStatus if ineligible
  if (!this.itcEligible) {
    this.itcStatus = "ineligible";
  }

  next();
});

// ── Static: monthly ITC summary for dashboard ─────────────────────────────────
purchaseSchema.statics.getMonthlySummary = async function (businessId, financialYear) {
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
};

// ── Static: combined dashboard summary (sales + purchases together) ───────────
purchaseSchema.statics.getDashboardData = async function (businessId, financialYear) {
  const SalesInvoice = mongoose.model("SalesInvoice");

  const [salesData, purchaseData] = await Promise.all([
    SalesInvoice.getMonthlySummary(businessId, financialYear),
    this.getMonthlySummary(businessId, financialYear),
  ]);

  const MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

  // Index both by month name for easy lookup
  const salesMap    = Object.fromEntries(salesData.map((r) => [r._id, r]));
  const purchaseMap = Object.fromEntries(purchaseData.map((r) => [r._id, r]));

  return {
    months:        MONTHS,
    totalSales:    MONTHS.map((m) => salesMap[m]?.totalSales  ?? 0),
    outputGst:     MONTHS.map((m) => salesMap[m]?.outputGst   ?? 0),
    inputItc:      MONTHS.map((m) => purchaseMap[m]?.inputITC ?? 0),
    netGstPayable: MONTHS.map((m) => {
      const output = salesMap[m]?.outputGst   ?? 0;
      const itc    = purchaseMap[m]?.inputITC ?? 0;
      return Math.max(0, output - itc);   // net can't be negative
    }),
  };
};

export const Purchase = mongoose.model("Purchase", purchaseSchema)