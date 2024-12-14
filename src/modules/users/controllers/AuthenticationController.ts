import { Request, Response } from "express";
import { BCryptHashProvider } from "../provider/BCryptHashProvider";
import { UsersRepository } from "../repositories/prisma/UsersRepository";
import { AuthenticationService } from "../services/authentication/AuthenticationService";

export default class AuthenticationController {
  public async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const usersRepository = new UsersRepository();
    const hashProvider = new BCryptHashProvider();
    const authenticationService = new AuthenticationService(
      usersRepository,
      hashProvider,
    );
    const { token } = await authenticationService.execute({
      email,
      password,
    });

    response.json({ token });
  }
}
