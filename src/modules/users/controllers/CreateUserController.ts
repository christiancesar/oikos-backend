import { Request, Response } from "express";
import { BCryptHashProvider } from "../provider/BCryptHashProvider";
import { UsersRepository } from "../repositories/prisma/UsersRepository";
import { CreateUserService } from "../services/users/CreateUserService";

export class CreateUserController {
  public async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    const usersRepository = new UsersRepository();
    const hashProvider = new BCryptHashProvider();
    const createUserServive = new CreateUserService(
      usersRepository,
      hashProvider,
    );

    await createUserServive.execute({
      email,
      password,
    });

    response.status(201).json();
  }
}
