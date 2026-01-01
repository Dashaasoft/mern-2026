import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true }, // Утасны дугаар
    name: { type: String, required: true }, // Хэрэглэгчийн нэр
  },
  { timestamps: true }
); // createdAt, updatedAt

export default mongoose.model("User", userSchema);
