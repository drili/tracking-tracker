import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const User = models.User || model("User", userSchema)