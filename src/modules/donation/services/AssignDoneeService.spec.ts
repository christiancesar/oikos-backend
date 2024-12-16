import { AppError } from "@common/errors/AppError";
import { UsersRepositoryInMemory } from "@modules/users/repositories/inMemory/UsersRepositoryInMemory";
import "dotenv/config";
import { beforeEach, describe, expect, it } from "vitest";
import { DonationCondition } from "../entities/Donation";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { AssignDoneeService } from "./AssignDoneeService";

let donationsRepository: DonationsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let assignDoneeService: AssignDoneeService;

describe("Atribui interesse a uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    assignDoneeService = new AssignDoneeService(
      donationsRepository,
      usersRepository,
    );
  });

  it("Deve ser possível atribuir interesse em uma doação. [funcional] [positivo]", async () => {
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

    const assign = await assignDoneeService.execute({
      donationId: donation.id,
      doneeId: user2.id,
    });

    expect(assign.doneeId).toStrictEqual(expect.any(String));
  });

  it("Não deve ser possível o doardor mostrar interesse na própria doação [funcional] [negativo]", async () => {
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

    expect(async () => {
      await assignDoneeService.execute({
        donationId: donation.id,
        doneeId: user1.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível atribuir interesse a uma doação com identificardor não existente. [funcional] [negativo]", async () => {
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

    expect(async () => {
      await assignDoneeService.execute({
        donationId: "7b14d2ad-ef44-4971-a8cd-ff91bb64552d",
        doneeId: user1.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível um usuario não cadastrado atribuir interesse a uma doação. [funcional] [negativo]", async () => {
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

    expect(async () => {
      await assignDoneeService.execute({
        donationId: donation.id,
        doneeId: "7b14d2ad-ef44-4971-a8cd-ff91bb64515w",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  // Foi incluso apos perceber nos teste, que mesmo apos cancelar a doação ainda era possivel atribuir interesse
  it("Não deve ser possível um usuario atribuir interesse a uma doação que não esteja aberta. [estrutural] [negativo]", async () => {
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

    await donationsRepository.markDonationAsCancelled({
      donationId: donation.id,
      reason: "Doação cancelada",
    });

    expect(async () => {
      await assignDoneeService.execute({
        donationId: donation.id,
        doneeId: user2.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
