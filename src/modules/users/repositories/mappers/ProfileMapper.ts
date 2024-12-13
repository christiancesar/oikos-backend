import { ProfileEntity } from "@modules/profiles/entities/Profile";
import { Prisma } from "@prisma/client";
import { AddressMapper } from "./AddressMapper";

type ProfilePrisma = Prisma.ProfileGetPayload<{
  include: {
    address: true;
  };
}>;

export class ProfileMapper {
  static toDomain(profile: ProfilePrisma): ProfileEntity {
    return new ProfileEntity(
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
        cpf: profile.cpf,
        phone: profile.phone,
        address: profile.address
          ? AddressMapper.toDomain(profile.address)
          : null,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      profile.id,
    );
  }
}
