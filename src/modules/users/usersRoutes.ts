import { Router } from "express";
import { CreateUserController } from "./controllers/CreateUserController";
import { GetUserController } from "./controllers/GetUserController";
import authenticationMiddleware from "@common/middlewares/authenticationMiddleware";

const usersRouter = Router();
const createUserController = new CreateUserController();
const getUserController = new GetUserController();

usersRouter.post("/", createUserController.handle);

usersRouter.use(authenticationMiddleware);
usersRouter.get("/", getUserController.handle);

export { usersRouter };
