import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition, DonationStatus } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { CancelDonationService } from "./CancelDonationService";
import { AppError } from "@common/errors/AppError";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let cancelDonationService: CancelDonationService;

describe("Cancelar uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    cancelDonationService = new CancelDonationService(
      donationsRepository,
      usersRepository,
    );
  });

  it("Deve ser possível o usuario cancelar uma doação. [funcional] [positivo]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await donationsRepository.createDonation({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    const assign = await cancelDonationService.execute({
      userId: user1.id,
      reason: "Não quero mais doar",
      donationId: donation.id,
    });

    expect(assign.status).toBe(DonationStatus.CANCELLED);
  });

  it("Não deve ser possível o usuario cancelar uma doação com identificador inexistente. [funcional] [negativa]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    await donationsRepository.createDonation({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(async () => {
      await cancelDonationService.execute({
        userId: user1.id,
        reason: "Não quero mais doar",
        donationId: "non-existent-id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível um usuario não cadastrado cancelar uma doação. [funcional] [negativa]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await donationsRepository.createDonation({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(async () => {
      await cancelDonationService.execute({
        userId: "non-existent-id",
        reason: "Não quero mais doar",
        donationId: donation.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível outro usuario que não criou a doação cancelar a mesma. [funcional] [negativa]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const user2 = await usersRepository.createUser({
      email: "user-two@mail,com",
      password: "123456",
    });

    const donation = await donationsRepository.createDonation({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await expect(async () => {
      await cancelDonationService.execute({
        userId: user2.id,
        reason: "Não quero mais doar",
        donationId: donation.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  // Executando os testes anteriores foi percebido que era possivel cancelar uma doação que já estava cancelada, fechada ou completada.
  it("Não deve ser possível cancelar uma doação que já esta completa, fechada ou cancelada. [estrutural] [negativa]", async () => {
    const user1 = await usersRepository.createUser({
      email: "user-one@mail,com",
      password: "123456",
    });

    const donation = await donationsRepository.createDonation({
      donorId: user1.id,
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    await donationsRepository.markDonationAsCancelled({
      donationId: donation.id,
      reason: "Não quero mais doar",
    });

    await expect(async () => {
      await cancelDonationService.execute({
        userId: user1.id,
        reason: "Não quero mais doar",
        donationId: donation.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
