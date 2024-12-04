import { AddressEntity } from "@modules/addresses/address";
import { randomUUID } from "crypto";
import { BusinessHourEntity } from "./BusinessHour";
import { Item } from "./Item";

// Todo: Add CompanyType (Ong, Privada, Governamental) -> Não modelado
// Todo: Add TagName (Tipo de empresa, por exemplo, Eco-Ponto, Cooperativa, etc) -> Não modelado
// Todo: Avaliação da empresa (Estrelas) -> Não modelado
// Todo: Add recyclable (Resíduos que a empresa trabalha) [Obrigatório]
// Todo: BusinessHours (Horário de funcionamento) [Obrigatório]
// Todo: Cobrança por descarte do resíduo, por exemplo, Eco-Pontos cobram pelo descarte. [Opcional]

type CompanyEntityConstructor = {
  id?: string;
  cnpj: string;
  stateRegistration: string; // Inscrição Estadual
  status: boolean; // Ativo ou Inativo
  isHeadquarters: boolean; // Matriz ou Filial
  businessName: string; // Nome Fantasia
  corporateName: string; // Razão Social
  email: string;
  phones: string;
  address?: AddressEntity | null;
  startedActivityIn: Date;
  businessHours?: BusinessHourEntity[] | null; // Horário de funcionamento
  wasteItems?: Item[] | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class CompanyEntity {
  id: string;
  cnpj: string;
  stateRegistration: string; // Inscrição Estadual
  status: boolean; // Ativo ou Inativo
  isHeadquarters: boolean; // Matriz ou Filial
  businessName: string; // Nome Fantasia
  corporateName: string; // Razão Social
  email: string;
  phones: string;
  address?: AddressEntity | null;
  startedActivityIn: Date;
  businessHours?: BusinessHourEntity[] | null; // Horário de funcionamento
  wasteItems?: Item[] | null; // Resíduos que a empresa trabalha
  createdAt: Date;
  updatedAt?: Date | null;

  constructor(
    {
      address,
      businessName,
      cnpj,
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
    this.cnpj = cnpj;
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
