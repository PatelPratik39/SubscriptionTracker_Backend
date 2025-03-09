import { Router } from "express";
import authorized from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getUserSubscriptionById,
  deleteSubscription,
  updateSubscription,
  cancelSubscription,
  renewSubscription
} from "../controller/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorized, getAllSubscriptions);

subscriptionRouter.get("/:id", authorized, getUserSubscriptionById);

subscriptionRouter.post("/", authorized, createSubscription);

subscriptionRouter.put("/:id", authorized, updateSubscription);

subscriptionRouter.delete("/:id", authorized, deleteSubscription);

subscriptionRouter.get("/user/:id", authorized, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorized, cancelSubscription);

subscriptionRouter.get("/upcoming-renewals", authorized, renewSubscription);

export default subscriptionRouter;