export type IClinicsAPI = {
  id: string | number;
  name: string;
  taxRate: string;
}

export type IClinic = Omit<IClinicsAPI, 'taxRate'> & {
  taxRate: number;
};

