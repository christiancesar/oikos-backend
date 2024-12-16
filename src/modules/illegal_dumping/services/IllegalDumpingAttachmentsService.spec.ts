import { AppError } from "@common/errors/AppError";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { makeIllegalDumping } from "../factories/makeIllegalDumping";
import { IllegalDumpingRepositoryInMemory } from "../repositories/inMemory/IllegalDumpingRepositoryInMemory";
import { CreateIllegalDumpingService } from "./CreateIllegalDumpingService";
import { IllegalDumpingAttachmentsService } from "./IllegalDumpingAttachmentsService";

let illegalRepository: IllegalDumpingRepositoryInMemory;
let IllegalService: CreateIllegalDumpingService;
let attachmentsService: IllegalDumpingAttachmentsService;

describe("Atribui anexos a denuncia", () => {
  beforeEach(() => {
    illegalRepository = new IllegalDumpingRepositoryInMemory();
    IllegalService = new CreateIllegalDumpingService(illegalRepository);
    attachmentsService = new IllegalDumpingAttachmentsService(
      illegalRepository,
    );
  });

  it("Deve ser possível criar anexar imagem a uma denuncia de descarte [funcional] [positivo]", async () => {
    const illegal = await IllegalService.execute(makeIllegalDumping());

    const illegalWithAttachments = await attachmentsService.execute({
      denuciationId: illegal.id,
      files: ["file1.jpg", "file2.jpg"],
    });

    expect(illegalWithAttachments.attachments).toContain(
      "http://localhost:3333/storage/file1.jpg",
    );
    expect(illegalWithAttachments.attachments).toContain(
      "http://localhost:3333/storage/file2.jpg",
    );

    expect(illegalWithAttachments.attachments).toHaveLength(2);
  });

  it("Nao deve ser possível anexar imagem a uma denuncia de descarte com identificardor invalido  [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await attachmentsService.execute({
          denuciationId: "invalid_id",
          files: ["file1.jpg", "file2.jpg"],
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Nao deve ser possível anexar imagem a uma denuncia de descarte com files sendo um array vazio [funcional] [negativo]", async () => {
    const illegal = await IllegalService.execute(makeIllegalDumping());

    await expect(
      async () =>
        await attachmentsService.execute({
          denuciationId: illegal.id,
          files: [],
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Apos execução dos testes foi identificado que era possivel fazer upload de imagens com nome vazio
  it("Nao deve ser possível anexar imagem a uma denuncia de descarte com conteudo de files estando vazio [estrutural] [negativo]", async () => {
    const illegal = await IllegalService.execute(makeIllegalDumping());

    await expect(
      async () =>
        await attachmentsService.execute({
          denuciationId: illegal.id,
          files: ["", ""],
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
