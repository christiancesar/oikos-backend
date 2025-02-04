import "dotenv/config";
import { BCryptHashProvider } from "@modules/users/provider/BCryptHashProvider";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticationService } from "./AuthenticationService";
import { CreateUserService } from "../users/CreateUserService";
import { AppError } from "@common/errors/AppError";

let usersRepository: UsersRepositoryInMemory;
let provider: BCryptHashProvider;
let authenticationService: AuthenticationService;
let createUserServices: CreateUserService;

describe("Serviço de criar Usuário", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    provider = new BCryptHashProvider();
    authenticationService = new AuthenticationService(
      usersRepository,
      provider,
    );
    createUserServices = new CreateUserService(usersRepository, provider);
  });

  it("Deve ser possível se autenticar com um usuario valido [funcional] [positivo]", async () => {
    await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    const auth = await authenticationService.execute({
      email: "example@mail.com",
      password: "123456",
    });

    expect(auth).toHaveProperty("token");
  });

  it("Nao deve ser possível se autenticar com um usuario não cadastrado [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await authenticationService.execute({
          email: "example@mail.com",
          password: "123456",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Nao deve ser possível se autenticar quando informado email incorreto [funcional] [negativo]", async () => {
    await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });
    await expect(
      async () =>
        await authenticationService.execute({
          email: "example2@mail.com",
          password: "123456",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Nao deve ser possível se autenticar quando informado password incorreto [funcional] [negativo]", async () => {
    await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await expect(
      async () =>
        await authenticationService.execute({
          email: "example@mail.com",
          password: "1234567",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
