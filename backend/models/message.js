import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema
const MessageSchema = new Schema({
    message: String,
    from: String,
})
export default mongoose.model("Mesaage", MessageSchema)