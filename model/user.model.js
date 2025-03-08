import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "userName is required"],
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    lowerCase: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email"]    
  },
  password:{
    type: String,
    required: [true, "User password is required"],
    minLength: 6
  }
},{
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;