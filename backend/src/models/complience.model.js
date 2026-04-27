import mongoose from "mongoose";

const complienceSchema = new mongoose.Schema(
{
  title: String,
  desc: String,
  month: String,
  date: Date,
  status: {
    type: String,
    enum: ["pending", "completed", "upcoming"],
    default: "pending",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
},
{ timestamps: true }
);

export const Complience = mongoose.model("Complience", complienceSchema);