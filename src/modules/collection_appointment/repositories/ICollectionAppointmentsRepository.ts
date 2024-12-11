import { CollectionAppointmentEntity } from "../entities/CollectionAppointment";

export type CreateCollectionAppointmentDTO = {
  companyId: string;
  customerId: string;
  wastes: string[];
  scheduleFor: Date;
};

export interface ICollectionAppointmentsRepository {
  createCollectionAppointment(
    data: CreateCollectionAppointmentDTO,
  ): Promise<CollectionAppointmentEntity>;
}
