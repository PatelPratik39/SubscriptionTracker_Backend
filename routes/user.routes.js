import e, { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => res.send({ title: "GET All Users" }));
userRouter.get("/:id", (req, res) => res.send({ title: "GET User details" }));
userRouter.post("/", (req, res) => res.send({ title: "CREATE New User" }));
userRouter.put("/:id", (req, res) => res.send({ title: "UPDATE a Users" }));
userRouter.delete("/:id", (req, res) => res.send({ title: "DELETE a User" }));

export default userRouter;