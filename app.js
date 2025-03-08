import express from "express";
import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Subscription Tracker Backend API");
});

app.listen(PORT, () => {
  console.log(`SubScription Tracker Backend API is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
export default app;
