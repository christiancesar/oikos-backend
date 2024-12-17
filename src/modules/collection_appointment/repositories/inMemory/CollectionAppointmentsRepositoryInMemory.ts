import {
  CollectionAppointmentEntity,
  StatusCollectionAppointment,
} from "@modules/collection_appointment/entities/CollectionAppointment";
import {
  AppointmentCompanyDTO,
  CancelAppointmentCompanyDTO,
  CancelAppointmentCustomerDTO,
  CreateCollectionAppointmentDTO,
  ICollectionAppointmentsRepository,
} from "../ICollectionAppointmentsRepository";
import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { randomUUID } from "crypto";
import { makeMaterial } from "@modules/material/factories/makeMaterial";

export class CollectionAppointmentsRepositoryInMemory
  implements ICollectionAppointmentsRepository
{
  private collectionAppointments: CollectionAppointmentEntity[] = [];
  async createCollectionAppointment({
    companyId,
    customerId,
    scheduleFor,
    wastes,
  }: CreateCollectionAppointmentDTO): Promise<CollectionAppointmentEntity> {
    const appointment = new CollectionAppointmentEntity({
      company: {
        id: companyId,
        corporateName: "Company Teste",
      },
      customer: {
        userId: customerId,
        profile: {
          id: randomUUID(),
          address: makeAddress(),
          fullName: "Customer Teste",
          phone: "(99) 9 9999-9999",
        },
      },
      scheduleFor,
      status: StatusCollectionAppointment.CREATED,
      wastes: wastes.map((waste) => makeMaterial({ id: waste })),
    });

    this.collectionAppointments.push(appointment);

    return appointment;
  }

  async listCollectionAppointmentByCustomerId(data: {
    customerId: string;
  }): Promise<CollectionAppointmentEntity[]> {
    const appointments = this.collectionAppointments.filter(
      (appointment) => appointment.customer.userId === data.customerId,
    );

    return appointments;
  }

  async findCollectionAppointmentById(data: {
    appointmentId: string;
  }): Promise<CollectionAppointmentEntity | undefined> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) => appointment.id === data.appointmentId,
    );

    return this.collectionAppointments[appointmentIndex];
  }

  async cancelCollectionAppointment(
    data: CancelAppointmentCustomerDTO,
  ): Promise<CollectionAppointmentEntity> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) => appointment.id === data.appointmentId,
    );

    this.collectionAppointments[appointmentIndex].status =
      StatusCollectionAppointment.CANCELED;
    this.collectionAppointments[appointmentIndex].reasonForCancellation =
      data.reason;

    return this.collectionAppointments[appointmentIndex];
  }

  async updateScheduleForAppointment(data: {
    customerId: string;
    appointmentId: string;
    scheduleFor: Date;
  }): Promise<CollectionAppointmentEntity> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) => appointment.id === data.appointmentId,
    );

    this.collectionAppointments[appointmentIndex].scheduleFor =
      data.scheduleFor;

    return this.collectionAppointments[appointmentIndex];
  }

  async listCollectionAppointmentsByCompanyId({
    companyId,
  }: {
    companyId: string;
  }): Promise<CollectionAppointmentEntity[]> {
    const appointments = this.collectionAppointments.filter(
      (appointment) => appointment.company.id === companyId,
    );

    return appointments;
  }

  async findCollectionAppointmentByCompanyId({
    appointmentId,
    companyId,
  }: AppointmentCompanyDTO): Promise<CollectionAppointmentEntity | null> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) =>
        appointment.id === appointmentId &&
        appointment.company.id === companyId,
    );

    return this.collectionAppointments[appointmentIndex];
  }

  async confirmationCollectionAppointmentCompayId({
    appointmentId,
    companyId,
  }: AppointmentCompanyDTO): Promise<CollectionAppointmentEntity> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) =>
        appointment.id === appointmentId &&
        appointment.company.id === companyId,
    );

    this.collectionAppointments[appointmentIndex].status =
      StatusCollectionAppointment.CONFIRMED;

    return this.collectionAppointments[appointmentIndex];
  }

  async cancelCollectionAppointmentByCompanyId({
    appointmentId,
    companyId,
    reason,
  }: CancelAppointmentCompanyDTO): Promise<CollectionAppointmentEntity> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) =>
        appointment.id === appointmentId &&
        appointment.company.id === companyId,
    );

    this.collectionAppointments[appointmentIndex].status =
      StatusCollectionAppointment.CANCELED;
    this.collectionAppointments[appointmentIndex].reasonForCancellation =
      reason;

    return this.collectionAppointments[appointmentIndex];
  }

  async completeAppointmentByCompany({
    appointmentId,
    companyId,
  }: AppointmentCompanyDTO): Promise<CollectionAppointmentEntity> {
    const appointmentIndex = this.collectionAppointments.findIndex(
      (appointment) =>
        appointment.id === appointmentId &&
        appointment.company.id === companyId,
    );

    this.collectionAppointments[appointmentIndex].status =
      StatusCollectionAppointment.COMPLETED;

    return this.collectionAppointments[appointmentIndex];
  }
}
