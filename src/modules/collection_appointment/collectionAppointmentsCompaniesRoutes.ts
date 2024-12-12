import { Router } from "express";
import { ListAppointmentsByCompanyController } from "./controllers/companies/ListAppointmentsByCompanyController";
import { ShowAppointmentByCompanyController } from "./controllers/companies/ShowAppointmentByCompanyController";
import { CancelAppointmentByCompanyController } from "./controllers/companies/CancelAppointmentByCompanyController";
import { ConfirmationAppointmentByCompanyController } from "./controllers/companies/ConfirmationAppointmentByCompanyController";
import { CompleteAppointmentByCompanyController } from "./controllers/companies/CompleteAppointmentByCompanyController";

const collectionAppointmentsCompaniesRoutes = Router({ mergeParams: true });

const listAppointmentsByCompanyController =
  new ListAppointmentsByCompanyController();
const showAppointmentByCompanyController =
  new ShowAppointmentByCompanyController();
const cancelAppointmentByCompanyController =
  new CancelAppointmentByCompanyController();
const confirmationAppointmentByCompanyController =
  new ConfirmationAppointmentByCompanyController();
const completeAppointmentByCompanyController =
  new CompleteAppointmentByCompanyController();

collectionAppointmentsCompaniesRoutes.get(
  "/",
  listAppointmentsByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.get(
  "/:appointmentId",
  showAppointmentByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.patch(
  "/:appointmentId/confirmation",
  confirmationAppointmentByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.delete(
  "/:appointmentId",
  cancelAppointmentByCompanyController.handle,
);

collectionAppointmentsCompaniesRoutes.patch(
  "/:appointmentId/complete",
  completeAppointmentByCompanyController.handle,
);

export { collectionAppointmentsCompaniesRoutes };
