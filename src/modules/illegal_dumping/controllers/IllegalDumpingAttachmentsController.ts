import { Request, Response, Express } from "express";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { IllegalDumpingAttachmentsService } from "../services/IllegalDumpingAttachmentsService";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  denuciationId: z.string().uuid(),
});
export class IllegalDumpingAttachmentsController {
  async handle(request: Request, response: Response) {
    const { denuciationId } = requestParamsSchemaValidation.parse(
      request.params,
    );
    let files: string[] = [];
    if (Array.isArray(request.files)) {
      files = request.files.map((file: Express.Multer.File) => file.filename);
    }
    const repository = new IllegalDumpingRepository();
    const service = new IllegalDumpingAttachmentsService(repository);

    const illegal = await service.execute({
      denuciationId,
      files,
    });

    response.status(201).json({ illegal });
  }
}
