import { Optional } from "@common/Optional";
import { MaterialEntity } from "../entities/MaterialRegistration";

export function makeMaterial(
  material?: Optional<MaterialEntity>,
): MaterialEntity {
  return new MaterialEntity({
    name: material?.name ? material?.name : "Garrafa PET de água",
    category: material?.category ? material?.category : "plásticos, PET",
    createdAt: new Date(),
  });
}
