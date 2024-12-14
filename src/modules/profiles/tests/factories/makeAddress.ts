import { Optional } from "@common/Optional";
import { AddressEntity } from "@modules/addresses/address";

export function makeAddress(address?: Optional<AddressEntity>): AddressEntity {
  return new AddressEntity({
    street: address?.street ? address?.street : "Rua",
    number: address?.number ? address?.number : "123",
    complement: address?.complement ? address?.complement : "",
    district: address?.district ? address?.district : "Bairro",
    city: address?.city ? address?.city : "Cidade",
    state: address?.state ? address?.state : "Estado",
    stateAcronym: address?.stateAcronym ? address?.stateAcronym : "ES",
    zipCode: address?.zipCode ? address?.zipCode : "12345678",
    latitude: address?.latitude ? address?.latitude : 0,
    longitude: address?.longitude ? address?.longitude : 0,
  });
}
