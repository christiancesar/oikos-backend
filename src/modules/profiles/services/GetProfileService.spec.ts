import { BCryptHashProvider } from "@modules/users/provider/BCryptHashProvider";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import { CreateUserService } from "@modules/users/services/users/CreateUserService";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { ProfileRepositoryInMemory } from "../repositories/inMemory/ProfileRepositoryInMemory";
import { CreateOrUpdateProfileService } from "./CreateOrUpdateProfileService";
import { AppError } from "@common/errors/AppError";
import { GetProfileService } from "./GetProfileService";
import { makeProfile } from "../tests/factories/makeProfile";
import { makeAddress } from "@modules/addresses/factories/makeAddress";

let usersRepository: UsersRepositoryInMemory;
let profileRepository: ProfileRepositoryInMemory;
let getProfileService: GetProfileService;
let createUserServices: CreateUserService;
let createOrUpdateProfileService: CreateOrUpdateProfileService;

describe("Criar ou Atualizar um perfil", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    profileRepository = new ProfileRepositoryInMemory();
    getProfileService = new GetProfileService(profileRepository);
    createOrUpdateProfileService = new CreateOrUpdateProfileService(
      profileRepository,
      usersRepository,
    );
    createUserServices = new CreateUserService(
      usersRepository,
      new BCryptHashProvider(),
    );
  });

  it("Deve ser possível pesquisar um perfil pelo identificar do usuario [funcional] [positivo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile(),
      address: makeAddress(),
    });

    const profileFinded = await getProfileService.execute({
      userId: user.id,
    });

    expect(profileFinded).toHaveProperty("id");
  });

  it("Não deve ser possível criar um perfil sem um usuario cadastrado [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await getProfileService.execute({
          userId: "invalid-user-id",
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
