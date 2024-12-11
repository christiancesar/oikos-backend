import { Router } from "express";
import { CreateAppointmentController } from "./controllers/customers/CreateAppointmentController";
import { UpdateScheduleForAppointmentController } from "./controllers/customers/UpdateScheduleForAppointmentController";
import { ShowAppointmentController } from "./controllers/customers/ShowAppointmentController";
import { ListAppointmentsByUserController } from "./controllers/customers/ListAppointmentsByUserController";
import { CancelAppointmentController } from "./controllers/customers/CancelAppointmentController";

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
