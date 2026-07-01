import mongoose from "mongoose";

const accountantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Enter a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"],
    },

    firmName: {
      type: String,
      required: [true, "Firm / Practice name is required"],
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    clients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Accountant = mongoose.model("Accountant", accountantSchema);

