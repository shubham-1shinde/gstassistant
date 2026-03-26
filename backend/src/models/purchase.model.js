import mongoose, {Schema} from "mongoose";

const purchaseSchema = new Schema(
    {
        vendorName: {
            type: String,
            required: true,
            trim: true,
        },
        vendorGSTIN: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
        },
        purchaseDate: {
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        gstRate:{
            type: String,
            default: "18%"
        },
        businessId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true
        },
        totalGST: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Purchase = mongoose.model("Purchase", purchaseSchema)