import { Router } from "express";
import { IllegalDumpingController } from "./controllers/IllegalDumpingController";
import authenticationMiddleware from "@common/middlewares/authenticationMiddleware";
import { AssignIllegalDumpingController } from "./controllers/AssignIllegalDumpingController";
import { ResolvedIllegalDumpingController } from "./controllers/ResolvedIllegalDumpingController";
import { storage } from "@common/storages/multer";
import { IllegalDumpingAttachmentsController } from "./controllers/IllegalDumpingAttachmentsController";

const illegalDumpingRoutes = Router();

const illegalDumpingController = new IllegalDumpingController();

const assignIllegalDumpingController = new AssignIllegalDumpingController();

const resolvedIllegalDumpingController = new ResolvedIllegalDumpingController();

const illegalDumpingAttachmentsController =
  new IllegalDumpingAttachmentsController();

illegalDumpingRoutes.post("/", illegalDumpingController.create);

illegalDumpingRoutes.post(
  "/:id/attachments",
  storage.local.array("files"),
  illegalDumpingAttachmentsController.handle,
);

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
