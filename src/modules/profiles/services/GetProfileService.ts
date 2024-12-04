import { AppError } from "@common/errors/AppError";
import { IProfileRepository } from "../repositories/IProfileRepository";

type GetProfileServiceParams = {
  userId: string;
};

export class GetProfileService {
  constructor(private profileRepository: IProfileRepository) {}
  async execute({ userId }: GetProfileServiceParams) {
    const profileExist = await this.profileRepository.findByUserId(userId);
    if (!profileExist) {
      throw new AppError("Não existe perfil para este usuário");
    }
    return profileExist;
  }
}
