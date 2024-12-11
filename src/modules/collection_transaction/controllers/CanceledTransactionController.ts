import { Request, Response } from "express";
import * as zod from "zod";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { CanceledTransactionService } from "../service/CanceledTransactionService";

const cancelTransactionParamsSchemaValidation = zod.object({
  companyId: zod.string().uuid(),
  transactionId: zod.string().uuid(),
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
