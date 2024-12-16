import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { randomUUID } from "node:crypto";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { AssignIllegalDumpingService } from "./AssignIllegalDumpingService";
import { Solver } from "@modules/illegal_dumping/entities/IllegalDumping";
import { AppError } from "@common/errors/AppError";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let assignIllegalDumpingService: AssignIllegalDumpingService;

describe("Atribuir uma denuncia a uma empresa", () => {
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

  it("Deve ser possivel uma empresa atribuir uma denuncia a ela [funcional] [positivo]", async () => {
    const illegal = await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

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

    expect(assignment.solver).toBeInstanceOf(Solver);
    expect(assignment.solver?.company?.id).toBe(company.id);
  });

  it("Não deve ser possivel uma empresa atribuir a uma denuncia com identificador da denuncia invalido [funcional] [negativo]", async () => {
    await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

    const userId = randomUUID();

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    expect(async () => {
      await assignIllegalDumpingService.execute({
        denunciationId: "invalid-id",
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa atribuir a uma denuncia com identificador da empresa invalido [funcional] [negativo]", async () => {
    const illegal = await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

    expect(async () => {
      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: "invalid-id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa atribuir a uma denuncia que o status seja diferente de open [funcional] [negativo]", async () => {
    const illegal = await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

    const userId = randomUUID();

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    await assignIllegalDumpingService.execute({
      denunciationId: illegal.id,
      priority: "high",
      solveUntil: new Date(Date.now() + 1),
      solverId: company.id,
    });

    expect(async () => {
      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
