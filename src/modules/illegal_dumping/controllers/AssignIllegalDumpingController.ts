import { Request, Response } from "express";
import * as zod from "zod";
import { PriorityIllegalDumping } from "../entities/IllegalDumping";
import { AssignIllegalDumpingService } from "../services/AssignIllegalDumpingService";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";

const AssignIllegalDumpingRequestBodySchemaValidation = zod.object({
  solverId: zod.string().uuid(),
  priority: zod.nativeEnum(PriorityIllegalDumping),
  solveUntil: zod
    .string()
    .transform((value) => new Date(value))
    .refine((date) => !isNaN(date.getTime()), { message: "Data inválida" })
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "A data não pode estar no passado" },
    ),
});

export class AssignIllegalDumpingController {
  async handle(req: Request, response: Response) {
    const { id } = req.params;
    const { priority, solveUntil, solverId } =
      AssignIllegalDumpingRequestBodySchemaValidation.parse(req.body);

    const companiesRepository = new CompaniesRepository();
    const illegalDumpingRepository = new IllegalDumpingRepository();
    const service = new AssignIllegalDumpingService(
      illegalDumpingRepository,
      companiesRepository,
    );

    const illegal = await service.execute({
      id,
      solverId,
      priority,
      solveUntil,
    });

    response.json(illegal);
  }
}
