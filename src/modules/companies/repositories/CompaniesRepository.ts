import { AddressEntity } from "@modules/addresses/address";
import { Prisma } from "@prisma/client";
import { prisma } from "prisma";
import { BusinessHourEntity, DayOfWeek } from "../entities/BusinessHour";
import { CompanyEntity } from "../entities/Companies";
import { ItemEntity, WasteType } from "../entities/Item";
import { unitOfMeasurement } from "../entities/MeasurementConst";
import {
  CreateAddressCompaniesDTO,
  CreateBusinessHours,
  CreateCompaniesDTO,
  CreateWasteItemDTO,
  UpdateAddressCompaniesDTO,
  UpdateCompaniesDTO,
} from "./dtos/CompaniesRepositoryDTO";
import {
  ICompaniesRepository,
  SeachWasteItemsResult,
  SearchWasteItemsDTO,
} from "./ICompaniesRepository";
import { CompaniesMapper } from "./mappers/CompaniesMapper";

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
        identity: company.identity,
        identityType: company.identityType,
        companyType: company.companyType,
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
      },
    });

    return CompaniesMapper.toDomain(companyCreated);
  }

  async findCompayById(id: string): Promise<CompanyEntity | null> {
    const company = await prisma.company.findUnique({
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
      },
    });

    return company ? CompaniesMapper.toDomain(company) : null;
  }

  async findCompanyByIdentity(identity: string): Promise<CompanyEntity | null> {
    const company = await prisma.company.findFirst({
      where: {
        identity,
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
      },
    });

    return company ? CompaniesMapper.toDomain(company) : null;
  }

  async listCompaniesByUserId(userId: string): Promise<CompanyEntity[]> {
    const companies = await prisma.company.findMany({
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
      },
    });

    return companies.map((company) => CompaniesMapper.toDomain(company));
  }

  async updateCompany({
    id,
    businessName,
    identity,
    companyType,
    identityType,
    corporateName,
    email,
    acceptAppointments,
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
        identity,
        companyType,
        identityType,
        corporateName,
        acceptAppointments,
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
    return prisma.address.findUnique({
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
              id: timeSlot.id,
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
    const item = await prisma.wasteItem.create({
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

  async findWasteItemById({
    companyId,
    wasteId,
  }: {
    wasteId: string;
    companyId: string;
  }): Promise<ItemEntity | null> {
    const item = await prisma.wasteItem.findUnique({
      where: {
        id: wasteId,
        companyId,
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
    await prisma.wasteItem.delete({
      where: {
        id: data.wasteId,
        companyId: data.companyId,
      },
    });
  }

  async listWasteItemsByCompanyId(companyId: string): Promise<ItemEntity[]> {
    const items = await prisma.wasteItem.findMany({
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

  async searchWasteItemsByCompanyNames({
    company,
    category,
    waste,
    city,
    page,
    perPage,
  }: SearchWasteItemsDTO): Promise<SeachWasteItemsResult> {
    const DEFAULT_PER_PAGE = 10;

    const baseQuery: Prisma.CompanyFindManyArgs = {
      where: {
        AND: [
          {
            address: {
              city,
            },
          },
          // Verifica se o parâmetro "company" foi informado
          company
            ? {
                OR: [
                  {
                    corporateName: {
                      contains: company,
                    },
                  },
                  {
                    businessName: {
                      contains: company,
                    },
                  },
                ],
              }
            : {},

          // Verifica se o parâmetro "waste" ou "category" foi informado
          waste || category
            ? {
                wasteItems: {
                  some: {
                    material: {
                      OR: [
                        waste
                          ? {
                              name: {
                                contains: waste,
                              },
                            }
                          : {},
                        category
                          ? {
                              category: {
                                contains: category,
                              },
                            }
                          : {},
                      ],
                    },
                  },
                },
              }
            : {},
        ],
      },
    };

    const companiesCount = await prisma.company.count({
      ...(baseQuery as Prisma.CompanyCountArgs),
    });

    const currentPerPage = perPage || DEFAULT_PER_PAGE;
    const limit = Math.ceil(companiesCount / currentPerPage);
    const pageLimit = limit === 0 ? 1 : limit;
    const currentPage = page > pageLimit ? pageLimit : page;

    const companies = await prisma.company.findMany({
      ...baseQuery,
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
      },
      orderBy: {
        businessName: "asc",
      },
      skip: (currentPage - 1) * currentPerPage,
      take: currentPerPage,
    });

    return {
      companies: companies.map(CompaniesMapper.toDomain),
      currentPage: page,
      perPage: currentPerPage,
      pageLimit,
      total: companiesCount,
    };
  }
}
