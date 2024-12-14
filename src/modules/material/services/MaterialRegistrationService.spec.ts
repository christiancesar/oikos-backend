import { AppError } from "@common/errors/AppError";
import { Optional } from "@common/Optional";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { MaterialEntity } from "../entities/MaterialRegistration";
import { MaterialsRepositoryInMemory } from "../repositories/inMemory/MaterialsRepositoryInMemory";
import { MaterialService } from "./MaterialRegistrationService";

let materialsRepository: MaterialsRepositoryInMemory;
let service: MaterialService;

function makeMaterial(material?: Optional<MaterialEntity>): MaterialEntity {
  return new MaterialEntity({
    name: material?.name ? material?.name : "Garrafa PET de água",
    category: material?.category ? material?.category : "plásticos, PET",
    createdAt: new Date(),
  });
}

describe("Criar materiais, residuos solidos, descartes", () => {
  beforeEach(() => {
    materialsRepository = new MaterialsRepositoryInMemory();
    service = new MaterialService(materialsRepository);
  });

  it("Deve ser possível criar um material [funcional] [positivo]", async () => {
    const material = await service.create(makeMaterial());

    expect(material).toHaveProperty("id");
  });

  // Apos rodar o primeiro teste, foi possivel notar que era possivel criar um material enviando o nome e a categoria vazias, foi necessario adicionar uma validação para que o nome e a categoria fossem obrigatorios.
  it("Não deve ser possível criar um material com nome vazio [estrutural] [negativo]", async () => {
    await expect(
      async () =>
        await service.create({
          category: "material-category",
          name: "",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível criar um material com categoria vazia [estrutural] [negativo]", async () => {
    await expect(
      async () =>
        await service.create({
          category: "",
          name: "material-name",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível listar materiais [funcional] [positivo]", async () => {
    await service.create(makeMaterial());
    await service.create(makeMaterial());
    await service.create(makeMaterial());
    const materials = await service.findAll();
    expect(materials).toHaveLength(3);
  });

  it("Deve ser possível pesquisar material pelo identificador [funcional] [positivo]", async () => {
    const materialCreated = await service.create(makeMaterial());

    const material = await service.findById(materialCreated.id);
    expect(material).toEqual(
      expect.objectContaining({ id: materialCreated.id }),
    );
  });

  it("Não deve ser possível pesquisar material pelo identificador errado [funcional] [negativo]", async () => {
    await expect(
      async () => await service.findById("material-id"),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível alterar material pelo identificador [funcional] [positivo]", async () => {
    const materialCreated = await service.create(makeMaterial());

    const material = await service.update(materialCreated.id, {
      category: "material-category",
      name: "material-name",
    });

    expect(material).toEqual(
      expect.objectContaining({
        category: "material-category",
        name: "material-name",
      }),
    );
  });

  it("Nao deve ser possível alterar material pelo identificador errado [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await service.update("material-id", {
          category: "material-category",
          name: "material-name",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível deletar material pelo identificador [funcional] [positivo]", async () => {
    const materialCreated = await service.create(makeMaterial());

    await service.delete(materialCreated.id);

    expect(await service.findAll()).toHaveLength(0);
  });

  it("Não deve ser possível deletar material pelo identificador errado [funcional] [negativo]", async () => {
    await service.create(makeMaterial());
    await service.create(makeMaterial());

    await expect(
      async () => await service.delete("material-id"),
    ).rejects.toBeInstanceOf(AppError);

    expect(await service.findAll()).toHaveLength(2);
  });
});
