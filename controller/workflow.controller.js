import { createRequire } from "module";
import Subscription from "../model/subscription.model.js";
const require = createRequire(import.meta.url);
import dayjs from "dayjs";

const REMINDERS = [7, 5, 2, 1];

const { serve } = require("@upstash/workflow/express");

export const sendReminder = serve(async (context) => {
  // implement sendReminder logic
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || ["cancelled", "expired"].includes(subscription.status)) {
    console.log(
      `❌ Subscription ${subscriptionId} is not active. Stopping workflow.`
    );
    return;
  }

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

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`⏳ Sleeping until ${label} reminder at ${date}`);


  await context.sleepUntil(label, date.toDate());
};

const triggerReminder  =async(context, label) =>{
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // Send Email or phone notifiaction        /
    })
}