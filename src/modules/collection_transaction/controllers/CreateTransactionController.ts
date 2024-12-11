import { WasteType } from "@modules/companies/entities/Item";
import { UnitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { Request, Response } from "express";
import * as zod from "zod";
import { CollectionType, TradingType } from "../entities/CollectionTransaction";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { CreateTransactionService } from "../service/CreateTransactionService";

/**
 * This schema is used to validate the request body of the CreateTransactionController.
 * São opcionais pois a coleta pode acontecer sem a compra ou venda de algum residuo ou usuário não fazer o lançamento no momento da resiclagem.
 * unitAmount,
 * grossAmount,
 * discountAmount,
 * netAmount,
 * latitude,
 * longitude,
 */

const createCollectionTransactionSchemaValidation = zod.object({
  wasteId: zod.string().uuid(),
  collectionType: zod.nativeEnum(CollectionType), // Requisição deve conter valores contidos dentro de CollectionType
  wasteType: zod.nativeEnum(WasteType), // Requisição deve conter valores contidos dentro de WasteType
  tradingType: zod.nativeEnum(TradingType), // Requisição deve conter valores contidos dentro de TradingType
  measurement: zod.nativeEnum(UnitOfMeasurement), // Requisição deve conter valores contidos dentro de UnitOfMeasurement
  quantity: zod.number(),
  unitAmount: zod.number().optional(),
  grossAmount: zod.number().optional(),
  discountAmount: zod.number().optional(),
  netAmount: zod.number().optional(),
  latitude: zod.number().optional(),
  longitude: zod.number().optional(),
});

export class CreateTransactionController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const data = createCollectionTransactionSchemaValidation.parse(
      request.body,
    );
    const repositories = CollectionTransactionFactory.make();
    const service = new CreateTransactionService(repositories);
    const collectionTransaction = await service.execute({
      companyId,
      ...data,
    });

    response.json(collectionTransaction);
  }
}
