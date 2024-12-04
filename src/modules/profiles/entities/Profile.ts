import { AddressEntity } from "@modules/addresses/address";
import { randomUUID } from "crypto";

type ProfileEntityConstructor = {
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
  address?: AddressEntity | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export class ProfileEntity {
  id: string;
  cpf: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  address?: AddressEntity | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    {
      firstName,
      lastName,
      phone,
      cpf,
      createdAt,
      updatedAt,
      address,
    }: ProfileEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.cpf = cpf;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${firstName} ${lastName}`;
    this.phone = phone;
    this.address = address;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? null;
  }
}
