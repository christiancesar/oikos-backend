import { WasteType } from "@modules/companies/entities/Item";
import { UnitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { Request, Response } from "express";
import { z } from "zod";
import { CollectionType, TradingType } from "../entities/CollectionTransaction";
import CollectionTransactionFactory from "./factories/CollectionTransactionFactory";
import { CreateTransactionService } from "../services/CreateTransactionService";

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

const createCollectionTransactionSchemaValidation = z.object({
  wasteId: z.string().uuid(),
  collectionType: z.nativeEnum(CollectionType), // Requisição deve conter valores contidos dentro de CollectionType
  wasteType: z.nativeEnum(WasteType), // Requisição deve conter valores contidos dentro de WasteType
  tradingType: z.nativeEnum(TradingType), // Requisição deve conter valores contidos dentro de TradingType
  measurement: z.nativeEnum(UnitOfMeasurement), // Requisição deve conter valores contidos dentro de UnitOfMeasurement
  quantity: z.number(),
  unitAmount: z.number().optional(),
  grossAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  netAmount: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});

export class CreateTransactionController {
  async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
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
