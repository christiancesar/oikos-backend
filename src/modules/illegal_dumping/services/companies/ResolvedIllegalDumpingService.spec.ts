import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { randomUUID } from "node:crypto";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { AssignIllegalDumpingService } from "./AssignIllegalDumpingService";
import {
  Solver,
  StatusIllegalDumping,
} from "@modules/illegal_dumping/entities/IllegalDumping";
import { AppError } from "@common/errors/AppError";
import { ResolvedIllegalDumpingService } from "./ResolvedIllegalDumpingService";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let assignIllegalDumpingService: AssignIllegalDumpingService;
let resolvedIllegalDumpingService: ResolvedIllegalDumpingService;

describe("Marcar uma denuncia como resolvida", () => {
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
    resolvedIllegalDumpingService = new ResolvedIllegalDumpingService(
      illegalRepository,
      companiesRepository,
    );
  });

  it("Deve ser possivel uma empresa resolver a denuncia atribuida a ela [funcional] [positivo]", async () => {
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

    const assignment = await resolvedIllegalDumpingService.execute({
      id: illegal.id,
      description: "Denuncia resolvida",
      solverId: company.id,
    });

    expect(assignment.solver).toBeInstanceOf(Solver);
    expect(assignment.status).toEqual(StatusIllegalDumping.RESOLVED);
  });

  it("Não deve ser possivel uma empresa resolver uma denuncia de outra empresa [funcional] [negativa]", async () => {
    const illegal = await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

    const userId = randomUUID();

    const company1 = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    await assignIllegalDumpingService.execute({
      denunciationId: illegal.id,
      priority: "high",
      solveUntil: new Date(Date.now() + 1),
      solverId: company1.id,
    });

    const company2 = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    await expect(async () => {
      await resolvedIllegalDumpingService.execute({
        id: illegal.id,
        description: "Denuncia resolvida",
        solverId: company2.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa resolver uma denuncia, caso o identificador da empresa seja invalido [funcional] [negativa]", async () => {
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

    await expect(async () => {
      await resolvedIllegalDumpingService.execute({
        id: illegal.id,
        description: "Denuncia resolvida",
        solverId: "invalid-id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa resolver uma denuncia, caso o identificador da denuncia seja invalido [funcional] [negativa]", async () => {
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

    await expect(async () => {
      await resolvedIllegalDumpingService.execute({
        id: "invalid-id",
        description: "Denuncia resolvida",
        solverId: company.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
