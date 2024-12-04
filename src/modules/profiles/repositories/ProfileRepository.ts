import { prisma } from "prisma";
import { ProfileEntity } from "../entities/Profile";
import {
  CreateOrUpdateDTO,
  CreateProfileDTO,
  IProfileRepository,
} from "./IProfileRepository";
export class ProfileRepository implements IProfileRepository {
  async create(data: CreateProfileDTO): Promise<ProfileEntity> {
    return prisma.profile.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        cpf: data.cpf,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  async createOrUpdate({
    userId,
    address,
    firstName,
    lastName,
    phone,
    cpf,
  }: CreateOrUpdateDTO): Promise<ProfileEntity> {
    return prisma.profile.upsert({
      where: {
        userId,
      },
      create: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        phone,
        cpf,
        user: {
          connect: {
            id: userId,
          },
        },
        address: {
          create: {
            street: address.street,
            number: address.number,
            complement: address.complement,
            district: address.district,
            city: address.city,
            state: address.state,
            stateAcronym: address.stateAcronym,
            zipCode: address.zipCode,
            latitude: address.latitude,
            longitude: address.longitude,
          },
        },
      },
      update: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        phone,
        cpf,
        address: {
          upsert: {
            create: {
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
              stateAcronym: address.stateAcronym,
              zipCode: address.zipCode,
              latitude: address.latitude,
              longitude: address.longitude,
            },
            update: {
              street: address.street,
              number: address.number,
              complement: address.complement,
              district: address.district,
              city: address.city,
              state: address.state,
              stateAcronym: address.stateAcronym,
              zipCode: address.zipCode,
              latitude: address.latitude,
              longitude: address.longitude,
            },
          },
        },
      },
      include: {
        address: true,
      },
    });
  }

  async findByProdileId(id: string): Promise<ProfileEntity | null> {
    return prisma.profile.findFirst({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<ProfileEntity | null> {
    return prisma.profile.findFirst({
      where: {
        userId,
      },
      include: {
        address: true,
      },
    });
  }
}
