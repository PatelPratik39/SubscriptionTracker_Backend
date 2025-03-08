import User from "../model/user.model.js";

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

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if(!user){
        const error = new Error ('User not found');
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

