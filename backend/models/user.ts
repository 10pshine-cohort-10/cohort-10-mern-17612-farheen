import mongoose, {Schema, model} from "mongoose";
import type {InferSchemaType} from "mongoose";

export const userSchema = new Schema({
    name: {type: String, required: true, trim: true},
  email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true});

export const User = mongoose.models.User || model<InferSchemaType<typeof userSchema>>("User", userSchema);
