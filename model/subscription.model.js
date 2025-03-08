import { type } from "express/lib/response";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 100
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"]
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "INR"],
      default: "USD"
    },
    frequency: {
      type: String,
      enum: [, "Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly"
    },
    category: {
      type: String,
      enum: [
        "Entertainment",
        "Sports",
        "News",
        "Technology",
        "LifeStyle",
        "Business",
        "Food",
        "Health",
        "Travel",
        "Other"
      ],
      required: [true, "Subscription category is required"]
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["Active", "cancelled", "expired"],
      default: "Active"
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past"
      }
    },
    renewalDate: {
      type: Date,
      required: [true, "Renewal date is required"],
      validate: {
        validator: (value) => value > this.startDate,
        message: "Renewal date must be after start date"
      }
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: (value) => value > this.renewalDate,
        message: "End date must be after renewal date"
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true
    }
  },
  {
    timestamps: true
  }
);

subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriod = {
            "Daily": 1,
            "Weekly": 7,
            "Monthly": 30,
            "Yearly": 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriod[this.frequency]);
    }
    // Auto-update the status if renewal date has passed
    if(this.renewalDate < new Date()) {
        this.status = "expired";
    }
    next();
});
const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;