import { Request, Response } from "express";
import { UserPresenter } from "../presenters/UserPresenter";
import { UsersRepository } from "../repositories/UsersRepository";
import { GetUserService } from "../services/users/GetUserService";

export class GetUserController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const usersRepository = new UsersRepository();
    const getUserService = new GetUserService(usersRepository);
    const user = await getUserService.execute(userId);

    response.json(UserPresenter.execute(user));
  }
}
