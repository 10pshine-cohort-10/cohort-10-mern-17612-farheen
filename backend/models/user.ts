import mongoose, {Schema, model} from "mongoose";
import type {InferSchemaType} from "mongoose";

export const userSchema = new Schema({
    name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, select: false},
    // token version: every token carries it, logout bumps it so older tokens stop working
    ver: {type: Number, default: 0},
}, {timestamps: true});

export const User = mongoose.models.User || model<InferSchemaType<typeof userSchema>>("User", userSchema);
