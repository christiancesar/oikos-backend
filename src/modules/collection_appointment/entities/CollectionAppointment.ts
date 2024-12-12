import { AddressEntity } from "@modules/addresses/address";
import { randomUUID } from "crypto";

export enum StatusCollectionAppointment {
  CREATED = "CREATED",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}
type CompanyCollectionAppointment = {
  id: string;
  corporateName?: string;
};

type MaterialCollectionAppointment = {
  id: string;
  name: string;
};

type ProfileCollectionAppointment = {
  id: string;
  fullName: string;
  phone: string;
  address: AddressEntity;
};

type UserCollectionAppointment = {
  userId: string;
  profile: ProfileCollectionAppointment;
};

type CollectionAppointmentEntityContructor = {
  id?: string;
  appointmentId?: string | null;
  status: StatusCollectionAppointment;
  company: CompanyCollectionAppointment;
  customer: UserCollectionAppointment;
  wastes: MaterialCollectionAppointment[];
  reasonForCancellation?: string | null;
  scheduleFor: Date;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class CollectionAppointmentEntity {
  id: string;
  appointmentId?: string | null;
  status: StatusCollectionAppointment;
  company: CompanyCollectionAppointment;
  reasonForCancellation?: string | null;
  wastes: MaterialCollectionAppointment[];
  customer: UserCollectionAppointment;
  scheduleFor: Date;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(data: CollectionAppointmentEntityContructor) {
    this.id = data.id ?? randomUUID();
    this.appointmentId = data.appointmentId ?? null;
    this.customer = data.customer;
    this.status = data.status ?? StatusCollectionAppointment.CREATED;
    this.reasonForCancellation = data.reasonForCancellation ?? null;
    this.company = data.company;
    this.wastes = data.wastes ?? [];
    this.scheduleFor = data.scheduleFor;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? null;
  }
}
