export type CreateCompaniesDTO = {
  userId: string;
  company: {
    identity: string;
    identityType: string;
    acceptAppointments: boolean;
    companyType: string;
    stateRegistration?: string | null;
    status: boolean;
    isHeadquarters: boolean;
    businessName?: string | null;
    corporateName: string;
    email?: string | null;
    phones: string;
    startedActivityIn: Date;
  };
};

export type UpdateCompaniesDTO = {
  id: string;
  identity: string;
  identityType: string;
  companyType: string;
  stateRegistration?: string | null;
  acceptAppointments: boolean;
  status: boolean;
  isHeadquarters: boolean;
  businessName?: string | null;
  corporateName: string;
  email?: string | null;
  phones: string;
  startedActivityIn: Date;
};

export type CreateAddressCompaniesDTO = {
  companyId: string;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type UpdateAddressCompaniesDTO = {
  companyId: string;
  address: {
    street: string;
    number: string;
    complement?: string | null;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type CreateBusinessHours = {
  companyId: string;
  businessHours: {
    dayOfWeek: string;
    timeSlots: {
      startTime: string;
      endTime: string;
    }[];
  };
};

export type CreateGarbageDisposalDTO = {
  companyId: string;
  garbageDisposal: {
    materialId: string;
    materialName: string;
    materialCategory: string;
    amount: number;
    unit: string;
  };
};

export type DelteGarbageDisposalDTO = {
  companyId: string;
  garbageDisposalId: string;
};

export type CreateRecyclableDTO = {
  companyId: string;
  recyclable: {
    materialId: string;
    materialName: string;
    materialCategory: string;
    amount: number;
    unit: string;
  };
};

export type DelteRecyclableDTO = {
  companyId: string;
  recyclableId: string;
};

export type CreateWasteItemDTO = {
  companyId: string;
  waste: {
    materialId: string;
    amount: number;
    unit: string;
    wasteType: string;
  };
};
