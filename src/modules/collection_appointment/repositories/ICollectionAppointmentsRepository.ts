import { CollectionAppointmentEntity } from "../entities/CollectionAppointment";

export type CreateCollectionAppointmentDTO = {
  companyId: string;
  customerId: string;
  wastes: string[];
  scheduleFor: Date;
};

export type AppointmentCompanyDTO = {
  companyId: string;
  appointmentId: string;
};

export type CancelAppointmentCustomerDTO = {
  customerId: string;
  appointmentId: string;
  reason: string;
};

export type CancelAppointmentCompanyDTO = {
  companyId: string;
  appointmentId: string;
  reason: string;
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

  cancelCollectionAppointment(
    data: CancelAppointmentCustomerDTO,
  ): Promise<CollectionAppointmentEntity>;

  updateScheduleForAppointment(data: {
    customerId: string;
    appointmentId: string;
    scheduleFor: Date;
  }): Promise<CollectionAppointmentEntity>;

  listCollectionAppointmentsByCompanyId(data: {
    companyId: string;
  }): Promise<CollectionAppointmentEntity[]>;

  findCollectionAppointmentByCompanyId(
    data: AppointmentCompanyDTO,
  ): Promise<CollectionAppointmentEntity | null>;

  confirmationCollectionAppointmentCompayId(
    data: AppointmentCompanyDTO,
  ): Promise<CollectionAppointmentEntity>;

  cancelCollectionAppointmentByCompanyId(
    data: CancelAppointmentCompanyDTO,
  ): Promise<CollectionAppointmentEntity>;

  completeAppointmentByCompany(
    data: AppointmentCompanyDTO,
  ): Promise<CollectionAppointmentEntity>;
}
