import "dotenv/config";
import path from "path";
import express from "express";
import "express-async-errors";
import { enviroment } from "@common/env/env";
import cors from "cors";
import { interceptErrorMiddleware } from "@common/middlewares/interceptErrorMiddleware";
import { prisma } from "../prisma/index";
import { routes } from "./routes";

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(routes);
server.use(interceptErrorMiddleware);
server.use(
  "/storage",
  express.static(path.resolve(__dirname, "..", "uploads")),
);

async function main() {
  await prisma.$connect();
  server.listen(enviroment.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
