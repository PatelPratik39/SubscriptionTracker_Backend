import Subscription from "../model/subscription.model.js";

/**
 * @route GET /api/v1/subscription/
 * @desc Get all subscriptions
 * @access Public
 */

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    if(!subscriptions){
      return res.status(404).json({
        success: false,
        message: "Subscriptions not found ❌"
      });
    }
    console.log(
      `✅ [SUBSCRIPTION CREATED] ID: ${subscriptions._id}, Name: ${subscriptions.name}, User: ${req.user._id}`
    )
    res.status(200).json({
      success: true,
      status: 200,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/v1/subscription/:id
 * @desc Get single subscription details
 * @access Public
 */
export const getUserSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if(!subscription){
      return res.status(404).json({
        success: false,
        message: "Subscription not found ❌"
      });
    }
    console.log(
      `✅ [SUBSCRIPTION CREATED] ID: ${subscription._id}, Name: ${subscription.name}, User: ${req.user._id}`
    )
    res.status(200).json({
      success: true,
      status: 200,
      data: subscription
    });
  } catch (error) {
    next(error);
  }
};

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

/**
 * @route PUT /api/v1/subscription/:id
 * @desc Update an existing subscription
 * @access Private (Requires authentication)
 */

export const updateSubscription = async (req, res, next) => {
  try {
    const updateSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if(!updateSubscription){
      return res.status(404).json({
        success: false,
        message: "Subscription not found ❌"
      });
    }
    console.log(
      `✅ [SUBSCRIPTION UPDATED] ID: ${updateSubscription._id}, Name: ${updateSubscription.name}, User: ${req.user._id}`
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: "Subscription updated successfully ✅",
      data: updateSubscription
      })    
  } catch (error) {
    next(error);
  }
}


/**
 * @route DELETE /api/v1/subscription/:id
 * @desc Delete a subscription
 * @access Private (Requires authentication)
 */

export const deleteSubscription = async (req, res, next) => {
    try {
        const deleteSubscription = await Subscription.findByIdAndDelete(req.params.id);
        if(!deleteSubscription){
            return res.status(404).json({
                success: false,
                message: "Subscription not found ❌"
            });
        }
        console.log(
            `✅ [SUBSCRIPTION DELETED] ID: ${deleteSubscription._id}, Name: ${deleteSubscription.name}, User: ${req.user._id}`
        );
        res.status(200).json({
            success: true,
            status: 200,
            message: "Subscription deleted successfully ✅",
            data: deleteSubscription
            })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    console.log(
      `✅ [SUBSCRIPTION CREATED] ID: ${subscriptions._id}, Name: ${subscriptions.name}, User: ${req.user._id}`
    );
    res.status(200).json({
      success: true,
      status: 200,
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/v1/subscription/:id/cancel
 * @desc Cancel a subscription
 * @access Private (Requires authentication)
 */


export const cancelSubscription = async (req, res, next) => {
  try{
    const subscription = await Subscription.findById(req.params.id);

    if(!subscription){
        return res.status(404).json({
            success: false,
            message: "Subscription not found ❌"
        });
    }
    // Set status to cancelled
    subscription.status = "cancelled";
    await subscription.save();
    console.log(
        `✅ [SUBSCRIPTION CANCELLED] ID: ${subscription._id}, Name: ${subscription.name}, User: ${req.user._id}`
    );
    
    res.status(200).json({
        success: true,
        status: 200,
        message: "Subscription cancelled successfully ✅",
        data: subscription
    });


  } catch (error) {
    next(error);
  }
};


/**
 * @route PUT /api/v1/subscription/:id/cancel
 * @desc Cancel a subscription
 * @access Private (Requires authentication)
 */

export const renewSubscription = async (req, res, next) => {
    try {
        const today = new Date();
        const upcommingSubscription = await Subscription.find({
          renewalDate: { $gte: today }
        }).sort({ renewalDate: 1 });

        if (!upcommingSubscription) {
            return res.status(404).json({
                success: false,
                message: "No upcomming subscription found",
            });
        }
        console.log(
            `✅ [SUBSCRIPTION RENEWED] ID: ${upcommingSubscription._id}, Name: ${upcommingSubscription.name}, User: ${req.user._id}`
        );
        res.status(200).json({
          success: true,
          status: 200,
          message: "Upcoming subscription renewaed successfully ✅",
          data: upcommingSubscription
        });
    } catch (error) {
        next(error);
    }
}