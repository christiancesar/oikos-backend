import { Router } from "express";
import { ListAppointmentsByCompanyController } from "./controllers/companies/ListAppointmentsByCompanyController";
import { ShowAppointmentByCompanyController } from "./controllers/companies/ShowAppointmentByCompanyController";
import { CancelAppointmentByCompanyController } from "./controllers/companies/CancelAppointmentByCompanyController";
import { ConfirmationAppointmentByCompanyController } from "./controllers/companies/ConfirmationAppointmentByCompanyController";

const collectionAppointmentsCompaniesRoutes = Router({ mergeParams: true });

const listAppointmentsByCompanyController =
  new ListAppointmentsByCompanyController();
const showAppointmentByCompanyController =
  new ShowAppointmentByCompanyController();
const cancelAppointmentByCompanyController =
  new CancelAppointmentByCompanyController();
const confirmationAppointmentByCompanyController =
  new ConfirmationAppointmentByCompanyController();

collectionAppointmentsCompaniesRoutes.get(
  "/",
  listAppointmentsByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.get(
  "/:appointmentId",
  showAppointmentByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.patch(
  "/:appointmentId",
  confirmationAppointmentByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.delete(
  "/:appointmentId",
  cancelAppointmentByCompanyController.handle,
);

export { collectionAppointmentsCompaniesRoutes };
