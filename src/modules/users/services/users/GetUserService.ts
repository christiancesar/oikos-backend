import { AppError } from "@common/errors/AppError";
import { UserEntity } from "@modules/users/entities/Users";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

export class GetUserService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByUserId(userId);
    if (!user) {
      throw new AppError("User not found");
    }

    return user;
  }
}
