import { Request, Response } from "express";
import { GetProfileService } from "../../services/GetProfileService";
import { ProfileRepository } from "../../repositories/ProfileRepository";

export class GetUserProfileController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const profileRepository = new ProfileRepository();
    const getProfileService = new GetProfileService(profileRepository);
    const userProfile = await getProfileService.execute({ userId });
    response.json(userProfile);
  }
}
