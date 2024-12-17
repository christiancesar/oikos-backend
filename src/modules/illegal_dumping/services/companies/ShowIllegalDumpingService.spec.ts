import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";

import { IllegalDumpingRepositoryInMemory } from "@modules/illegal_dumping/repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { CreateIllegalDumpingService } from "../CreateIllegalDumpingService";
import { ShowIllegalDumpingService } from "./ShowIllegalDumpingService";
import { AppError } from "@common/errors/AppError";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let createIllegalDumpingService: CreateIllegalDumpingService;
let showIllegalDumpingService: ShowIllegalDumpingService;

describe("Mostrar uma denuncia especifica", () => {
  beforeEach(() => {
    illegalRepository = new IllegalDumpingRepositoryInMemory();
    createIllegalDumpingService = new CreateIllegalDumpingService(
      illegalRepository,
    );
    showIllegalDumpingService = new ShowIllegalDumpingService(
      illegalRepository,
    );
  });

  it("Deve ser possivel pesquisar uma denuncia pelo identificador [funcional] [positivo]", async () => {
    const illegal = await createIllegalDumpingService.execute({
      description: "Denuncia Teste",
      latitude: 0,
      longitude: 0,
    });

    const illegalDumping = await showIllegalDumpingService.execute(illegal.id);
    expect(illegalDumping).toHaveProperty("id");
  });

  it("Não deve ser possivel pesquisar uma denuncia pelo identificador invalido[funcional] [negativa]", async () => {
    await expect(async () => {
      await showIllegalDumpingService.execute("invalid_id");
    }).rejects.toBeInstanceOf(AppError);
  });
});
