import { Router } from "express";
import { signIn, signOut, signUp } from "../controller/auth.controller.js";

const authRouter = Router();

// path : /api/v1/auth/sign-up -> post body {name, email, password} -> create a new user
authRouter.post("/sign-up", signUp);
// path : /api/v1/auth/sign-in -> post body { email, password} -> login a user
authRouter.post("/sign-in", signIn);
// path : /api/v1/auth/sign-out -> logout
authRouter.post("/sign-out", signOut);

export default authRouter;
