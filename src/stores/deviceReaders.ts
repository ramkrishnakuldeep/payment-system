import { defineStore, acceptHMRUpdate } from 'pinia';
import type { IReaderDevice } from './deviceReaders.types';
import { ref } from 'vue';
import type { DeviceRedersAPI } from './deviceReaders.types';

export const useDeviceReaderStore = defineStore('deviceReaderStore', () => {

  const deviceReaders = ref<IReaderDevice[]>([]);

  const setPaymentReaders = (data: DeviceRedersAPI[]) => {
    deviceReaders.value = data.map((reader: DeviceRedersAPI) => ({
      ...reader,
      status: reader.status as IReaderDevice['status'] // Ensure status is of type Device
    }) as IReaderDevice);
  };

  return {
    deviceReaders,
    setPaymentReaders
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeviceReaderStore, import.meta.hot));
}
