import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  // implement signup logic
  const session = await mongoose.startSession(); // creating a session
  session.startTransaction(); // starting a transaction

  try {
    // create a new user
    const { name, email, password } = req.body;

    // first need to check User is already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exist with this email ❌");
      error.statusCode = 409;
      await session.abortTransaction();
      session.endSession();
      next(error);
      return;
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [{ name, email, password: hashPassword }],
      { session }
    );
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    // Commit transaction **only after successful response**
    await session.commitTransaction();
    session.endSession();
    console.log(
      `✅ 201 - User created successfully with id: ${newUsers[0]._id}, email: ${email}`
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "User created successfully  ✅",
      data: { user: newUsers[0], token }
    });
  } catch (error) {
    console.log("❌ create user error in signup controller 🔴", error);
    error.statusCode = 500;
    // only aboer transaction if something went wrong
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    return next(error);
  }
};

export const signIn = async (req, res, next) => {
  // implement signIn logic
try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        const error = new Error ('User not found');
        error.statusCode = 404;
        next(error);
        return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        const error = new Error ('Password is Incorrect ❌');
        error.statusCode = 401;
        next(error);
        return;
    }

    const token = jwt.sign({userId: user._id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

    res.status(200).json({
        success: true,
        status: 200,
        message: "User logged in successfully",
        data: {user, token}
    });
    
    
} catch (error) {
    next(error);
}

};

export const signOut = async (req, res, next) => {
  // implement signOut logic
};
