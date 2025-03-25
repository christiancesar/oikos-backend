import { Request, Response } from "express";
import { z } from "zod";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { StatusIllegalDumping } from "../entities/IllegalDumping";
import { ShowIllegalDumpingService } from "../services/companies/ShowIllegalDumpingService";
import { CreateIllegalDumpingService } from "../services/CreateIllegalDumpingService";
import { ListAllIllegalDumpingService } from "../services/companies/ListAllIllegalDumpingService";

const CreateIllegalDumpingRequestBodySchemaValidation = z.object({
  description: z.string().min(10),
  longitude: z.number(),
  latitude: z.number(),
});

const serachIllegalDumpingQuerySchemaValidation = z.object({
  status: z.nativeEnum(StatusIllegalDumping).optional(),
});

const requestParamsSchemaValidation = z.object({
  denunciationId: z.string().uuid(),
});
export class IllegalDumpingController {
  async create(request: Request, response: Response) {
    const { description, latitude, longitude } =
      CreateIllegalDumpingRequestBodySchemaValidation.parse(request.body);

    const repository = new IllegalDumpingRepository();
    const service = new CreateIllegalDumpingService(repository);

    const illegal = await service.execute({
      description,
      latitude,
      longitude,
    });

    response.status(201).json(illegal);
  }

  async show(req: Request, response: Response) {
    const { denunciationId } = requestParamsSchemaValidation.parse(req.params);

    const repository = new IllegalDumpingRepository();
    const service = new ShowIllegalDumpingService(repository);
    const illegal = await service.execute(denunciationId);

    response.json(illegal);
  }

  async index(request: Request, response: Response) {
    const repository = new IllegalDumpingRepository();
    const { status } = serachIllegalDumpingQuerySchemaValidation.parse(
      request.query,
    );
    const service = new ListAllIllegalDumpingService(repository);
    const illegals = await service.execute({ status });

    response.json(illegals);
  }
}
