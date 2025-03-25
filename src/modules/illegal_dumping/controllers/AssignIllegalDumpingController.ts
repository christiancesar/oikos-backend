import { Request, Response } from "express";
import { z } from "zod";
import { PriorityIllegalDumping } from "../entities/IllegalDumping";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { AssignIllegalDumpingService } from "../services/companies/AssignIllegalDumpingService";

const requestParamsSchemaValidation = z.object({
  companyId: z.string(),
  denunciationId: z.string(),
});

const AssignIllegalDumpingRequestBodySchemaValidation = z.object({
  priority: z.nativeEnum(PriorityIllegalDumping),
  solveUntil: z
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
    const { companyId, denunciationId } = requestParamsSchemaValidation.parse(
      req.params,
    );
    const { priority, solveUntil } =
      AssignIllegalDumpingRequestBodySchemaValidation.parse(req.body);

    const companiesRepository = new CompaniesRepository();
    const illegalDumpingRepository = new IllegalDumpingRepository();
    const service = new AssignIllegalDumpingService(
      illegalDumpingRepository,
      companiesRepository,
    );

    const illegal = await service.execute({
      denunciationId,
      solverId: companyId,
      priority,
      solveUntil,
    });

    response.json(illegal);
  }
}
