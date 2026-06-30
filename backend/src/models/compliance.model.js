import mongoose from "mongoose";

const complianceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    financialYear: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    desc: String,

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["completed"],
      default: undefined,
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

complianceSchema.index(
  {
    businessId: 1,
    month: 1,
    financialYear: 1,
    title: 1,
  },
  {
    unique: true,
  }
);


export const Compliance = mongoose.model("Compliance", complianceSchema);