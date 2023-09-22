const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      cast: false,
      required: [true, "Username is required"],
    },
    lastname: {
      type: String,
      trim: true,
      cast: false,
      required: [true, "Lastname is required"],
    },
    password: {
      type: String,
      trim: true,
      cast: false,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      cast: false,
      required: [true, "Email is required"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
