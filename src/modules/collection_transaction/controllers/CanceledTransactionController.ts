import { Request, Response } from "express";
import { z } from "zod";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { CanceledTransactionService } from "../services/CanceledTransactionService";

const cancelTransactionParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
  transactionId: z.string().uuid(),
});

export class CanceledTransactionController {
  async handle(request: Request, response: Response) {
    const { companyId, transactionId } =
      cancelTransactionParamsSchemaValidation.parse(request.params);
    const repositories = CollectionTransactionFactory.make();
    const service = new CanceledTransactionService(repositories);
    const collectionTransaction = await service.execute({
      companyId,
      transactionId,
    });

    response.json(collectionTransaction);
  }
}
