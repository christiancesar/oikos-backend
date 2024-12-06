import { AddressEntity } from "@modules/addresses/address";
import { BusinessHourEntity } from "../entities/BusinessHour";
import { CompanyEntity } from "../entities/Companies";
import {
  CreateAddressCompaniesDTO,
  CreateBusinessHours,
  CreateCompaniesDTO,
  CreateWasteItemDTO,
  UpdateAddressCompaniesDTO,
  UpdateCompaniesDTO,
} from "./dtos/CompaniesRepositoryDTO";
import { ItemEntity } from "../entities/Item";

export interface ICompaniesRepository {
  createCompany(data: CreateCompaniesDTO): Promise<CompanyEntity>;
  findCompayById(id: string): Promise<CompanyEntity | null>;
  findCompanyByUserId(userId: string): Promise<CompanyEntity | null>;
  findCompanyByIdentity(identity: string): Promise<CompanyEntity | null>;
  listCompaniesByUserId(userId: string): Promise<CompanyEntity[]>;
  updateCompany(profile: UpdateCompaniesDTO): Promise<CompanyEntity>;

  createAddress(data: CreateAddressCompaniesDTO): Promise<AddressEntity>;
  findAddressByCompaniesId(profileId: string): Promise<AddressEntity | null>;
  updateAddress(data: UpdateAddressCompaniesDTO): Promise<AddressEntity>;

  getBusinessHoursByCompanyId(companyId: string): Promise<BusinessHourEntity[]>;
  createBusinessHours(businessHour: CreateBusinessHours): Promise<void>;
  deleteBusinessHoursByCompanyId(companyId: string): Promise<void>;

  createWasteItem(data: CreateWasteItemDTO): Promise<ItemEntity>;
  findWasteItemById(wasteId: string): Promise<ItemEntity | null>;
  deleteWasteItemById(data: {
    wasteId: string;
    companyId: string;
  }): Promise<void>;
  listWasteItemsByCompanyId(companyId: string): Promise<ItemEntity[]>;
}
