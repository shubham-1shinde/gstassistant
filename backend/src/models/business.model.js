import mongoose, {Schema} from "mongoose";

const businessSchema = new Schema(
    {
        businessName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        gstin: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },
        ownerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        state: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            enum: [
                "ANDHRA PRADESH",
                "ARUNACHAL PRADESH",
                "ASSAM",
                "BIHAR",
                "CHHATTISGARH",
                "GOA",
                "GUJARAT",
                "HARYANA",
                "HIMACHAL PRADESH",
                "JHARKHAND",
                "KARNATAKA",
                "KERALA",
                "MADHYA PRADESH",
                "MAHARASHTRA",
                "MANIPUR",
                "MEGHALAYA",
                "MIZORAM",
                "NAGALAND",
                "ODISHA",
                "PUNJAB",
                "RAJASTHAN",
                "SIKKIM",
                "TAMIL NADU",
                "TELANGANA",
                "TRIPURA",
                "UTTAR PRADESH",
                "UTTARAKHAND",
                "WEST BENGAL",
                "ANDAMAN AND NICOBAR ISLANDS",
                "CHANDIGARH",
                "DADRA AND NAGAR HAVELI AND DAMAN AND DIU",
                "DELHI",
                "JAMMU AND KASHMIR",
                "LADAKH",
                "LAKSHADWEEP",
                "PUDUCHERRY"
            ]
        }
    },
    {
        timestamps: true
    }
)

export const Business = mongoose.model("Business", businessSchema)