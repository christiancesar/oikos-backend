import { Router } from "express";
import { CreateAppointmentController } from "./controllers/CreateAppointmentController";
import { UpdateScheduleForAppointmentController } from "./controllers/UpdateScheduleForAppointmentController";
import { ShowAppointmentController } from "./controllers/ShowAppointmentController";
import { ListAppointmentsByUserController } from "./controllers/ListAppointmentsByUserController";
import { CancelAppointmentController } from "./controllers/CancelAppointmentController";

const collectionAppointmentsRoutes = Router({ mergeParams: true });
const createAppointmentController = new CreateAppointmentController();
const updateScheduleForAppointmentController =
  new UpdateScheduleForAppointmentController();
const showAppointmentController = new ShowAppointmentController();
const listAppointmentsByUserController = new ListAppointmentsByUserController();
const cancelAppointmentController = new CancelAppointmentController();

collectionAppointmentsRoutes.post("/", createAppointmentController.handle);
collectionAppointmentsRoutes.patch(
  "/:appointmentId",
  updateScheduleForAppointmentController.handle,
);
collectionAppointmentsRoutes.get(
  "/:appointmentId",
  showAppointmentController.handle,
);
collectionAppointmentsRoutes.get("/", listAppointmentsByUserController.handle);
collectionAppointmentsRoutes.delete(
  "/:appointmentId",
  cancelAppointmentController.handle,
);

export { collectionAppointmentsRoutes };
