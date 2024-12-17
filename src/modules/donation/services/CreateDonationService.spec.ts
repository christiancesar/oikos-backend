import { AppError } from "@common/errors/AppError";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { CreateDonationService } from "./CreateDonationService";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createDonationService: CreateDonationService;
describe("Criar uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createDonationService = new CreateDonationService(
      donationsRepository,
      usersRepository,
    );
  });

  it("Deve ser possível o usuario criar uma doação. [funcional] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await createDonationService.execute({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(donation).toHaveProperty("id");
  });

  it("Não deve ser possível um usuario sem cadastro criar uma doação. [funcional] [negativo]", async () => {
    await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await expect(async () => {
      await createDonationService.execute({
        donorId: "8ec121cb-0bc0-4ad7-9d43-6ebcfab7f482",
        additionalNotes:
          "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
        condition: DonationCondition.USED,
        description:
          "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
        quantity: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Deve ser possível criar uma doação informando as condições uso como nova ou usada. [estrutural] [positivo]", async () => {
    const user = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation1 = await createDonationService.execute({
      donorId: user.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: "USED",
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    const donation2 = await createDonationService.execute({
      donorId: user.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: "NEW",
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(donation1.condition).toBe(DonationCondition.USED);
    expect(donation2.condition).toBe(DonationCondition.NEW);
  });

  it("Não deve ser possível criar uma doação informando as condições uso diferente de nova ou usada. [estrutural] [negativo]", async () => {
    const user = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await expect(async () => {
      await createDonationService.execute({
        donorId: user.id,
        additionalNotes:
          "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
        condition: "other-condition",
        description:
          "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
        quantity: 1,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
