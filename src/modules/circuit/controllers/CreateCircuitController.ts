import { Request, Response } from "express";
import { CircuitsRepository } from "../repositories/CircuitsRepository";
import { CreateCircuitService } from "../services/CreateCircuitService";
import { z } from "zod";
import { Frequency, ServiceType } from "../entities/Circuit";

const createCircuitSchemaValidation = z.object({
  code: z.string(),
  addresses: z.array(z.string()),
  city: z.string(),
  state: z.string(),
  sectors: z.string().optional(),
  frequency: z.array(z.nativeEnum(Frequency)),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  serviceType: z.nativeEnum(ServiceType),
  equipment: z.string().optional(),
  destination: z.string().optional(),
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
