import { prisma } from "prisma";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { UserEntity } from "../entities/Users";
import IUsersRepository from "./IUsersRepository";

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
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: {
          include: {
            address: true,
          },
        },
        company: {
          include: {
            address: true,
          },
        },
      },
    });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
