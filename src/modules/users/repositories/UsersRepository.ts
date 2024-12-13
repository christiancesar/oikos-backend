import { prisma } from "prisma";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { UserEntity } from "../entities/Users";
import IUsersRepository from "./IUsersRepository";
import { UsersMapper } from "./mappers/UsersMapper";

export class UsersRepository implements IUsersRepository {
  public async createUser(data: ICreateUserDTO): Promise<UserEntity> {
    const user = prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  public async findByUserId(userId: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
      include: {
        profile: {
          include: {
            address: true,
          },
        },
        companies: {
          include: {
            address: true,
            businessHours: {
              include: {
                timeSlots: true,
              },
            },
            wasteItems: {
              include: {
                material: true,
              },
            },
            user: false,
          },
        },
      },
    });

    return user ? UsersMapper.toDomain(user) : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
