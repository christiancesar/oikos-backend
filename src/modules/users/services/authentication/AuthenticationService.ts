import { AppError } from "@common/errors/AppError";
import IHashProvider from "@modules/users/provider/IHashProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { sign } from "jsonwebtoken";

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

    if (!password) {
      throw new AppError("Email or password incorrect!", 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError("Email or password incorrect!", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError("Setup error: JWT secret is not defined", 500);
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    return { token };
  }
}
