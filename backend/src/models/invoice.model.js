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
            type: String,
            required: true
        },
        gstRate:{
            type: String,
            default: "18%"
        },
        totalAmount: {
            type: Number,
            required: true
        },
        businessId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true
        },
        totalGST:{
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Invoice = mongoose.model("Invoice", invoiceSchema)