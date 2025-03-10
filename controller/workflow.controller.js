import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dayjs from "dayjs";

import Subscription from "../model/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";

const { serve } = require("@upstash/workflow/express");

const REMINDERS = [7, 5, 2, 1];

export const sendReminder = serve(async (context) => {
  // implement sendReminder logic
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;
  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal Data has passed for subscription ${subscriptionId}. Stopping the workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderData = renewalDate.subtract(daysBefore, "day");

    if (reminderData.isAfter(dayjs())) {
      console.log(`⏳ Sleeping until reminder ${daysBefore} days before.`);
      await sleepUntilReminder(
        context,
        `reminder-${daysBefore} days before`,
        reminderData
      );
      await triggerReminder(context, `reminder-${daysBefore} days before`);
    }
  }

});

// const fetchSubscription = async (context, subscriptionId) => {
//   return await context.run("get subscription", () => {
//     return Subscription.findById(subscriptionId).populate("user", "name email");
//   });
// };

// const fetchSubscription = async (context, subscriptionId) => {
//   return await context.run("get subscription", async () => {
//     const subscription = await Subscription.findById(subscriptionId).populate(
//       "user",
//       "name email"
//     );

//     if (!subscription) {
//       throw new Error(`Subscription with ID ${subscriptionId} not found`);
//     }

//     return {
//       _id: subscription._id,
//       name: subscription.name,
//       renewalDate: subscription.renewalDate,
//       user: subscription.user
//         ? { name: subscription.user.name, email: subscription.user.email }
//         : null
//     };
//   });
// };


// const sleepUntilReminder = async (context, label, date) => {
//   console.log(`⏳ Sleeping until ${label} reminder at ${date}`);
//   await context.sleepUntil(label, date.toDate());
// };

// const triggerReminder  = async(context, label, subscription) =>{
//     return await context.run(label, async() => {
//         console.log(`Triggering ${label} reminder`);
//         // Send Email or phone notifiaction  
//         await sendReminderEmail({to: Subscription.user.email, type: REMINDERS.label.subscription, subscription: subscription}); 

//     })
// }

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    const subscription = await Subscription.findById(subscriptionId).populate(
      "user",
      "name email"
    );

    if (!subscription) {
      console.log(`🚫 Subscription with ID ${subscriptionId} not found.`);
      throw new Error(`Subscription with ID ${subscriptionId} not found`);
    }

    console.log(
      `✅ Subscription ${subscriptionId} found. Reminder scheduled for ${subscription.renewalDate}`
    );

    return {
      _id: subscription._id,
      name: subscription.name,
      renewalDate: dayjs(subscription.renewalDate), // ✅ Convert to dayjs object
      reminderDate: subscription.reminderDate
        ? dayjs(subscription.reminderDate)
        : dayjs(subscription.renewalDate).subtract(7, "day"), // ✅ Ensure valid reminder date
      user: subscription.user
        ? { name: subscription.user.name, email: subscription.user.email }
        : null
    };
  });
};


const sleepUntilReminder = async (context, label, date) => {
  console.log(`⏳ Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

// ✅ Fix: Correct `triggerReminder` to Use the Correct Subscription Object
const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`📩 Triggering ${label} reminder for ${subscription.name}`);

    if (!subscription.user || !subscription.user.email) {
      console.log(
        `🚫 No valid email found for subscription ${subscription._id}`
      );
      return;
    }

    // Send Email or Notification
    await sendReminderEmail({
      to: subscription.user.email, // ✅ Corrected email reference
      type: label, // ✅ Passing correct label
      subscription: subscription
    });

    console.log(`✅ Reminder sent to ${subscription.user.email}`);
  });
};