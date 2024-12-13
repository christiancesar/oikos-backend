import { AddressEntity } from "@modules/addresses/address";
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
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { MaterialEntity } from "@modules/material/entities/MaterialRegistration";
import { Prisma } from "@prisma/client";

type CompanyPrisma = Prisma.CompanyGetPayload<{
  include: {
    address: true;
    businessHours: {
      include: {
        timeSlots: true;
      };
    };
    wasteItems: {
      include: {
        material: true;
      };
    };
  };
}>;

export class CompaniesMapper {
  static toDomain(company: CompanyPrisma): CompanyEntity {
    const businessHours: BusinessHourEntity[] = company.businessHours.map(
      (businessHour) => {
        return new BusinessHourEntity(
          {
            dayOfWeek:
              DayOfWeek[businessHour.dayOfWeek as keyof typeof DayOfWeek],
            timeSlots: businessHour.timeSlots,
          },
          businessHour.id,
        );
      },
    );

    const address: AddressEntity | null = company.address
      ? new AddressEntity(
          {
            street: company.address?.street,
            number: company.address?.number,
            complement: company.address?.complement,
            district: company.address?.district,
            city: company.address?.city,
            state: company.address?.state,
            stateAcronym: company.address?.stateAcronym,
            zipCode: company.address?.zipCode,
            latitude: company.address?.latitude,
            longitude: company.address?.longitude,
            createdAt: company.address?.createdAt,
            updatedAt: company.address?.updatedAt,
          },
          company.address?.id,
        )
      : company.address;

    const wasteItems: ItemEntity[] = company.wasteItems.map((wasteItem) => {
      return new ItemEntity(
        {
          waste: new MaterialEntity(
            {
              category: wasteItem.material.category,
              name: wasteItem.material.name,
              createdAt: wasteItem.material.createdAt,
              updatedAt: wasteItem.material.updatedAt,
            },
            wasteItem.material.id,
          ),
          wasteType: WasteType[wasteItem.wasteType as keyof typeof WasteType],
          amount: wasteItem.amount,
          unit: unitOfMeasurement[
            wasteItem.unit as keyof typeof unitOfMeasurement
          ],
          createdAt: wasteItem.createdAt,
          updatedAt: wasteItem.updatedAt,
        },
        wasteItem.id,
      );
    });

    return new CompanyEntity(
      {
        identity: company.identity,
        identityType:
          IdentityType[company.identityType as keyof typeof IdentityType],
        companyType:
          CompanyType[company.companyType as keyof typeof CompanyType],
        stateRegistration: company.stateRegistration,
        status: company.status,
        isHeadquarters: company.isHeadquarters,
        businessName: company.businessName,
        corporateName: company.corporateName,
        email: company.email,
        phones: company.phones,
        startedActivityIn: company.startedActivityIn,
        acceptAppointments: company.acceptAppointments,
        address,
        wasteItems,
        businessHours,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
      company.id,
    );
  }

  // static toRepository(company: CompanyEntity): Company {
  //   return company;
  // }
}
