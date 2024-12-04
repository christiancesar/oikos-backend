import { randomUUID } from "crypto";

type AddressEntityConstructor = {
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  stateAcronym: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export type Location = {
  lat: number;
  lng: number;
};

export class AddressEntity {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  district: string;
  city: string;
  state: string;
  stateAcronym: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    {
      city,
      district,
      number,
      zipCode,
      state,
      stateAcronym,
      street,
      complement,
      latitude,
      longitude,
      createdAt,
      updatedAt,
    }: AddressEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.city = city;
    this.district = district;
    this.number = number;
    this.zipCode = zipCode;
    this.state = state;
    this.stateAcronym = stateAcronym;
    this.street = street;
    this.complement = complement;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? null;
  }
}
