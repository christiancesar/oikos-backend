import { Request, Response } from "express";
import { CircuitsRepository } from "../repositories/CircuitsRepository";
import { CreateCircuitService } from "../services/CreateCircuitService";
import * as zod from "zod";
import { Frequency, ServiceType } from "../entities/Circuit";

const createCircuitSchemaValidation = zod.object({
  code: zod.string(),
  addresses: zod.array(zod.string()),
  city: zod.string(),
  state: zod.string(),
  sectors: zod.string().optional(),
  frequency: zod.array(zod.nativeEnum(Frequency)),
  startTime: zod.string().optional(),
  endTime: zod.string().optional(),
  serviceType: zod.nativeEnum(ServiceType),
  equipment: zod.string().optional(),
  destination: zod.string().optional(),
});

export class CreateCircuitController {
  async handle(request: Request, response: Response) {
    const circuit = createCircuitSchemaValidation.parse(request.body);
    const circuitsRepository = new CircuitsRepository();
    const service = new CreateCircuitService(circuitsRepository);
    const circuitNew = await service.execute(circuit);

    response.json(circuitNew);
  }
}
