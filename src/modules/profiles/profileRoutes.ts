import { Router } from "express";
import { CreateUserProfileController } from "./controllers/profile/CreateUserProfileController";
import { GetUserProfileController } from "./controllers/profile/GetUserProfileController";

const profileRoutes = Router();

const getUserProfileController = new GetUserProfileController();
const createUserProfileController = new CreateUserProfileController();

profileRoutes.post("/", createUserProfileController.handle);

profileRoutes.get("/info", getUserProfileController.handle);

export { profileRoutes };
