import { Request, Response } from "express";
import { ProfileRepository } from "../../repositories/ProfileRepository";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { CreateOrUpdateProfileService } from "../../services/CreateOrUpdateProfileService";
import * as zod from "zod";

const CreateOrUpdateProfileControllerRequestBodySchema = zod.object({
  firstName: zod
    .string()
    .min(2, { message: "Primeiro nome deve ser maior que 2 caracteres" }),
  lastName: zod
    .string()
    .min(2, { message: "Primeiro nome deve ser maior que 2 caracteres" }),
  phone: zod.string(),
  cpf: zod.string().length(11, { message: "CPF deve ter 11 caracteres" }),
  address: zod.object({
    street: zod.string(),
    number: zod.string(),
    complement: zod.string().optional(),
    district: zod.string(),
    city: zod.string(),
    state: zod.string(),
    stateAcronym: zod.string(),
    zipCode: zod.string(),
    latitude: zod.number(),
    longitude: zod.number(),
  }),
});

export class CreateUserProfileController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;

    const { firstName, lastName, phone, cpf, address } =
      CreateOrUpdateProfileControllerRequestBodySchema.parse(request.body);

    const profileRepository = new ProfileRepository();
    const usersRepository = new UsersRepository();
    const createOrUpdateProfileService = new CreateOrUpdateProfileService(
      profileRepository,
      usersRepository,
    );
    const profile = await createOrUpdateProfileService.execute({
      userId,
      firstName,
      lastName,
      phone,
      address,
      cpf,
    });

    response.json(profile);
  }
}
