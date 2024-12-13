import { CompaniesMapper } from "@modules/companies/repositories/mappers/CompaniesMapper";
import { UserEntity } from "@modules/users/entities/Users";
import { Prisma } from "@prisma/client";
import { ProfileMapper } from "./ProfileMapper";

type UserPrisma = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
  include: {
    profile: {
      include: {
        address: true;
      };
    };
    companies: {
      include: {
        address: true;
        businessHours: {
          include: {
            timeSlots: true;
          };
        };
        wasteItems: {
          include: {
            material: true;
          };
        };
        user: false;
      };
    };
  };
}>;

export class UsersMapper {
  static toDomain(data: UserPrisma): UserEntity {
    return new UserEntity({
      id: data.id,
      email: data.email,
      password: "",
      profile: data.profile ? ProfileMapper.toDomain(data.profile) : null,
      companies: data.companies
        ? data.companies.map((c) => {
            return CompaniesMapper.toDomain(c);
          })
        : null,
    });
  }
}
