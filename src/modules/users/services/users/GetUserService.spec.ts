import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import { CreateUserService } from "./CreateUserService";
import { BCryptHashProvider } from "@modules/users/provider/BCryptHashProvider";
import { describe, beforeEach, it, expect } from "vitest";
import { AppError } from "@common/errors/AppError";
import { GetUserService } from "./GetUserService";

let repository: UsersRepositoryInMemory;
let provider: BCryptHashProvider;
let createUserService: CreateUserService;
let getUserService: GetUserService;

describe("Serviço de pesquisa de Usuário", () => {
  beforeEach(() => {
    repository = new UsersRepositoryInMemory();
    provider = new BCryptHashProvider();
    createUserService = new CreateUserService(repository, provider);
    getUserService = new GetUserService(repository);
  });

  it("Deve ser possível pesquisar um usuario pelo identificador [funcional] [positivo]", async () => {
    const userCreated = await createUserService.execute({
      email: "example@mail.com",
      password: "123456",
    });

    const user = await getUserService.execute(userCreated.id);

    expect(user).toHaveProperty("id");
  });

  it("Não deve ser possível pesquisar um usuario pelo identificador errado [funcional] [negativo]", async () => {
    await createUserService.execute({
      email: "example@mail.com",
      password: "123456",
    });

    expect(() => getUserService.execute("id")).rejects.toBeInstanceOf(AppError);
  });
});
