import { prisma } from "prisma";
import {
  DonationCondition,
  DonationEntity,
  DonationIrragularity,
  DonationStatus,
} from "../entities/Donation";
import {
  CreateDonationDTO,
  IDonationsRepository,
  MarkDonationAsCancelledDTO,
  RegisterIrregularityDTO,
  SaveAttachmentsDonationDTO,
} from "./IDonationsRepository";
import { Prisma } from "@prisma/client";

type DonationPrisma = Prisma.DonationGetPayload<{
  select: {
    id: true;
    status: true;
    description: true;
    quantity: true;
    condition: true;
    additionalNotes: true;
    irregularitiesQuantity: true;
    irregularities: true;
    donorId: true;
    doneeId: true;
    reasonForCancellation: true;
    reasonForClosed: true;
    attachments: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export class DonationMapper {
  static toEntity(data: DonationPrisma): DonationEntity {
    const irregularities: DonationIrragularity[] = data.irregularities
      ? JSON.parse(data.irregularities)
      : [];

    return new DonationEntity({
      id: data.id,
      status: DonationStatus[data.status as keyof typeof DonationStatus],
      description: data.description,
      quantity: data.quantity,
      condition:
        DonationCondition[data.condition as keyof typeof DonationCondition],
      additionalNotes: data.additionalNotes,
      irregularitiesQuantity: data.irregularitiesQuantity,
      irregularities,
      donorId: data.donorId,
      doneeId: data.doneeId,
      reasonForCancellation: data.reasonForCancellation,
      reasonForClosed: data.reasonForClosed,
      attachments: data.attachments.map((attachment) => attachment.url),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

export class DonationsRepository implements IDonationsRepository {
  async createDonation(data: CreateDonationDTO): Promise<DonationEntity> {
    const donation = await prisma.donation.create({
      data: {
        status: DonationStatus.OPEN,
        description: data.description,
        quantity: data.quantity,
        condition: data.condition,
        additionalNotes: data.additionalNotes,
        donorId: data.donorId,
      },
      include: {
        attachments: true,
      },
    });

    return DonationMapper.toEntity(donation);
  }

  async findByDonationId(donationId: string): Promise<DonationEntity | null> {
    const donation = await prisma.donation.findUnique({
      where: {
        id: donationId,
      },
      include: {
        attachments: true,
      },
    });

    return donation ? DonationMapper.toEntity(donation) : null;
  }

  async assignDonee(
    doneeId: string,
    donationId: string,
  ): Promise<DonationEntity> {
    const donation = await prisma.donation.update({
      where: {
        id: donationId,
      },
      data: {
        status: DonationStatus.ASSIGNED,
        doneeId,
      },
      include: {
        attachments: true,
      },
    });

    return DonationMapper.toEntity(donation);
  }

  async findAllDonations(): Promise<DonationEntity[]> {
    const donations = await prisma.donation.findMany({
      include: {
        attachments: true,
      },
    });

    return donations.map((donation) => DonationMapper.toEntity(donation));
  }

  async markDonationAsCancelled(
    data: MarkDonationAsCancelledDTO,
  ): Promise<DonationEntity> {
    const donation = await prisma.donation.update({
      where: {
        id: data.donationId,
      },
      data: {
        status: DonationStatus.CANCELLED,
        reasonForCancellation: data.reason,
      },
      include: {
        attachments: true,
      },
    });

    return DonationMapper.toEntity(donation);
  }

  async saveAttachments({
    donationId,
    urls,
  }: SaveAttachmentsDonationDTO): Promise<DonationEntity> {
    const donation = await prisma.donation.update({
      where: {
        id: donationId,
      },
      data: {
        attachments: {
          create: urls.map((url) => ({
            url,
          })),
        },
      },
      include: {
        attachments: true,
      },
    });

    return DonationMapper.toEntity(donation);
  }

  async registerIrregularity({
    donationId,
    irregularities,
    irregularitiesQuantity,
  }: RegisterIrregularityDTO): Promise<DonationEntity> {
    const donation = await prisma.donation.update({
      where: {
        id: donationId,
      },
      data: {
        irregularities,
        irregularitiesQuantity,
      },
      include: {
        attachments: true,
      },
    });

    return DonationMapper.toEntity(donation);
  }
}
