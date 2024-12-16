import { AddressEntity } from "@modules/addresses/address";
import { makeAddress } from "@modules/addresses/factories/makeAddress";
import {
  BusinessHourEntity,
  DayOfWeek,
} from "@modules/companies/entities/BusinessHour";
import {
  CompanyEntity,
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";
import { ItemEntity, WasteType } from "@modules/companies/entities/Item";
import { makeWasteItem } from "@modules/companies/factories/makeWasteItem";
import {
  CreateAddressCompaniesDTO,
  CreateBusinessHours,
  CreateCompaniesDTO,
  CreateWasteItemDTO,
  UpdateAddressCompaniesDTO,
  UpdateCompaniesDTO,
} from "../dtos/CompaniesRepositoryDTO";
import {
  ICompaniesRepository,
  SearchWasteItemsDTO,
} from "../ICompaniesRepository";
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { makeMaterial } from "@modules/material/factories/makeMaterial";

type CompanyInMemory = CompanyEntity & {
  userId: string;
};
export class CompaniesRepositoryInMemory implements ICompaniesRepository {
  private companies: CompanyInMemory[] = [];
  async createCompany({
    userId,
    company,
  }: CreateCompaniesDTO): Promise<CompanyEntity> {
    const companyCreated = new CompanyEntity({
      acceptAppointments: company.acceptAppointments,
      companyType: company.companyType as CompanyType,
      corporateName: company.corporateName,
      businessName: company.businessName,
      identityType: company.identityType as IdentityType,
      identity: company.identity,
      isHeadquarters: company.isHeadquarters,
      phones: company.phones,
      startedActivityIn: company.startedActivityIn,
      status: company.status,
      address: null,
      email: company.email,
      stateRegistration: company.stateRegistration,
      businessHours: null,
      wasteItems: null,
      createdAt: new Date(),
    });

    const companyIndex = this.companies.push({ ...companyCreated, userId });

    return this.companies[companyIndex - 1];
  }

  async findCompayById(id: string): Promise<CompanyEntity | null> {
    const company = this.companies.find((company) => company.id === id);
    return company || null;
  }

  async findCompanyByUserId(userId: string): Promise<CompanyEntity | null> {
    const company = this.companies.find((company) => company.userId === userId);
    return company || null;
  }

  async findCompanyByIdentity(identity: string): Promise<CompanyEntity | null> {
    const companyIndex = this.companies.findIndex(
      (company) => company.identity === identity,
    );

    return this.companies[companyIndex] || null;
  }

  async listCompaniesByUserId(userId: string): Promise<CompanyEntity[]> {
    const companiesByUser = this.companies.filter(
      (company) => company.userId === userId,
    );

    return companiesByUser;
  }

  async updateCompany(data: UpdateCompaniesDTO): Promise<CompanyEntity> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.id,
    );

    Object.assign(this.companies[companyIndex], data);

    return this.companies[companyIndex];
  }

  async createAddress(data: CreateAddressCompaniesDTO): Promise<AddressEntity> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.companyId,
    );

    Object.assign<CompanyEntity, CompanyEntity>(this.companies[companyIndex], {
      ...this.companies[companyIndex],
      address: makeAddress({ ...data.address }),
    });

    return this.companies[companyIndex].address!;
  }

  async findAddressByCompaniesId(
    comapanyId: string,
  ): Promise<AddressEntity | null> {
    const company = this.companies.find((company) => company.id === comapanyId);

    return company ? company.address! : null;
  }

  async updateAddress(data: UpdateAddressCompaniesDTO): Promise<AddressEntity> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.companyId,
    );

    Object.assign<CompanyEntity, CompanyEntity>(this.companies[companyIndex], {
      ...this.companies[companyIndex],
      address: makeAddress({ ...data.address }),
    });

    return this.companies[companyIndex].address!;
  }

  async getBusinessHoursByCompanyId(
    companyId: string,
  ): Promise<BusinessHourEntity[]> {
    const company = this.companies.find((company) => company.id === companyId);

    return company ? company.businessHours! : [];
  }

  async createBusinessHours(data: CreateBusinessHours): Promise<void> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.companyId,
    );

    this.companies[companyIndex].businessHours?.push(
      new BusinessHourEntity({
        dayOfWeek: data.businessHours.dayOfWeek as DayOfWeek,
        timeSlots: data.businessHours.timeSlots,
      }),
    );

    Object.assign<CompanyEntity, CompanyEntity>(this.companies[companyIndex], {
      ...this.companies[companyIndex],
    });
  }

  async deleteBusinessHoursByCompanyId(companyId: string): Promise<void> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === companyId,
    );

    this.companies[companyIndex].businessHours = [];
  }

  async createWasteItem(data: CreateWasteItemDTO): Promise<ItemEntity> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.companyId,
    );

    const wasteItemIndex = this.companies[companyIndex].wasteItems?.push(
      makeWasteItem({
        unit: unitOfMeasurement[
          data.waste.unit as keyof typeof unitOfMeasurement
        ],
        amount: data.waste.amount,
        waste: makeMaterial({
          id: data.waste.materialId,
        }),
        wasteType: data.waste.wasteType as WasteType,
      }),
    );

    return this.companies[companyIndex].wasteItems![wasteItemIndex! - 1];
  }

  async findWasteItemById({
    companyId,
    wasteId,
  }: {
    wasteId: string;
    companyId: string;
  }): Promise<ItemEntity | null> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === companyId,
    );

    const wasteItem = this.companies[companyIndex].wasteItems?.find(
      (wasteItem) => wasteItem.id === wasteId,
    );

    return wasteItem || null;
  }

  async deleteWasteItemById(data: {
    wasteId: string;
    companyId: string;
  }): Promise<void> {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === data.companyId,
    );
    this.companies[companyIndex].wasteItems = this.companies[
      companyIndex
    ].wasteItems?.filter((wasteItem) => wasteItem.id !== data.wasteId);
  }

  async listWasteItemsByCompanyId(companyId: string): Promise<ItemEntity[]> {
    const company = this.companies.find((company) => company.id === companyId);
    return company ? company.wasteItems! : [];
  }

  async searchWasteItemsByCompanyNames({
    category,
    company,
    waste,
  }: SearchWasteItemsDTO): Promise<CompanyEntity[]> {
    const categoryIsEmpty = category.trim() === "";
    const companyIsEmpty = company.trim() === "";
    const wasteIsEmpty = waste.trim() === "";
    let companies: CompanyEntity[] = [];

    const allFieldsAreEmpty = categoryIsEmpty && companyIsEmpty && wasteIsEmpty;
    if (allFieldsAreEmpty) {
      return this.companies;
    }

    if (!allFieldsAreEmpty) {
      companies = this.companies.filter((company) =>
        company.wasteItems?.some(
          (wasteItem) =>
            wasteItem.waste.category.toLowerCase() === category.toLowerCase() ||
            wasteItem.waste.name.toLowerCase() === waste.toLowerCase(),
        ),
      );
    }

    if (!companyIsEmpty) {
      companies = this.companies.filter(
        (c) =>
          c.corporateName.toLowerCase().includes(company.toLowerCase()) ||
          c.businessName?.toLowerCase().includes(company.toLowerCase()),
      );
    }

    if (!categoryIsEmpty) {
      companies = this.companies.filter((company) =>
        company.wasteItems?.some(
          (wasteItem) =>
            wasteItem.waste.category.toLowerCase() === category.toLowerCase(),
        ),
      );
    }

    if (!wasteIsEmpty) {
      companies = this.companies.filter((company) =>
        company.wasteItems?.some(
          (wasteItem) =>
            wasteItem.waste.name.toLowerCase() === waste.toLowerCase(),
        ),
      );
    }

    return companies;
  }
}
