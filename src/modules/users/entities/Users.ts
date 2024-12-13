import { CompanyEntity } from "@modules/companies/entities/Companies";
import { ProfileEntity } from "@modules/profiles/entities/Profile";
import { randomUUID } from "crypto";

type UserEntityConstructor = {
  id?: string;
  email: string;
  password: string;
  profile?: ProfileEntity | null;
  companies?: CompanyEntity[] | null;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export class UserEntity {
  id: string;
  email: string;
  password: string;
  profile?: ProfileEntity | null;
  companies?: CompanyEntity[] | null;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor({
    email,
    password,
    profile,
    companies,
    updatedAt,
    createdAt,
    id,
  }: UserEntityConstructor) {
    this.id = id ?? randomUUID();
    this.email = email;
    this.password = password;
    this.profile = profile ?? null;
    this.companies = companies ?? [];
    this.updatedAt = updatedAt ?? null;
    this.createdAt = createdAt ?? new Date();
  }
}
