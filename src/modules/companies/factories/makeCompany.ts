import { Optional } from "@common/Optional";
import {
  CompanyEntity,
  CompanyType,
  IdentityType,
} from "../entities/Companies";
import { makeAddress } from "@modules/addresses/factories/makeAddress";
import { makeBusinessHoursDefault } from "./makeBusinessHours";
import { makeWasteItem } from "./makeWasteItem";

export function makeCompany(company?: Optional<CompanyEntity>): CompanyEntity {
  return new CompanyEntity({
    acceptAppointments: company?.acceptAppointments ?? false,
    companyType: company?.companyType ?? CompanyType.COMPANY,
    corporateName: company?.corporateName ?? "Oikos ltda",
    businessName: company?.businessName ?? "Oikos",
    identityType: company?.identityType ?? IdentityType.CNPJ,
    identity: company?.identity ?? "99999999999999",
    isHeadquarters: company?.isHeadquarters ?? true,
    phones: company?.phones ?? "(99) 9 9999-9999",
    startedActivityIn: company?.startedActivityIn ?? new Date(),
    status: company?.status ?? true,
    address: company?.address ?? makeAddress(),
    email: company?.email ?? "oikos@oikos.com",
    stateRegistration: company?.stateRegistration ?? "999999999",
    businessHours: company?.businessHours ?? makeBusinessHoursDefault(),
    wasteItems: company?.wasteItems ?? [makeWasteItem(), makeWasteItem()],
    createdAt: company?.createdAt ?? new Date(),
  });
}
