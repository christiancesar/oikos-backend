import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { ListAllIllegalDumpingService } from "./ListAllIllegalDumpingService";
import { AppError } from "@common/errors/AppError";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let listAllIllegalDumpingService: ListAllIllegalDumpingService;

describe("Lista denuncias", () => {
  beforeEach(() => {
    illegalRepository = new IllegalDumpingRepositoryInMemory();
    createIllegalDumpingService = new CreateIllegalDumpingService(
      illegalRepository,
    );
    listAllIllegalDumpingService = new ListAllIllegalDumpingService(
      illegalRepository,
    );
  });

  it("Deve ser possivel listar denuncias ao enviar status como vazio [funcional] [positivo]", async () => {
    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    expect(
      await listAllIllegalDumpingService.execute({
        status: "",
      }),
    ).toHaveLength(3);
  });

  it("Deve ser possivel listar denuncias com status como aberto [funcional] [positivo]", async () => {
    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    expect(
      await listAllIllegalDumpingService.execute({
        status: "OPEN",
      }),
    ).toHaveLength(3);
  });

  it("Não deve ser possivel listar denuncias com status invalido [funcional] [negativo]", async () => {
    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await createIllegalDumpingService.execute({
      description: "Denuncia Teste 1",
      latitude: 0,
      longitude: 0,
    });

    await expect(
      async () =>
        await listAllIllegalDumpingService.execute({
          status: "status-invalido",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
