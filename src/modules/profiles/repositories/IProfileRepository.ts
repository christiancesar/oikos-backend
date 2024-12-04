import { ProfileEntity } from "../entities/Profile";

export type CreateProfileDTO = {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
};

export type UpdateProfileDTO = {
  userId: string;
  profileId: string;
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
};

export type CreateAddressProfileDTO = {
  profileId: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

export type UpdateAddressProfileDTO = {
  profileId: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

export type CreateOrUpdateDTO = {
  userId: string;
  cpf: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

export interface IProfileRepository {
  createOrUpdate(data: CreateOrUpdateDTO): Promise<ProfileEntity>;
  findByProdileId(id: string): Promise<ProfileEntity | null>;
  findByUserId(userId: string): Promise<ProfileEntity | null>;
}
