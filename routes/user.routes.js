import e, { Router } from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controller/user.controller.js";
import authorized from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorized, getUser);
userRouter.post("/", (req, res) => res.send({ title: "CREATE New User" }));
userRouter.put("/:id", authorized, updateUser);
userRouter.delete("/:id",authorized, deleteUser);

export default userRouter;
