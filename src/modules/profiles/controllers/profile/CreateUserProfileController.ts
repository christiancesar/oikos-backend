import { Request, Response } from "express";
import { ProfileRepository } from "../../repositories/ProfileRepository";
import { CreateOrUpdateProfileService } from "../../services/CreateOrUpdateProfileService";
import { z } from "zod";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

const CreateOrUpdateProfileControllerRequestBodySchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Primeiro nome deve ser maior que 2 caracteres" }),
  lastName: z
    .string()
    .min(2, { message: "Primeiro nome deve ser maior que 2 caracteres" }),
  phone: z.string(),
  cpf: z.string().length(11, { message: "CPF deve ter 11 caracteres" }),
  address: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
    stateAcronym: z.string(),
    zipCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
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
