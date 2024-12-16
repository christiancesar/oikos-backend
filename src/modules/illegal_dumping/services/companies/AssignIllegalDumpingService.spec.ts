import { AppError } from "@common/errors/AppError";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { makeIllegalDumping } from "@modules/illegal_dumping/factories/makeIllegalDumping";
import { randomUUID } from "node:crypto";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { AssignIllegalDumpingService } from "./AssignIllegalDumpingService";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let assignIllegalDumpingService: AssignIllegalDumpingService;

describe("Criar materiais, residuos solidos, descartes", () => {
  beforeEach(() => {
    companiesRepository = new CompaniesRepositoryInMemory();
    illegalRepository = new IllegalDumpingRepositoryInMemory();
    createIllegalDumpingService = new CreateIllegalDumpingService(
      illegalRepository,
    );
    assignIllegalDumpingService = new AssignIllegalDumpingService(
      illegalRepository,
      companiesRepository,
    );
  });

  it.skip("Deve ser possível criar uma denuncia de descarte [funcional] [positivo]", async () => {
    const illegal =
      await createIllegalDumpingService.execute(makeIllegalDumping());

    console.log(illegal);

    const userId = randomUUID();

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    const assignment = await assignIllegalDumpingService.execute({
      denunciationId: illegal.id,
      priority: "high",
      solveUntil: new Date(Date.now() + 1),
      solverId: company.id,
    });

    expect(assignment).toHaveProperty("id");
  });

  // it.skip("Nao deve ser possível criar uma denuncia de descarte com descrição vazia [funcional] [positivo]", async () => {
  //   expect(
  //     async () =>
  //       await service.execute({
  //         description: "",
  //         latitude: 0,
  //         longitude: 0,
  //       }),
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
