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
import { ListAllIllegalsDumpingByCompanyService } from "./ListAllIllegalsDumpingByCompanyService";
import { ResolvedIllegalDumpingService } from "./ResolvedIllegalDumpingService";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let companiesRepository: CompaniesRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let assignIllegalDumpingService: AssignIllegalDumpingService;
let resolvedIllegalDumpingService: ResolvedIllegalDumpingService;
let listAllIllegalsDumpingByCompanyService: ListAllIllegalsDumpingByCompanyService;

describe("Listar todas as denuncias atribuidas a uma empresa", () => {
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
    listAllIllegalsDumpingByCompanyService =
      new ListAllIllegalsDumpingByCompanyService(
        illegalRepository,
        companiesRepository,
      );
  });

  it("Deve ser possivel uma empresa listar apenas as denuncias atribuidas a ela. [funcional] [positivo]", async () => {
    const userId = randomUUID();
    await createIllegalDumpingService.execute({
      description: `Denuncia Test`,
      latitude: 0,
      longitude: 0,
    });

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    for (let i = 0; i < 5; i++) {
      const illegal = await createIllegalDumpingService.execute({
        description: `Denuncia Test ${i}`,
        latitude: 0,
        longitude: 0,
      });

      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });
    }

    expect(
      listAllIllegalsDumpingByCompanyService.execute({ companyId: company.id }),
    ).resolves.toHaveLength(5);
  });

  it("Deve ser possivel uma empresa listar apenas as denuncias atribuidas a ela por um status epecifico. [funcional] [positivo]", async () => {
    const userId = randomUUID();
    await createIllegalDumpingService.execute({
      description: `Denuncia Test`,
      latitude: 0,
      longitude: 0,
    });

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    for (let i = 0; i < 5; i++) {
      const illegal = await createIllegalDumpingService.execute({
        description: `Denuncia Test ${i}`,
        latitude: 0,
        longitude: 0,
      });

      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });

      if (i > 2) {
        await resolvedIllegalDumpingService.execute({
          id: illegal.id,
          solverId: company.id,
          description: "Resolvido",
        });
      }
    }

    expect(
      listAllIllegalsDumpingByCompanyService.execute({
        companyId: company.id,
        status: StatusIllegalDumping.RESOLVED,
      }),
    ).resolves.toHaveLength(2);
  });

  it("Não deve ser possivel uma empresa listar as denuncias atribuidas a ela, caso o identificador da empresa não existir. [funcional] [positivo]", async () => {
    const userId = randomUUID();
    await createIllegalDumpingService.execute({
      description: `Denuncia Test`,
      latitude: 0,
      longitude: 0,
    });

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    for (let i = 0; i < 5; i++) {
      const illegal = await createIllegalDumpingService.execute({
        description: `Denuncia Test ${i}`,
        latitude: 0,
        longitude: 0,
      });

      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });

      if (i > 2) {
        await resolvedIllegalDumpingService.execute({
          id: illegal.id,
          solverId: company.id,
          description: "Resolvido",
        });
      }
    }

    await expect(async () => {
      await listAllIllegalsDumpingByCompanyService.execute({
        companyId: randomUUID(),
        status: StatusIllegalDumping.RESOLVED,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  // Apos rodar todos os teste foi possivel observar que não passou por uma conferencia se o status era vazio
  it("Deve ser possivel uma empresa listar as denuncias caso informar status como vazio. [estrutural] [positivo]", async () => {
    const userId = randomUUID();
    await createIllegalDumpingService.execute({
      description: `Denuncia Test`,
      latitude: 0,
      longitude: 0,
    });

    const company = await companiesRepository.createCompany({
      userId,
      company: { ...makeCompany() },
    });

    for (let i = 0; i < 5; i++) {
      const illegal = await createIllegalDumpingService.execute({
        description: `Denuncia Test ${i}`,
        latitude: 0,
        longitude: 0,
      });

      await assignIllegalDumpingService.execute({
        denunciationId: illegal.id,
        priority: "high",
        solveUntil: new Date(Date.now() + 1),
        solverId: company.id,
      });

      if (i > 2) {
        await resolvedIllegalDumpingService.execute({
          id: illegal.id,
          solverId: company.id,
          description: "Resolvido",
        });
      }
    }

    expect(
      listAllIllegalsDumpingByCompanyService.execute({
        companyId: company.id,
        status: "",
      }),
    ).resolves.toHaveLength(5);
  });
});
