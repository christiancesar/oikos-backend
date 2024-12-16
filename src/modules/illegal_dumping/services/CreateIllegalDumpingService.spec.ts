import { AppError } from "@common/errors/AppError";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { IllegalDumpingRepositoryInMemory } from "../repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { CreateIllegalDumpingService } from "./CreateIllegalDumpingService";
import { makeIllegalDumping } from "../factories/makeIllegalDumping";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let service: CreateIllegalDumpingService;

describe("Criar materiais, residuos solidos, descartes", () => {
  beforeEach(() => {
    illegalRepository = new IllegalDumpingRepositoryInMemory();
    service = new CreateIllegalDumpingService(illegalRepository);
  });

  it("Deve ser possível criar uma denuncia de descarte [funcional] [positivo]", async () => {
    const illegal = await service.execute(makeIllegalDumping());

    expect(illegal).toHaveProperty("id");
    expect(illegal).toHaveProperty("shortId");
  });

  it("Nao deve ser possível criar uma denuncia de descarte com descrição vazia [funcional] [positivo]", async () => {
    expect(
      async () =>
        await service.execute({
          description: "",
          latitude: 0,
          longitude: 0,
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
