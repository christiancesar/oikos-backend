import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { UserEntity } from "../entities/Users";

export interface IUsersRepository {
  createUser(data: ICreateUserDTO): Promise<UserEntity>;
  findByUserId(userId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
