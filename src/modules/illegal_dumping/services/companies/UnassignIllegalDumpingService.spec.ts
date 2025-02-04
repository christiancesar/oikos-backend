import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { AppError } from "@common/errors/AppError";
import { makeCompany } from "@modules/companies/factories/makeCompany";
import { CompaniesRepositoryInMemory } from "@modules/companies/repositories/inMemory/CompaniesRepositoryInMemory";
import { StatusIllegalDumping } from "@modules/illegal_dumping/entities/IllegalDumping";
import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { randomUUID } from "node:crypto";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { AssignIllegalDumpingService } from "./AssignIllegalDumpingService";
import { ResolvedIllegalDumpingService } from "./ResolvedIllegalDumpingService";
import { UnassignIllegalDumpingService } from "./UnassignIllegalDumpingService";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let assignIllegalDumpingService: AssignIllegalDumpingService;
let unassignIllegalDumpingService: UnassignIllegalDumpingService;
let resolvedIllegalDumpingService: ResolvedIllegalDumpingService;

describe("Desatribuir uma denuncia a uma empresa", () => {
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
    unassignIllegalDumpingService = new UnassignIllegalDumpingService(
      illegalRepository,
      companiesRepository,
    );
    resolvedIllegalDumpingService = new ResolvedIllegalDumpingService(
      illegalRepository,
      companiesRepository,
    );
  });

  it("Deve ser possivel uma empresa desatribuir uma denuncia a ela mesma. [funcional] [positivo]", async () => {
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

    const assignment = await unassignIllegalDumpingService.execute({
      denunciationId: illegal.id,
      solverId: company.id,
    });

    expect(assignment.solver).toBe(null);
    expect(assignment.status).toBe(StatusIllegalDumping.OPEN);
  });

  it("Não deve ser possivel uma empresa desatribuir uma denuncia caso o status dela seja diferente de atribuido. [funcional] [negativo]", async () => {
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

    await resolvedIllegalDumpingService.execute({
      description: "Denuncia resolvida",
      id: illegal.id,
      solverId: company.id,
    });

    await await expect(
      async () =>
        await unassignIllegalDumpingService.execute({
          denunciationId: illegal.id,
          solverId: company.id,
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa desatribuir uma denuncia caso a identificar da empresa não existir. [funcional] [negativo]", async () => {
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

    await expect(
      async () =>
        await unassignIllegalDumpingService.execute({
          denunciationId: illegal.id,
          solverId: randomUUID(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa desatribuir uma denuncia caso a identificar da da denuncia não existir. [funcional] [negativo]", async () => {
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

    await expect(
      async () =>
        await unassignIllegalDumpingService.execute({
          denunciationId: randomUUID(),
          solverId: company.id,
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possivel uma empresa desatribuir uma denuncia de outra empresa. [funcional] [negativo]", async () => {
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

    const company2 = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    await expect(
      async () =>
        await unassignIllegalDumpingService.execute({
          denunciationId: illegal.id,
          solverId: company2.id,
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
