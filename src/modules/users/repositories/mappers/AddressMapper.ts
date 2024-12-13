import { AddressEntity } from "@modules/addresses/address";
import { Address } from "@prisma/client";

export class AddressMapper {
  static toDomain(address: Address): AddressEntity {
    return new AddressEntity(
      {
        street: address.street,
        city: address.city,
        state: address.state,
        district: address.district,
        number: address.number,
        stateAcronym: address.stateAcronym,
        zipCode: address.zipCode,
        complement: address.complement,
        latitude: address.latitude,
        longitude: address.longitude,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      },
      address.id,
    );
  }
}
