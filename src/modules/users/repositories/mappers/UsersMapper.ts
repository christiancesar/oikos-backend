import { CompanyEntity } from "@modules/companies/entities/Companies";
import { ProfileEntity } from "@modules/profiles/entities/Profile";
import { UserEntity } from "@modules/users/entities/Users";
import { Prisma } from "@prisma/client";

type UserMapper = Prisma.UserGetPayload<{
  include: {
    profile: {
      include: {
        address: true;
      };
    };
    company: {
      include: {
        address: true;
      };
    };
  };
}>;

export class UsersMapper {
  static async toDomain(user: UserMapper): Promise<UserEntity> {
    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      profile: user.profile
        ? new ProfileEntity(
            {
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              phone: user.profile.phone,
              address: user.profile.address,
            },
            user.profile?.id,
          )
        : null,
      company: user.company
        ? new CompanyEntity({
            id: user.company.id,
            businessName: user.company.businessName,
            corporateName: user.company.corporateName,
            cnpj: user.company.cnpj,
            email: user.company.email,
            isHeadquarters: user.company.isHeadquarters,
            phones: user.company.phones,
            startedActivityIn: user.company.startedActivityIn,
            stateRegistration: user.company.stateRegistration,
            status: user.company.status,
            address: user.company.address,
            updatedAt: user.company.updatedAt,
            createdAt: user.company.createdAt,
          })
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
