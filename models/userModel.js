import mongoose from "mongoose";

let userModel = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

export default mongoose.model("User", userModel);
