import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide a Username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide a Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide a Password"],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
