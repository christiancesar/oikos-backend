import { Optional } from "@common/Optional";
import { makeMaterial } from "@modules/material/factories/makeMaterial";
import { ItemEntity, WasteType } from "../entities/Item";
import { unitOfMeasurement } from "../entities/MeasurementConst";

export function makeWasteItem(wasItem?: Optional<ItemEntity>): ItemEntity {
  return new ItemEntity(
    {
      waste: wasItem?.waste ?? makeMaterial(),
      amount: wasItem?.amount ?? 0,
      unit: wasItem?.unit ?? unitOfMeasurement.KG,
      wasteType: wasItem?.wasteType ?? WasteType.RECYCLABLE,
      createdAt: wasItem?.createdAt ?? new Date(),
    },
    wasItem?.id,
  );
}
