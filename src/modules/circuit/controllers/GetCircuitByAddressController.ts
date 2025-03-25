import { Request, Response } from "express";
import { z } from "zod";
import { GetCircuitByAddressService } from "../services/GetCircuitByAddressService";
import { CircuitsRepository } from "../repositories/CircuitsRepository";

const GetCircuitByAddressQueryParamsSchemaValidation = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
});

export class GetCircuitByAddressController {
  async handle(request: Request, response: Response) {
    const { address, city, state } =
      GetCircuitByAddressQueryParamsSchemaValidation.parse(request.query);
    const circuitsRepository = new CircuitsRepository();
    const getCircuitByAddressService = new GetCircuitByAddressService(
      circuitsRepository,
    );
    const circuit = await getCircuitByAddressService.execute({
      address,
      city,
      state,
    });
    response.json(circuit);
  }
}
