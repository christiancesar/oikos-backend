import {
  DonationCondition,
  DonationEntity,
  DonationStatus,
} from "@modules/donation/entities/Donation";
import {
  CloseDonationDTO,
  CreateDonationDTO,
  IDonationsRepository,
  MarkDonationAsCancelledDTO,
  RegisterIrregularityDTO,
  SaveAttachmentsDonationDTO,
  SearchParamsDTO,
} from "../IDonationsRepository";

export class DonationsRepositoryInMemory implements IDonationsRepository {
  private donations: DonationEntity[] = [];
  async createDonation({
    donorId,
    condition,
    description,
    quantity,
    additionalNotes,
  }: CreateDonationDTO): Promise<DonationEntity> {
    const donation = new DonationEntity({
      donorId,
      condition: condition as DonationCondition,
      description,
      quantity,
      additionalNotes,
      status: DonationStatus.OPEN,
      createdAt: new Date(),
    });

    this.donations.push(donation);

    return donation;
  }

  async findByDonationId(donationId: string): Promise<DonationEntity | null> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === donationId,
    );

    return this.donations[donationIndex] || null;
  }

  async findAllDonations(data: SearchParamsDTO): Promise<DonationEntity[]> {
    let search: DonationEntity[] = [];

    if (!data.condition && !data.status) {
      search = this.donations;
    }

    if (data.condition && data.status) {
      search = this.donations.filter(
        (donation) =>
          donation.status === data.status &&
          donation.condition === data.condition,
      );
    }

    if (data.condition && !data.status) {
      search = this.donations.filter(
        (donation) => donation.condition === data.condition,
      );
    }

    if (!data.condition && data.status) {
      search = this.donations.filter(
        (donation) => donation.status === data.status,
      );
    }

    return search;
  }

  async assignDonee(
    doneeId: string,
    donationId: string,
  ): Promise<DonationEntity> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === donationId,
    );

    this.donations[donationIndex]!.doneeId = doneeId;

    return this.donations[donationIndex]!;
  }

  async markDonationAsCancelled({
    donationId,
    reason,
  }: MarkDonationAsCancelledDTO): Promise<DonationEntity> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === donationId,
    );

    this.donations[donationIndex]!.status = DonationStatus.CANCELLED;
    this.donations[donationIndex]!.reasonForCancellation = reason;

    return this.donations[donationIndex]!;
  }

  async saveAttachments({
    donationId,
    urls,
  }: SaveAttachmentsDonationDTO): Promise<DonationEntity> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === donationId,
    );

    this.donations[donationIndex]!.attachments = urls;

    return this.donations[donationIndex]!;
  }

  async registerIrregularity(
    data: RegisterIrregularityDTO,
  ): Promise<DonationEntity> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === data.donationId,
    );

    return this.donations[donationIndex]!;
  }

  async closeDonation(data: CloseDonationDTO): Promise<DonationEntity> {
    const donationIndex = this.donations.findIndex(
      (donation) => donation.id === data.donationId,
    );

    this.donations[donationIndex]!.status = DonationStatus.CLOSED;
    this.donations[donationIndex]!.reasonForClosed = data.reason;

    return this.donations[donationIndex]!;
  }
}
