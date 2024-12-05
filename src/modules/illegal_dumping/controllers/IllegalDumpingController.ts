import { Request, Response } from "express";
import * as zod from "zod";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { IllegalDumpingService } from "../services/IllegalDumpingService";

const CreateIllegalDumpingRequestBodySchemaValidation = zod.object({
  description: zod.string().min(10),
  longitude: zod.number(),
  latitude: zod.number(),
});

export class IllegalDumpingController {
  async create(req: Request, response: Response) {
    const { description, latitude, longitude } =
      CreateIllegalDumpingRequestBodySchemaValidation.parse(req.body);

    const repository = new IllegalDumpingRepository();
    const service = new IllegalDumpingService(repository);

    const illegal = await service.create({
      description,
      latitude,
      longitude,
    });

    response.status(201).json(illegal);
  }

  async show(req: Request, response: Response) {
    const { id } = req.params;

    const repository = new IllegalDumpingRepository();
    const service = new IllegalDumpingService(repository);
    const illegal = await service.show(id);

    response.json(illegal);
  }

  async index(req: Request, response: Response) {
    const repository = new IllegalDumpingRepository();
    const service = new IllegalDumpingService(repository);
    const illegals = await service.list();

    response.json(illegals);
  }
}
