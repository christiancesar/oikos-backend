import { WasteType } from "@modules/companies/entities/Item";
import { UnitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { Request, Response } from "express";
import * as zod from "zod";
import { CollectionType, TradingType } from "../entities/CollectionTransaction";
import { UpdateTransactionService } from "../service/UpdateTransactionService";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";

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

const updateCollectionTransactionSchemaValidation = zod.object({
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

const updateTransactionParamsSchemaValidation = zod.object({
  companyId: zod.string().uuid(),
  transactionId: zod.string().uuid(),
});

export class UpdateTransactionController {
  async handle(request: Request, response: Response) {
    const { companyId, transactionId } =
      updateTransactionParamsSchemaValidation.parse(request.params);
    const data = updateCollectionTransactionSchemaValidation.parse(
      request.body,
    );
    const repositories = CollectionTransactionFactory.make();
    const service = new UpdateTransactionService(repositories);
    const collectionTransaction = await service.execute({
      companyId,
      transactionId,
      ...data,
    });

    response.json(collectionTransaction);
  }
}
