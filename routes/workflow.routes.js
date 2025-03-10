import { Router } from "express";
import { sendReminder } from "../controller/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post('/', sendReminder);

export default workflowRouter;