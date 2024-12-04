import "dotenv/config";
import { prisma } from "../prisma/index";
import { interceptErrorMiddleware } from "@common/middlewares/interceptErrorMiddleware";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { routes } from "./routes";

const server = express();
server.use(cors());
server.use(express.json());
server.use(routes);
server.use(interceptErrorMiddleware);

async function main() {
  await prisma.$connect();
  server.listen(process.env.PORT, () => {
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
