import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import { CreateUserService } from "./CreateUserService";
import { BCryptHashProvider } from "@modules/users/provider/BCryptHashProvider";
import { describe, beforeEach, it, expect } from "vitest";
import { AppError } from "@common/errors/AppError";

let repository: UsersRepositoryInMemory;
let provider: BCryptHashProvider;
let service: CreateUserService;

describe("Serviço de criar Usuário", () => {
  beforeEach(() => {
    repository = new UsersRepositoryInMemory();
    provider = new BCryptHashProvider();
    service = new CreateUserService(repository, provider);
  });

  it("Deve ser possível criar um usuário com email e senha enviadas [funcional] [positivo]", async () => {
    const user = await service.execute({
      email: "example@mail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("Não deve ser possível criar um usuário com o mesmo email [funcional] [negativo]", async () => {
    await service.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await expect(
      async () =>
        await service.execute({
          email: "example@mail.com",
          password: "123456",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Foi analisado na criação dos teste que o serviço não validava quando enviava apenas um dos campos vazios
  it("Não deve ser possível criar um usuário enviando apenas password vazio [estrutural] [negativo]", async () => {
    await expect(
      async () =>
        await service.execute({
          email: "example@mail.com",
          password: "",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Foi analisado na criação dos teste que o serviço não validava quando enviava apenas um dos campos vazios
  it("Não deve ser possível criar um usuário enviando apenas email vazio [estrutural] [negativo]", async () => {
    await expect(
      async () =>
        await service.execute({
          email: "",
          password: "password",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Foi analisado na criação dos teste que o serviço não validava o padrão do email
  it("Não deve ser possível criar um usuário enviando email fora do padrao [estrutural] [negativo]", async () => {
    await expect(
      async () =>
        await service.execute({
          email: "email.com",
          password: "password",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
