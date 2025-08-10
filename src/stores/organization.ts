import { defineStore, acceptHMRUpdate } from 'pinia';
import type { OrganizationState } from './organization.types';
import { ref } from 'vue';
import { CONSTANTS } from 'src/utils/constants';

export const useOrganizationStore = defineStore('organizationStore', () => {

  const organization = ref<OrganizationState>({
    id: '',
    name: '',
    totalProcessingFeeFixed: 0,
    totalProcessingFeePercentage: ''
  });

  const totalFeePercent = ref<number>(0);
  const totalFixedFee = ref<number>(0);

  const merchantFixedFee = ref<number>(0);
  const merchantPercentFactor = ref<number>(0);
  const patientFixedFee = ref<number>(0);
  const patientPercentFactor = ref<number>(0);

  const setOrganization = (data: OrganizationState) => {
    organization.value = data;
    totalFeePercent.value = Number(data.totalProcessingFeePercentage);
    totalFixedFee.value = data.totalProcessingFeeFixed;
    resetMerchantFee();
  }

  const resetMerchantFee = () => {
    const mFixed = totalFixedFee.value * CONSTANTS.DEFAULT_MERCHANT_FEE_SPLIT;
    const mPercent = totalFeePercent.value * CONSTANTS.DEFAULT_MERCHANT_FEE_SPLIT;
    setMerchantFee({ mFixed, mPercent });
  }

  const setPatientCardFee = ({ mFixed, mPercent }: { mFixed: number, mPercent: number }) => {
    patientFixedFee.value = totalFixedFee.value - mFixed;
    patientPercentFactor.value = totalFeePercent.value - mPercent;
  }

  const setMerchantFee = ({ mFixed, mPercent }: { mFixed: number, mPercent: number }) => {
    merchantFixedFee.value = mFixed;
    merchantPercentFactor.value = mPercent;
    setPatientCardFee({ mFixed, mPercent });
  }

  return {
    organization,
    totalFeePercent,
    merchantFixedFee,
    merchantPercentFactor,
    patientFixedFee,
    patientPercentFactor,
    totalFixedFee,
    setOrganization,
    resetMerchantFee,
    setMerchantFee
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrganizationStore, import.meta.hot));
}
