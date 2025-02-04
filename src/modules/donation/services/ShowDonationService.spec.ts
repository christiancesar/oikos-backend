import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { CreateDonationService } from "./CreateDonationService";
import { ShowDonationService } from "./ShowDonationService";
import { AppError } from "@common/errors/AppError";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let createDonationService: CreateDonationService;
let showDonationService: ShowDonationService;

describe("Monstrar uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    createDonationService = new CreateDonationService(
      donationsRepository,
      usersRepository,
    );
    showDonationService = new ShowDonationService(donationsRepository);
  });

  it("Deve ser possível o usuario listar uma doação pelo identificador. [funcional] [positivo]", async () => {
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

    const showDonation = await showDonationService.execute(donation.id);

    expect(showDonation).toHaveProperty("id");
  });

  it("Não deve ser possível o usuario listar uma doação com um indentificador não cadastrado. [funcional] [positivo]", async () => {
    const user = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await createDonationService.execute({
      donorId: user.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(
      async () => await showDonationService.execute("non-existing-id"),
    ).rejects.toBeInstanceOf(AppError);
  });
});
