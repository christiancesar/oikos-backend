import { AppError } from "@common/errors/AppError";
import { UserEntity } from "@modules/users/entities/Users";
import IHashProvider from "@modules/users/provider/IHashProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

interface RequestDTO {
  email: string;
  password: string;
}

export class CreateUserService {
  constructor(
    private usersRepository: IUsersRepository,

    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: RequestDTO): Promise<UserEntity> {
    const userExist = await this.usersRepository.findByEmail(email);

    if (userExist) {
      throw new AppError("Email já cadastrado!");
    }

    const hasPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.createUser({
      email,
      password: hasPassword,
    });

    return user;
  }
}
