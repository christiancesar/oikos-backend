import { Router } from "express";
import { CreateTransactionController } from "./controllers/CreateTransactionController";
import { ListAllTransactionByCompanyController } from "./controllers/ListAllTransactionByCompanyController";
import { UpdateTransactionController } from "./controllers/UpdateTransactionController";
import { CanceledTransactionController } from "./controllers/CanceledTransactionController";

const collectionTransactionRoutes = Router({ mergeParams: true });
const createTransactionController = new CreateTransactionController();
const listAllTransactionByCompanyController =
  new ListAllTransactionByCompanyController();

const updateTransactionController = new UpdateTransactionController();
const canceledTransactionController = new CanceledTransactionController();

collectionTransactionRoutes.post("/", createTransactionController.handle);
collectionTransactionRoutes.get(
  "/",
  listAllTransactionByCompanyController.handle,
);

collectionTransactionRoutes.patch(
  "/:transactionId",
  updateTransactionController.handle,
);

collectionTransactionRoutes.delete(
  "/:transactionId",
  canceledTransactionController.handle,
);

export { collectionTransactionRoutes };
