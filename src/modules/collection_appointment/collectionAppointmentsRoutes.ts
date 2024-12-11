import { Router } from "express";
import { CreateAppointmentController } from "./controllers/CreateAppointmentController";

const collectionAppointmentsRoutes = Router({ mergeParams: true });
const createAppointmentController = new CreateAppointmentController();

collectionAppointmentsRoutes.post("/", createAppointmentController.handle);

export { collectionAppointmentsRoutes };
