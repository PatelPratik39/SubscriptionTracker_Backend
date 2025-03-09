import Subscription from "../model/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    console.log("📌 [CREATE SUBSCRIPTION] Incoming request:", req.body);

    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id
    });

    console.log(
      `✅ [SUBSCRIPTION CREATED] ID: ${subscription._id}, Name: ${subscription.name}, User: ${req.user._id}`
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "Subscription created successfully ✅",
      data: subscription
    });
  } catch (error) {
    console.error("❌ [SUBSCRIPTION CREATION ERROR]:", error.message);

    res.status(400).json({
      success: false,
      status: 400,
      error:
        error.message || "Something went wrong while creating the subscription"
    });

    next(error);
  }
};
