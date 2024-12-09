import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { AssignAttachmentsToDonationService } from "../services/AssignAttachmentsToDonationService";

export class AssignAttachmentsToDonationController {
  async handle(request: Request, response: Response) {
    const { donationId } = request.params;
    let files: string[] = [];
    if (Array.isArray(request.files)) {
      files = request.files.map((file: Express.Multer.File) => file.filename);
    }

    const donationsRepository = new DonationsRepository();
    const service = new AssignAttachmentsToDonationService(donationsRepository);
    const donation = await service.execute({ donationId, files });

    response.json(donation);
  }
}
