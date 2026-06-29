import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message:{
            type: String,
            required: true
        },
        reply:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const Chat = mongoose.model("Chat", chatSchema)