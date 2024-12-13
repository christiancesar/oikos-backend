import { Router } from "express";
import { storage } from "@common/storages/multer";
import { IllegalDumpingController } from "./controllers/IllegalDumpingController";
import { IllegalDumpingAttachmentsController } from "./controllers/IllegalDumpingAttachmentsController";

const createIllegalDumpingRoutes = Router();

const illegalDumpingController = new IllegalDumpingController();
const illegalDumpingAttachmentsController =
  new IllegalDumpingAttachmentsController();

createIllegalDumpingRoutes.post("/", illegalDumpingController.create);

createIllegalDumpingRoutes.post(
  "/:id/attachments",
  storage.local.array("files"),
  illegalDumpingAttachmentsController.handle,
);

export { createIllegalDumpingRoutes };
