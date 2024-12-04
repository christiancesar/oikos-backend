import { AppError } from "@common/errors/AppError";
import { ItemEntity, WasteType } from "@modules/companies/entities/Item";
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { IMaterialRepository } from "@modules/material/repositories/IMaterialRegistrationRepository";

type CreateWasteItemServiceParams = {
  companyId: string;
  waste: {
    materialId: string;
    amount: number;
    unit: string;
    wasteType: WasteType;
  };
};
export class CreateWasteItemService {
  constructor(
    private companiesRepository: ICompaniesRepository,
    private material: IMaterialRepository,
  ) {}

  async execute({
    companyId,
    waste,
  }: CreateWasteItemServiceParams): Promise<ItemEntity> {
    const company = await this.companiesRepository.findCompayById(companyId);
    if (!company) {
      throw new AppError("Company not found");
    }

    const material = await this.material.findById(waste.materialId);
    if (!material) {
      throw new AppError("Material not found");
    }

    const measurementExist = waste.unit.toUpperCase() in unitOfMeasurement;

    if (!measurementExist) {
      throw new AppError("Unit of measurement not found");
    }
    const item = await this.companiesRepository.createWasteItem({
      companyId,
      waste,
    });

    return item;
  }
}
