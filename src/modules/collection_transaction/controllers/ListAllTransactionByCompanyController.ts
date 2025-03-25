import { Request, Response } from "express";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { ListAllTransactionsServiceByCompany } from "../services/ListAllTransactionsServiceByCompany";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});
export class ListAllTransactionByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const repositories = CollectionTransactionFactory.make();
    const service = new ListAllTransactionsServiceByCompany(repositories);
    const transactions = await service.execute(companyId);

    response.json(transactions);
  }
}
