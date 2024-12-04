import { Router } from "express";
import { CreateCompanyController } from "./controllers/companies/CreateCompanyController";
import { GetCompanyController } from "./controllers/companies/GetCompanyController";
import { UpdateCompanyController } from "./controllers/companies/UpdateCompanyController";
import { CreateAddressCompanyController } from "./controllers/addresses/CreateAddressCompanyController";
import { GetAddressCompanyController } from "./controllers/addresses/GetAddressCompanyController";
import { UpdateAddressCompanyController } from "./controllers/addresses/UpdateAddressCompanyController";
import { CreateBusinessHoursController } from "./controllers/business_hours/CreateBusinessHoursController";
import { CreateWasteItemController } from "./controllers/waste_items/CreateWasteItemController";
import { ListWasteItemsController } from "./controllers/waste_items/ListWasteItemsController";
import { DeleteWasteItemController } from "./controllers/waste_items/DeleteWasteItemController";

const companiesRoutes = Router();
const createCompanyController = new CreateCompanyController();
const getCompanyController = new GetCompanyController();
const updateCompanyController = new UpdateCompanyController();

const createAddressCompanyController = new CreateAddressCompanyController();
const getAddressCompanyController = new GetAddressCompanyController();
const updateAddressCompanyController = new UpdateAddressCompanyController();

const createBusinessHoursController = new CreateBusinessHoursController();

const createWasteItemController = new CreateWasteItemController();
const listWasteItemsController = new ListWasteItemsController();
const deleteWasteItemController = new DeleteWasteItemController();

companiesRoutes.post("/", createCompanyController.handle);
companiesRoutes.get("/:companyId", getCompanyController.handle);

companiesRoutes.patch("/:companyId", updateCompanyController.handle);

companiesRoutes.get("/:companyId/address", getAddressCompanyController.handle);

companiesRoutes.post(
  "/:companyId/address",
  createAddressCompanyController.handle,
);

companiesRoutes.patch(
  "/:companyId/address",
  updateAddressCompanyController.handle,
);

companiesRoutes.post(
  "/:companyId/business-hours",
  createBusinessHoursController.handle,
);

companiesRoutes.post("/:companyId/waste", createWasteItemController.handle);
companiesRoutes.get("/:companyId/waste", listWasteItemsController.handle);
companiesRoutes.delete(
  "/:companyId/waste/:wasteId",
  deleteWasteItemController.handle,
);
export { companiesRoutes };
