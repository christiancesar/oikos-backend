import { AddressEntity } from "@modules/addresses/address";
import { prisma } from "prisma";
import { BusinessHourEntity, DayOfWeek } from "../entities/BusinessHour";
import { CompanyEntity } from "../entities/Companies";
import {
  CreateAddressCompaniesDTO,
  CreateBusinessHours,
  CreateCompaniesDTO,
  CreateWasteItemDTO,
  UpdateAddressCompaniesDTO,
  UpdateCompaniesDTO,
} from "./dtos/CompaniesRepositoryDTO";
import { CompaniesMapper } from "./mappers/CompaniesMapper";
import { ICompaniesRepository } from "./ICompaniesRepository";
import { ItemEntity, WasteType } from "../entities/Item";
import { unitOfMeasurement } from "../entities/MeasurementConst";

export class CompaniesRepository implements ICompaniesRepository {
  async createCompany({
    userId,
    company,
  }: CreateCompaniesDTO): Promise<CompanyEntity> {
    const companyCreated = await prisma.company.create({
      data: {
        businessName: company.businessName,
        corporateName: company.corporateName,
        phones: company.phones,
        email: company.email,
        cnpj: company.cnpj,
        stateRegistration: company.stateRegistration,
        status: company.status,
        isHeadquarters: company.isHeadquarters,
        startedActivityIn: company.startedActivityIn,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        address: true,
        businessHours: {
          include: {
            timeSlots: true,
          },
        },
        wasteItems: {
          include: {
            material: true,
          },
        },
        user: true,
      },
    });

    return CompaniesMapper.toDomain(companyCreated);
  }

  async findCompayById(id: string): Promise<CompanyEntity | null> {
    const company = await prisma.company.findFirst({
      where: {
        id,
      },
      include: {
        address: true,
        businessHours: {
          include: {
            timeSlots: true,
          },
        },
        wasteItems: {
          include: {
            material: true,
          },
        },
        user: true,
      },
    });

    return company ? CompaniesMapper.toDomain(company) : null;
  }

  async findCompanyByUserId(userId: string): Promise<CompanyEntity | null> {
    const company = await prisma.company.findFirst({
      where: {
        userId,
      },
      include: {
        address: true,
        businessHours: {
          include: {
            timeSlots: true,
          },
        },
        wasteItems: {
          include: {
            material: true,
          },
        },
        user: true,
      },
    });

    return company ? CompaniesMapper.toDomain(company) : null;
  }

  async updateCompany({
    id,
    businessName,
    cnpj,
    corporateName,
    email,
    isHeadquarters,
    phones,
    startedActivityIn,
    stateRegistration,
    status,
  }: UpdateCompaniesDTO): Promise<CompanyEntity> {
    const company = await prisma.company.update({
      where: {
        id,
      },
      data: {
        businessName,
        cnpj,
        corporateName,
        email,
        isHeadquarters,
        phones,
        startedActivityIn,
        stateRegistration,
        status,
      },
      include: {
        address: true,
        businessHours: {
          include: {
            timeSlots: true,
          },
        },
        wasteItems: {
          include: {
            material: true,
          },
        },
        user: true,
      },
    });

    return CompaniesMapper.toDomain(company);
  }

  async createAddress({
    address,
    companyId,
  }: CreateAddressCompaniesDTO): Promise<AddressEntity> {
    return prisma.address.create({
      data: {
        company: {
          connect: {
            id: companyId,
          },
        },
        street: address.street,
        number: address.number,
        complement: address.complement,
        district: address.district,
        city: address.city,
        state: address.state,
        stateAcronym: address.stateAcronym,
        zipCode: address.zipCode,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  }

  async findAddressByCompaniesId(
    companyId: string,
  ): Promise<AddressEntity | null> {
    return prisma.address.findFirst({
      where: {
        companyId,
      },
    });
  }

  async updateAddress(data: UpdateAddressCompaniesDTO): Promise<AddressEntity> {
    return prisma.address.update({
      where: {
        companyId: data.companyId,
      },
      data: {
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        district: data.address.district,
        city: data.address.city,
        state: data.address.state,
        stateAcronym: data.address.stateAcronym,
        zipCode: data.address.zipCode,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
    });
  }

  async getBusinessHoursByCompanyId(
    companyId: string,
  ): Promise<BusinessHourEntity[]> {
    const businessHour = await prisma.businessHour.findMany({
      where: {
        companyId,
      },
      include: {
        timeSlots: true,
      },
    });

    return businessHour.map(
      (day) =>
        new BusinessHourEntity(
          {
            dayOfWeek: DayOfWeek[day.dayOfWeek as keyof typeof DayOfWeek],
            timeSlots: day.timeSlots.map((timeSlot) => ({
              startTime: timeSlot.startTime,
              endTime: timeSlot.endTime,
            })),
          },
          day.id,
        ),
    );
  }

  async createBusinessHours({
    companyId,
    businessHours,
  }: CreateBusinessHours): Promise<void> {
    await prisma.businessHour.create({
      data: {
        dayOfWeek: businessHours.dayOfWeek,
        timeSlots: {
          createMany: {
            data: businessHours.timeSlots,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  async deleteBusinessHoursByCompanyId(companyId: string): Promise<void> {
    await prisma.businessHour.deleteMany({
      where: {
        companyId,
      },
    });
  }

  async createWasteItem(data: CreateWasteItemDTO): Promise<ItemEntity> {
    const item = await prisma.item.create({
      data: {
        amount: data.waste.amount,
        unit: data.waste.unit,
        wasteType: data.waste.wasteType,
        material: {
          connect: {
            id: data.waste.materialId,
          },
        },
        company: {
          connect: {
            id: data.companyId,
          },
        },
      },
      include: {
        material: true,
      },
    });

    return new ItemEntity(
      {
        amount: item.amount,
        unit: unitOfMeasurement[item.unit as keyof typeof unitOfMeasurement],
        wasteType: WasteType[item.wasteType as keyof typeof WasteType],
        waste: item.material,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
      item.id,
    );
  }

  async findWasteItemById(wasteId: string): Promise<ItemEntity | null> {
    const item = await prisma.item.findFirst({
      where: {
        id: wasteId,
      },
      include: {
        material: true,
      },
    });

    return item
      ? new ItemEntity(
          {
            amount: item.amount,
            unit: unitOfMeasurement[
              item.unit as keyof typeof unitOfMeasurement
            ],
            wasteType: WasteType[item.wasteType as keyof typeof WasteType],
            waste: item.material,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
          item.id,
        )
      : null;
  }

  async deleteWasteItemById(data: {
    wasteId: string;
    companyId: string;
  }): Promise<void> {
    await prisma.item.delete({
      where: {
        id: data.wasteId,
        companyId: data.companyId,
      },
    });
  }

  async listWasteItemsByCompanyId(companyId: string): Promise<ItemEntity[]> {
    const items = await prisma.item.findMany({
      where: {
        companyId,
      },
      include: {
        material: true,
      },
    });

    return items.map(
      (item) =>
        new ItemEntity(
          {
            amount: item.amount,
            unit: unitOfMeasurement[
              item.unit as keyof typeof unitOfMeasurement
            ],
            wasteType: WasteType[item.wasteType as keyof typeof WasteType],
            waste: item.material,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          },
          item.id,
        ),
    );
  }
}
