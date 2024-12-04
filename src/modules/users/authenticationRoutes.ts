import { Router } from "express";
import AuthenticationController from "./controllers/AuthenticationController";

const sessionsRouter = Router();
const authenticationController = new AuthenticationController();

sessionsRouter.post("/", authenticationController.handle);

export { sessionsRouter };
