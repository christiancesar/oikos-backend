import { Request, Response } from "express";
import { CircuitsRepository } from "../repositories/CircuitsRepository";
import { ListCircuitsService } from "../services/ListCircuitsService";

export class ListCircuitsController {
  async handle(request: Request, response: Response) {
    const circuitsRepository = new CircuitsRepository();
    const service = new ListCircuitsService(circuitsRepository);
    const circuits = await service.execute();

    response.json(circuits);
  }
}
