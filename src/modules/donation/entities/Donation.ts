/* eslint-disable camelcase */
import { randomUUID } from "crypto";

export enum DonationStatus {
  OPEN = "OPEN",
  ASSIGNED = "ASSIGNED",
  CANCELLED = "CANCELLED",
  CLOSED = "CLOSED",
  COMPLETED = "COMPLETED",
}

export enum DonationCondition {
  NEW = "NEW",
  USED = "USED",
}

export class DonationIrragularity {
  type: string;
  description: string;
  userId: string;
  createdAt?: Date | null;

  constructor(data: DonationIrragularity) {
    this.type = data.type;
    this.description = data.description;
    this.userId = data.userId;
    this.createdAt = data.createdAt ?? new Date();
  }
}

type DonationConstructorParams = {
  id?: string;
  status: DonationStatus;
  description: string;
  quantity: number;
  condition: DonationCondition;
  additionalNotes: string;
  donorId: string; // doador
  doneeId?: string | null; // donatário
  attachments?: string[] | null;
  irregularitiesQuantity?: number | null;
  irregularities?: DonationIrragularity[] | null;
  reasonForCancellation?: string | null;
  reasonForClosed?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

const MAX_IRREGULARITiES_QUANTITY = 25;

export class DonationEntity {
  id: string;
  status: DonationStatus;
  description: string;
  quantity: number;
  condition: DonationCondition;
  additionalNotes: string;
  donorId: string; // doador
  doneeId?: string | null; // donatário
  attachments?: string[] | null;
  irregularitiesQuantity: number;
  irregularities?: DonationIrragularity[] | null;
  reasonForCancellation?: string | null;
  reasonForClosed?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(donation: DonationConstructorParams) {
    this.id = donation.id ?? randomUUID();
    this.status = donation.status;
    this.description = donation.description;
    this.quantity = donation.quantity;
    this.condition = donation.condition;
    this.additionalNotes = donation.additionalNotes;
    this.donorId = donation.donorId;
    this.doneeId = donation.doneeId;
    this.attachments = donation.attachments ?? [];
    this.irregularitiesQuantity = donation.irregularitiesQuantity ?? 0;
    this.irregularities = donation.irregularities ?? [];
    this.reasonForCancellation = donation.reasonForCancellation;
    this.reasonForClosed = donation.reasonForClosed;
    this.createdAt = donation.createdAt;
    this.updatedAt = donation.updatedAt;
  }

  public addIrragularity(irragularity: DonationIrragularity) {
    this.irregularities?.push(irragularity);
    this.addIrregularitiesQuantity();
  }

  protected addIrregularitiesQuantity() {
    const quantity = this.irregularities?.length ?? 0;
    this.irregularitiesQuantity = quantity;

    if (quantity >= MAX_IRREGULARITiES_QUANTITY) {
      this.closeDonationByIrregularities();
    }
  }

  protected closeDonationByIrregularities() {
    this.status = DonationStatus.CLOSED;
    this.reasonForClosed = "Quantidade de denuncias excedeu o limite permitido";
  }
}
