import { Optional } from "@common/Optional";
import { AddressEntity } from "@modules/addresses/address";
import { ProfileEntity } from "@modules/profiles/entities/Profile";

export function makeProfile(profile?: Optional<ProfileEntity>): ProfileEntity {
  return new ProfileEntity(
    {
      firstName: profile?.firstName ? profile?.firstName : "John",
      lastName: profile?.lastName ? profile?.lastName : "Doe",
      phone: profile?.phone ? profile?.phone : "99 9 9999-9999",
      cpf: profile?.cpf ? profile?.cpf : "12345678901",
      address: new AddressEntity({
        street: profile?.address?.street ? profile?.address?.street : "Rua",
        number: profile?.address?.number ? profile?.address?.number : "123",
        complement: profile?.address?.complement
          ? profile?.address?.complement
          : "",
        district: profile?.address?.district
          ? profile?.address?.district
          : "Bairro",
        city: profile?.address?.city ? profile?.address?.city : "Cidade",
        state: profile?.address?.state ? profile?.address?.state : "Estado",
        stateAcronym: profile?.address?.stateAcronym
          ? profile?.address?.stateAcronym
          : "ES",
        zipCode: profile?.address?.zipCode
          ? profile?.address?.zipCode
          : "12345678",
        latitude: profile?.address?.latitude ? profile?.address?.latitude : 0,
        longitude: profile?.address?.longitude
          ? profile?.address?.longitude
          : 0,
      }),
    },
    profile?.id,
  );
}
