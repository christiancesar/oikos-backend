import { randomUUID } from "crypto";
import multer from "multer";
import path from "path";

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

export const storage = {
  local: multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, "..", "..", "..", "uploads/"));
      },
      filename: function (req, file, cb) {
        cb(null, `${randomUUID()}-${file.originalname}`);
      },
    }),
    limits: {
      fieldSize: MAX_SIZE_TWO_MEGABYTES,
      files: 5,
    },
  }),
};
