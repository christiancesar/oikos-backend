import "dotenv/config";
import { AppError } from "@common/errors/AppError";
import { beforeEach, describe, expect, it } from "vitest";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { AssignAttachmentsToDonationService } from "./AssignAttachmentsToDonationService";
import { DonationsRepositoryInMemory } from "../repositories/inMemory/DonationsRepositoryInMemory";
import { randomUUID } from "node:crypto";
import { DonationCondition } from "../entities/Donation";

let donationsRepository: IDonationsRepository;
let assignAttachmentsToDonationService: AssignAttachmentsToDonationService;

describe("Atribuir anexos a uma doação", () => {
  beforeEach(() => {
    donationsRepository = new DonationsRepositoryInMemory();
    assignAttachmentsToDonationService = new AssignAttachmentsToDonationService(
      donationsRepository,
    );
  });

  it("Deve ser possível criar anexar links a uma denuncia de descarte [funcional] [positivo]", async () => {
    const donation = await donationsRepository.createDonation({
      donorId: randomUUID(),
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    const assign = await assignAttachmentsToDonationService.execute({
      donationId: donation.id,
      files: ["file1.jpg", "file2.jpg"],
    });

    expect(assign.attachments).toHaveLength(2);
  });

  it("Não deve ser possível criar anexar links, caso files for um array vazio. [funcional] [negativo]", async () => {
    const donation = await donationsRepository.createDonation({
      donorId: randomUUID(),
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(async () => {
      await assignAttachmentsToDonationService.execute({
        donationId: donation.id,
        files: [],
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Não deve ser possível criar anexar links, caso o identificar de denuncia não estiver cadastrado. [Estrutural] [negativo]", async () => {
    await donationsRepository.createDonation({
      donorId: "7b14d2ad-ef44-4971-a8cd-ff91bb64552d",
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(async () => {
      await assignAttachmentsToDonationService.execute({
        donationId: "e9a0c17e-7049-4fb0-a682-ce148ac4b6c3",
        files: ["file1.jpg", "file2.jpg"],
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  // Apos os testes anteriores foi possivel perceber que era possivel criar anexos com nomes vazios
  it("Não deve ser possível criar anexar links estando com nomes vazios. [Estrutural] [negativo]", async () => {
    const donation = await donationsRepository.createDonation({
      donorId: randomUUID(),
      additionalNotes:
        "Proident aliquip elit sint aliquip enim proident et non laboris ad tempor id sit.Velit irure est voluptate sint dolore occaecat laboris et nostrud laborum enim.",
      condition: DonationCondition.USED,
      description:
        "Consectetur nostrud Lorem aliqua sunt esse non ad Lorem et irure et consectetur.",
      quantity: 1,
    });

    expect(async () => {
      await assignAttachmentsToDonationService.execute({
        donationId: donation.id,
        files: ["", ""],
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
