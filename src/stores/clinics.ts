import { defineStore, acceptHMRUpdate } from 'pinia';
import type { IClinicsAPI, IClinic } from './clinics.types';
import { ref } from 'vue';

export const useClinicsStore = defineStore('clinicsStore', () => {

  const clinics = ref<IClinic[]>([]);

  const currentClinic = ref<IClinic>({ id: '', name: '', taxRate: 0 });

  const setAllClinics = (data: IClinicsAPI[]) => {
    clinics.value = data.map((clinic: IClinicsAPI) => {
      return {
        id: clinic.id,
        name: clinic.name,
        taxRate: Number(clinic.taxRate)
      } as IClinic;
    });
  };

  const setCurrentClinic = (clinic: IClinic) => {
    const tempData: IClinic = { ...clinic, taxRate: Number(clinic.taxRate) };
    currentClinic.value = tempData;
  };

  return {
    currentClinic,
    clinics,
    setCurrentClinic,
    setAllClinics
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClinicsStore, import.meta.hot));
}
