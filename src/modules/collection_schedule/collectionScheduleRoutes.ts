import { Router } from "express";
import { CollectionScheduleController } from "./CollectionScheduleController";

const collectionScheduleRoutes = Router();
const collectionScheduleController = new CollectionScheduleController();

collectionScheduleRoutes.post("/", collectionScheduleController.create);

export { collectionScheduleRoutes };
