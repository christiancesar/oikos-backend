import { ProfileEntity } from "@modules/profiles/entities/Profile";
import { CreateOrUpdateDTO, IProfileRepository } from "../IProfileRepository";
import { AddressEntity } from "@modules/addresses/address";

type ProfileInMemory = ProfileEntity & {
  userId: string;
};

export class ProfileRepositoryInMemory implements IProfileRepository {
  private profiles: ProfileInMemory[] = [];
  async createOrUpdate(data: CreateOrUpdateDTO): Promise<ProfileEntity> {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.userId === data.userId,
    );

    if (profileIndex === -1) {
      const profileCreated = new ProfileEntity({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        cpf: data.cpf,
        address: new AddressEntity(data.address),
      });

      this.profiles.push({
        ...profileCreated,
        userId: data.userId,
      });

      return profileCreated;
    }

    const profileUpdated = this.profiles[profileIndex]!;

    Object.assign(profileUpdated!, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      cpf: data.cpf,
      address: data.address,
    });

    return profileUpdated;
  }

  async findByProfileId(id: string): Promise<ProfileEntity | null> {
    const profile = this.profiles.find((profile) => profile.id === id);
    return profile || null;
  }

  async findByUserId(userId: string): Promise<ProfileEntity | null> {
    const profile = this.profiles.find((profile) => profile.userId === userId);
    return profile || null;
  }
}
