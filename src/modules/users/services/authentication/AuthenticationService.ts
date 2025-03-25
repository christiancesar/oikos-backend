import { enviroment } from "@common/env/env";
import { Secret, SignOptions, sign } from "jsonwebtoken";
import { AppError } from "@common/errors/AppError";
import IHashProvider from "@modules/users/provider/IHashProvider";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

type AuthenticationRequest = {
  email: string;
  password: string;
};

type AuthenticationResponse = {
  token: string;
};

export class AuthenticationService {
  constructor(
    private usersRepository: IUsersRepository,

    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticationRequest): Promise<AuthenticationResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!", 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError("Email or password incorrect!", 401);
    }

    const jwtSecret: Secret = enviroment.JWT_SECRET;
    const signOptions: SignOptions = {
      subject: user.id,
      expiresIn: enviroment.JWT_EXPIRES_IN,
    };

    const token = sign({}, jwtSecret, signOptions);

    return { token };
  }
}
