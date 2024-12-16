import { AppError } from "@common/errors/AppError";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";

type Attachments = {
  denuciationId: string;
  files: string[];
};
export class IllegalDumpingAttachmentsService {
  constructor(private repository: IllegalDumpingRepository) {}
  async execute({ denuciationId, files }: Attachments) {
    if (files.length === 0) {
      throw new AppError("No files provided");
    }

    files.forEach((file) => {
      if (file.trim() === "") {
        throw new AppError("File name cannot be empty");
      }
    });

    const illegal = await this.repository.findById(denuciationId);
    if (!illegal) {
      throw new AppError("Illegal dumping not found");
    }

    const urls = files.map((file) => {
      return `${process.env.URL}/storage/${file}`;
    });

    const illegalWithAttachments = await this.repository.saveAttchments({
      denuciationId,
      urls,
    });

    return illegalWithAttachments;
  }
}
