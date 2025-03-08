import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectionToDaatabase from "./database/mongodb.js";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Subscription Tracker Backend API");
});

app.listen(PORT, async() => {
  console.log(`SubScription Tracker Backend API is running on http://localhost:${PORT}`);
  await connectionToDaatabase();
});

export default app;
