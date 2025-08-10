<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <img class="logo" src="src/assets/nitra-logo.svg" :alt="organization.name" loading="lazy">
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">

import organizationData from 'src/mocks/organization.json';
import clinicsData from 'src/mocks/locations.json';
import paymentReaderData from 'src/mocks/paymentReaders.json';
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrganizationStore } from 'src/stores/organization';
import { useClinicsStore } from 'src/stores/clinics';
import { useDeviceReaderStore } from 'src/stores/deviceReaders';

const store = useOrganizationStore();
const clinicsStore = useClinicsStore();
const deviceReaderStore = useDeviceReaderStore();

const { organization } = storeToRefs(store); // state and getters need "storeToRefs"
const { setOrganization } = store;

const { setAllClinics, setCurrentClinic } = clinicsStore;
const { setPaymentReaders } = deviceReaderStore;


onBeforeMount(() => {
  const { id, totalProcessingFeeFixed, totalProcessingFeePercentage, name } = organizationData;
  setOrganization({ id, totalProcessingFeeFixed, totalProcessingFeePercentage, name });

  setAllClinics(clinicsData);
  setPaymentReaders(paymentReaderData);

  const currentClinicRaw = clinicsData[0];

  if (currentClinicRaw) {
    const currentClinic = {
      ...currentClinicRaw,
      taxRate: Number(currentClinicRaw.taxRate)
    };
    setCurrentClinic(currentClinic);
  }

});
</script>

<style lang="scss" scoped>
.logo {
  width: 100px;
}
</style>
