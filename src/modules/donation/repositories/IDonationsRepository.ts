import { DonationEntity } from "../entities/Donation";

export type CreateDonationDTO = {
  description: string;
  quantity: number;
  condition: string;
  additionalNotes: string;
  donorId: string;
};

export type MarkDonationAsCancelledDTO = {
  donationId: string;
  reason: string;
};

export type SaveAttachmentsDonationDTO = {
  donationId: string;
  urls: string[];
};

export type RegisterIrregularityDTO = {
  donationId: string;
  irregularities: string;
  irregularitiesQuantity: number;
};

export interface IDonationsRepository {
  createDonation(data: CreateDonationDTO): Promise<DonationEntity>;
  findByDonationId(donationId: string): Promise<DonationEntity | null>;
  findAllDonations(): Promise<DonationEntity[]>;
  assignDonee(doneeId: string, donationId: string): Promise<DonationEntity>;
  markDonationAsCancelled(
    data: MarkDonationAsCancelledDTO,
  ): Promise<DonationEntity>;

  saveAttachments(data: SaveAttachmentsDonationDTO): Promise<DonationEntity>;
  registerIrregularity(data: RegisterIrregularityDTO): Promise<DonationEntity>;
}
