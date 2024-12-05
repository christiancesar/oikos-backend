import { Router } from "express";
import { IllegalDumpingController } from "./controllers/IllegalDumpingController";
import authenticationMiddleware from "@common/middlewares/authenticationMiddleware";
import { AssignIllegalDumpingController } from "./controllers/AssignIllegalDumpingController";
import { ResolvedIllegalDumpingController } from "./controllers/ResolvedIllegalDumpingController";

const illegalDumpingRoutes = Router();

const illegalDumpingController = new IllegalDumpingController();

const assignIllegalDumpingController = new AssignIllegalDumpingController();

const resolvedIllegalDumpingController = new ResolvedIllegalDumpingController();

illegalDumpingRoutes.post("/", illegalDumpingController.create);

illegalDumpingRoutes.use(authenticationMiddleware);

illegalDumpingRoutes.get("/:id", illegalDumpingController.show);
illegalDumpingRoutes.get("/", illegalDumpingController.index);
illegalDumpingRoutes.patch(
  "/:id/assign",
  assignIllegalDumpingController.handle,
);

illegalDumpingRoutes.patch(
  "/:id/resolved",
  resolvedIllegalDumpingController.handle,
);

export { illegalDumpingRoutes };
