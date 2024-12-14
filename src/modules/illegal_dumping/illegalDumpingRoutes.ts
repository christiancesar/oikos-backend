import authenticationMiddleware from "@common/middlewares/authenticationMiddleware";
import { Router } from "express";
import { AssignIllegalDumpingController } from "./controllers/AssignIllegalDumpingController";
import { ResolvedIllegalDumpingController } from "./controllers/ResolvedIllegalDumpingController";
import { IllegalDumpingController } from "./controllers/IllegalDumpingController";
import { UnassignIllegalDumpingController } from "./controllers/UnassignIllegalDumpingController";
import { ListAllIllegalsDumpingByCompanyController } from "./controllers/ListAllIllegalsDumpingByCompanyController";

const illegalDumpingRoutes = Router({ mergeParams: true });

const assignIllegalDumpingController = new AssignIllegalDumpingController();

const resolvedIllegalDumpingController = new ResolvedIllegalDumpingController();

const illegalDumpingController = new IllegalDumpingController();

const unassignIllegalDumpingController = new UnassignIllegalDumpingController();

const listAllIllegalsDumpingByCompanyController =
  new ListAllIllegalsDumpingByCompanyController();

illegalDumpingRoutes.use(authenticationMiddleware);

illegalDumpingRoutes.get("/", illegalDumpingController.index);

illegalDumpingRoutes.get(
  "/my",
  listAllIllegalsDumpingByCompanyController.handle,
);

illegalDumpingRoutes.get("/:denunciationId", illegalDumpingController.show);
illegalDumpingRoutes.patch(
  "/:denunciationId/assign",
  assignIllegalDumpingController.handle,
);

illegalDumpingRoutes.patch(
  "/:denunciationId/unassign",
  unassignIllegalDumpingController.handle,
);

illegalDumpingRoutes.patch(
  "/:denunciationId/resolved",
  resolvedIllegalDumpingController.handle,
);

export { illegalDumpingRoutes };
