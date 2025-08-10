<script setup lang="ts">
import type { IReaderDevice } from 'src/stores/deviceReaders.types'
import { computed, ref, watch } from 'vue'
import { useDeviceReaderStore } from 'src/stores/deviceReaders'
import { useClinicsStore } from 'src/stores/clinics';

import { storeToRefs } from 'pinia';
import { DeviceStatus } from 'src/utils/enum';
const deviceReaderStore = useDeviceReaderStore();
const clinicsStore = useClinicsStore();
const { currentClinic } = storeToRefs(clinicsStore);
const { deviceReaders } = storeToRefs(deviceReaderStore);

const clinicReaders = computed(() => deviceReaders.value.filter((reader) => reader.locationId === currentClinic.value.id)); // Assuming clinicId 1 for demo

const open = ref(false)

const selectedDevice = ref<IReaderDevice | undefined>(clinicReaders.value[0])

function selectDevice(device: IReaderDevice) {
  selectedDevice.value = device;
  open.value = false;
}

function toggleOpen() {
  open.value = !open.value
}

watch(currentClinic, () => {
  if (clinicReaders.value.length) {
    selectedDevice.value = clinicReaders.value[0]
  } else {
    selectedDevice.value = undefined
  }
}, { immediate: true })

</script>

<template>
  <div class="device-reader">
    <div class="options" :class="{ 'open': open }" @click="toggleOpen">
      <div class="header">
        <div class="subtitle">Device Reader</div>
        <div class="title">{{ selectedDevice?.label }}</div>
      </div>
      <span class="chevron" :class="{ 'open': open }"><i class="fa-solid fa-caret-down"></i></span>
    </div>
    <transition name="fade">
      <div v-if="open" class="device-list">
        <div v-for="device in clinicReaders" :key="device.id" class="device-row" :class="{
          active: selectedDevice?.id === device.id,
          disabled: device.status === DeviceStatus.OFFLINE,
          [device.status.toLowerCase()]: true
        }" @click="selectDevice(device)">
          <span class="status" :class="device.status">
            <template v-if="device.status === DeviceStatus.ONLINE">
              <!-- Green dot -->
              <span class="dot"></span>
            </template>
            <template v-else>
              <!-- Gray X -->
              <span class="cross"> <i class="fa-solid fa-circle-xmark"></i> </span>
            </template>
          </span>
          <span class="name">{{ device.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>



<style lang="scss" scoped>
.device-reader {

  width: 100%;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 14px;
  position: relative;

  z-index: 2;
}

.options {
  padding: 8px 16px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  position: relative;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--gray-0);
  border: 2px solid var(--gray-0);


  &.open {
    border-bottom: 2px solid var(--teal-700);
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;

    .subtitle {
      color: var(--gray-600);
      font-size: var(--font-size-xss);
      font-weight: 500;
      line-height: 12px;
    }

    .title {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: black;
      line-height: 18px;
    }
  }
}



.chevron {
  right: 24px;
  top: 32px;
  font-size: 20px;
  color: #909c9b;
  transition: transform 0.25s;
  pointer-events: none;
}

.chevron {
  transform: none;
}

.chevron.open {
  transform: rotate(180deg);
}

.device-list {
  margin-top: 4px;
  padding: 8px;
  background: var(--primary-background);
  border: 1px solid var(--gray-0);
  border-radius: 8px;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1px;
}

.device-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: var(--font-size-sm);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.16s;
  font-weight: 500;
  gap: 16px;

  &.active {
    background: var(--gray-50);
    color: var(--gray-800);
  }

  &.online {
    .status {
      background: var(--green-200);
    }
  }

  &.offline {
    color: var(--gray-400);
    cursor: not-allowed;

    .status {
      background: var(--gray-700);
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    opacity: 0.8;
    border-radius: 50%;
  }
}



.device-row:not(.disabled):hover {
  background: var(--gray-50);
}



.dot {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: var(--green-500);
  display: inline-block;
}

.cross {
  color: var(--gray-400);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  display: inline-block;
}

.name {
  flex: 1;
  line-height: 17px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}
</style>
