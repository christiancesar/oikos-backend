import { Router } from "express";
import { CreateDonationController } from "./controllers/CreateDonationController";
import { AssignDoneeController } from "./controllers/AssignDoneeController";
import { ShowDonationController } from "./controllers/ShowDonationController";
import { ListDonationsController } from "./controllers/ListDonationsController";
import { CancelDonationController } from "./controllers/CancelDonationController";
import { storage } from "@common/storages/multer";
import { AssignAttachmentsToDonationController } from "./controllers/AssignAttachmentsToDonationController";
import { RegisterIrregularityController } from "./controllers/RegisterIrregularityController";

const donationsRoutes = Router();

const createDonationController = new CreateDonationController();
const assignDoneeController = new AssignDoneeController();
const showDonationController = new ShowDonationController();
const listDonationsController = new ListDonationsController();
const cancelDonationController = new CancelDonationController();
const assignAttachmentsToDonationController =
  new AssignAttachmentsToDonationController();
const registerIrregularityController = new RegisterIrregularityController();

donationsRoutes.post("/", createDonationController.handle);
donationsRoutes.patch("/:donationId/assign", assignDoneeController.handle);
donationsRoutes.get("/:donationId", showDonationController.handle);
donationsRoutes.get("/", listDonationsController.handle);
donationsRoutes.delete("/:donationId", cancelDonationController.handle);
donationsRoutes.patch(
  "/:donationId/attachments",
  storage.local.array("files"),
  assignAttachmentsToDonationController.handle,
);
donationsRoutes.patch(
  "/:donationId/report",
  registerIrregularityController.handle,
);

export { donationsRoutes };
