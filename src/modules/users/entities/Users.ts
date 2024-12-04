import { CompanyEntity } from "@modules/companies/entities/Companies";
import { ProfileEntity } from "@modules/profiles/entities/Profile";
import { Exclude } from "class-transformer";
import { randomUUID } from "crypto";

type UserEntityConstructor = {
  id?: string;
  email: string;
  password: string;
  profile?: ProfileEntity | null;
  company?: CompanyEntity | null;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class UserEntity {
  id: string;
  email: string;
  @Exclude({ toPlainOnly: true })
  password: string;

  profile?: ProfileEntity | null;
  company?: CompanyEntity | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor({
    email,
    password,
    profile,
    company,
    updatedAt,
    createdAt,
    id,
  }: UserEntityConstructor) {
    this.id = id ?? randomUUID();
    this.email = email;
    this.password = password;
    this.profile = profile ?? null;
    this.company = company ?? null;
    this.updatedAt = updatedAt ?? null;
    this.createdAt = createdAt ?? new Date();
  }
}
