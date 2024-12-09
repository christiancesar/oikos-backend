import { Router } from "express";
import { CreateCircuitController } from "./controllers/CreateCircuitController";
import { ListCircuitsController } from "./controllers/ListCircuitsController";
import { GetCircuitByAddressController } from "./controllers/GetCircuitByAddressController";

const circuitRoutes = Router();
const createCircuitController = new CreateCircuitController();
const listCircuitsController = new ListCircuitsController();
const getCircuitByAddressController = new GetCircuitByAddressController();

circuitRoutes.post("/", createCircuitController.handle);
circuitRoutes.get("/", listCircuitsController.handle);
circuitRoutes.get("/search", getCircuitByAddressController.handle);

export { circuitRoutes };
