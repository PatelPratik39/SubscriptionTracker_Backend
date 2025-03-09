import mongoose from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

/**
 * 
Get all users
 */

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      status: 200,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Get a User based on ID
 */

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }
    res.status(200).json({
      success: true,
      status: 200,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a User
 */

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌"
      });
    }
    console.log(
      `✅ [USER UPDATED] ID: ${updateUser._id}, Name: ${updateUser.name}, Email: ${updateUser.email}`
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "User updated successfully ✅",
      data: updateUser
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Delete User
 */

export const deleteUser = async(req, res, next) => {
  try {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      return res.status(400).json({
        success: false,
        message: "Invalid ID ❌"
      });
    }

    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if(!deleteUser){
      return res.status(404).json({
        success: false,
        message: "User not found ❌"
      });
    }
    console.log(
      `✅ [USER DELETED] ID: ${deleteUser._id}, Name: ${deleteUser.name}, Email: ${deleteUser.email}`
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully ✅",
      data: deleteUser
    });
    
  } catch (error) {
    next(error);
  }
}