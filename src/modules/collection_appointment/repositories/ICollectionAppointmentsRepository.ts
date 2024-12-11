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

  listCollectionAppointmentByCustomerId(data: {
    customerId: string;
  }): Promise<CollectionAppointmentEntity[]>;

  findCollectionAppointmentById(data: {
    appointmentId: string;
  }): Promise<CollectionAppointmentEntity | undefined>;

  cancelCollectionAppointment(data: {
    customerId: string;
    appointmentId: string;
    reason: string;
  }): Promise<CollectionAppointmentEntity>;

  updateScheduleForAppointment(data: {
    customerId: string;
    appointmentId: string;
    scheduleFor: Date;
  }): Promise<CollectionAppointmentEntity>;

  listCollectionAppointmentsByCompanyId(data: {
    companyId: string;
  }): Promise<CollectionAppointmentEntity[]>;

  findCollectionAppointmentByCompanyId(data: {
    companyId: string;
    appointmentId: string;
  }): Promise<CollectionAppointmentEntity | null>;

  confirmationCollectionAppointmentCompayId(data: {
    companyId: string;
    appointmentId: string;
  }): Promise<CollectionAppointmentEntity>;

  cancelCollectionAppointmentByCompanyId(data: {
    companyId: string;
    appointmentId: string;
    reason: string;
  }): Promise<CollectionAppointmentEntity>;
}
