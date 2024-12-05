import { AddressEntity } from "@modules/addresses/address";
import { randomUUID } from "crypto";
import { BusinessHourEntity } from "./BusinessHour";
import { ItemEntity } from "./Item";

// Todo: Add CompanyType (Ong, Privada, Governamental) -> Não modelado
// Todo: Add TagName (Tipo de empresa, por exemplo, Eco-Ponto, Cooperativa, etc) -> Não modelado
// Todo: Avaliação da empresa (Estrelas) -> Não modelado
// Todo: Add recyclable (Resíduos que a empresa trabalha) [Obrigatório]
// Todo: BusinessHours (Horário de funcionamento) [Obrigatório]
// Todo: Cobrança por descarte do resíduo, por exemplo, Eco-Pontos cobram pelo descarte. [Opcional]
export enum IdentityType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export enum CompanyType {
  ONG = "ONG",
  COMPANY = "COMPANY",
  GOVERNMENT = "GOVERNMENT",
  COLLECTOR = "COLLECTOR",
}

type CompanyEntityConstructor = {
  identity: string;
  identityType: IdentityType;
  companyType: CompanyType;
  stateRegistration?: string | null; // Inscrição Estadual
  status: boolean; // Ativo ou Inativo
  isHeadquarters: boolean; // Matriz ou Filial
  businessName?: string | null; // Nome Fantasia
  corporateName: string; // Razão Social
  email?: string | null;
  phones: string;
  address?: AddressEntity | null;
  startedActivityIn: Date;
  businessHours?: BusinessHourEntity[] | null; // Horário de funcionamento
  wasteItems?: ItemEntity[] | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class CompanyEntity {
  id: string;
  identity: string;
  identityType: IdentityType;
  companyType: CompanyType;
  stateRegistration?: string | null; // Inscrição Estadual
  status: boolean; // Ativo ou Inativo
  isHeadquarters: boolean; // Matriz ou Filial
  businessName?: string | null; // Nome Fantasia
  corporateName: string; // Razão Social
  email?: string | null;
  phones: string;
  address?: AddressEntity | null;
  startedActivityIn: Date;
  businessHours?: BusinessHourEntity[] | null; // Horário de funcionamento
  wasteItems?: ItemEntity[] | null; // Resíduos que a empresa trabalha
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    {
      address,
      businessName,
      identity,
      identityType,
      companyType,
      corporateName,
      email,
      isHeadquarters,
      phones,
      startedActivityIn,
      businessHours,
      stateRegistration,
      wasteItems,
      status,
      createdAt,
      updatedAt,
    }: CompanyEntityConstructor,
    id?: string,
  ) {
    this.id = id ?? randomUUID();
    this.identity = identity;
    this.identityType = identityType;
    this.companyType = companyType;
    this.stateRegistration = stateRegistration;
    this.status = status;
    this.isHeadquarters = isHeadquarters;
    this.businessName = businessName;
    this.corporateName = corporateName;
    this.email = email;
    this.phones = phones;
    this.address = address;
    this.startedActivityIn = startedActivityIn;
    this.businessHours = businessHours ?? [];
    this.wasteItems = wasteItems ?? [];
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt;
  }
}
