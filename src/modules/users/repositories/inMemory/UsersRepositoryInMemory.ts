import { ICreateUserDTO } from "@modules/users/dtos/ICreateUserDTO";
import { UserEntity } from "@modules/users/entities/Users";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { randomUUID } from "node:crypto";

export class UsersRepositoryInMemory implements IUsersRepository {
  private users: UserEntity[] = [];

  async createUser(data: ICreateUserDTO): Promise<UserEntity> {
    const user = new UserEntity({
      email: data.email,
      password: data.password,
      companies: [],
      profile: null,
      createdAt: new Date(),
      id: randomUUID(),
    });

    this.users.push(user);

    return user;
  }

  async findByUserId(userId: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.id === userId);

    return user || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((user) => user.email === email);
    return user || null;
  }
}
