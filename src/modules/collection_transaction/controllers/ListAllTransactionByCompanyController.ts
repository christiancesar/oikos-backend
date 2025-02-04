import { Request, Response } from "express";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { ListAllTransactionsServiceByCompany } from "../services/ListAllTransactionsServiceByCompany";

export class ListAllTransactionByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const repositories = CollectionTransactionFactory.make();
    const service = new ListAllTransactionsServiceByCompany(repositories);
    const transactions = await service.execute(companyId);

    response.json(transactions);
  }
}
