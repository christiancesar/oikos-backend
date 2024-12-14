import { AppError } from "@common/errors/AppError";
import { BCryptHashProvider } from "@modules/users/provider/BCryptHashProvider";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import { CreateUserService } from "@modules/users/services/users/CreateUserService";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { ProfileRepositoryInMemory } from "../repositories/inMemory/ProfileRepositoryInMemory";
import { CreateOrUpdateProfileService } from "./CreateOrUpdateProfileService";
import { makeProfile } from "../tests/factories/makeProfile";
import { makeAddress } from "../tests/factories/makeAddress";

let usersRepository: UsersRepositoryInMemory;
let profileRepository: ProfileRepositoryInMemory;
let createOrUpdateProfileService: CreateOrUpdateProfileService;
let createUserServices: CreateUserService;

describe("Criar ou Atualizar um perfil", () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    profileRepository = new ProfileRepositoryInMemory();
    createOrUpdateProfileService = new CreateOrUpdateProfileService(
      profileRepository,
      usersRepository,
    );
    createUserServices = new CreateUserService(
      usersRepository,
      new BCryptHashProvider(),
    );
  });

  it("Deve ser possível criar um perfil [funcional] [positivo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    const profile = await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile(),
      address: makeAddress(),
    });

    expect(profile).toHaveProperty("id");
  });

  it("Não deve ser possível criar um perfil sem um usuario cadastrado [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await createOrUpdateProfileService.execute({
          userId: "invalid-user-id",
          ...makeProfile(),
          address: makeAddress(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível atualizar um perfil existente[funcional] [positivo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile(),
      address: makeAddress(),
    });

    const profile = await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile({
        firstName: "new first name",
      }),
      address: makeAddress(),
    });

    expect(profile).toEqual(
      expect.objectContaining({ firstName: "new first name" }),
    );
  });

  it("Não deve ser possível atualizar um perfil sem um usuario cadastrado [funcional] [negativo]", async () => {
    await expect(
      async () =>
        await createOrUpdateProfileService.execute({
          userId: "invalid-user-id",
          ...makeProfile(),
          address: makeAddress(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Apos rodar os testes acima, foi analisado que era possivel criar um perfil passando cpf e telefone vazio, com isto foi feito uma validação

  it("Deve ser possível criar um perfil com um cpf com caracter especiais [estrutural] [positivo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    const profile = await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile({
        cpf: "123.456.789-01",
      }),
      address: makeAddress(),
    });

    expect(profile).toHaveProperty("id");
  });

  it("Não deve ser possível criar um perfil com um cpf diferente de 11 digitos [estrutural] [negativo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await expect(
      async () =>
        await createOrUpdateProfileService.execute({
          userId: user.id,
          ...makeProfile({
            cpf: "123.456.789",
          }),
          address: makeAddress(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível criar um perfil com um cpf diferente de 11 digitos [estrutural] [negativo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await expect(
      async () =>
        await createOrUpdateProfileService.execute({
          userId: user.id,
          ...makeProfile({
            cpf: "123.456.789",
          }),
          address: makeAddress(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível criar um perfil com um tefole diferente valido [estrutural] [negativo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });
    const profile = await createOrUpdateProfileService.execute({
      userId: user.id,
      ...makeProfile({
        phone: "99 9 9999-9999",
      }),
      address: makeAddress(),
    });

    expect(profile).toHaveProperty("id");
  });

  it("Não deve ser possível criar um perfil com um tefole diferente de 11 digitos [estrutural] [positivo]", async () => {
    const user = await createUserServices.execute({
      email: "example@mail.com",
      password: "123456",
    });

    await expect(
      async () =>
        await createOrUpdateProfileService.execute({
          userId: user.id,
          ...makeProfile({
            phone: "123.456.789111111",
          }),
          address: makeAddress(),
        }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
