import { Router } from "express";
import { profileRoutes } from "@modules/profiles/profileRoutes";
import { sessionsRouter } from "@modules/users/authenticationRoutes";
import { usersRouter } from "@modules/users/usersRoutes";
import { companiesRoutes } from "@modules/companies/companiesRoutes";
import authenticationMiddleware from "@common/middlewares/authenticationMiddleware";
import { materialsRoutes } from "@modules/material/MaterialRegistrationRoutes";

export const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use(authenticationMiddleware);
routes.use("/profile", profileRoutes);
routes.use("/companies", companiesRoutes);
routes.use("/materials", materialsRoutes);
