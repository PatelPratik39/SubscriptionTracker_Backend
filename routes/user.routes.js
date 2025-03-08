import e, { Router } from "express";
import { getUser, getUsers } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/", (req, res) => res.send({ title: "CREATE New User" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE a Users" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE a User" }));

export default userRouter;