<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useClinicsStore } from "src/stores/clinics";
import type { IClinic } from "src/stores/clinics.types";

const clinicsStore = useClinicsStore();
const { clinics, currentClinic } = storeToRefs(clinicsStore);
const { setCurrentClinic } = clinicsStore;

const isOpen = ref(false);
const selectedClinic = ref<IClinic>(currentClinic.value);

const selectClinic = (clinic: IClinic) => {
  selectedClinic.value = clinic;
  isOpen.value = false;
  setCurrentClinic(clinic);
};
</script>

<template>
  <div class="dropdown" @click="isOpen = !isOpen">
    <div class="selected">
      <i class="fa-solid fa-location-dot"></i>
      <span class="label">{{ selectedClinic?.name }}</span>
      <span class="arrow" :class="{ open: isOpen }">
        <i class="fa-solid fa-caret-down"></i>
      </span>
    </div>

    <ul v-if="isOpen" class="options">
      <li v-for="clinic in clinics" :key="clinic.id" @click.stop="selectClinic(clinic)"
        :class="{ selected: clinic === selectedClinic }">
        {{ clinic.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 260px;
  background-color: var(--gray-100);
  border-radius: 8px;
  padding: 6px 12px 6px 14px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #111827;

  @media screen and (max-width: 767px) {
    width: 100%;
  }


  .selected {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--gray-100);
    gap: 8px;

    .label {
      flex: 1;
    }

    i {
      color: var(--gray-700);
    }

    .arrow {
      right: 24px;
      transition: transform 0.2s ease;
      color: #6b7280;
      transform: none;

      &.open {
        transform: rotate(180deg);
      }
    }
  }


  .options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-background);
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
    margin: 2px 0 0 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 1px;

    li {
      border-radius: 8px;
      padding: 8px 16px;
      list-style: none;
      cursor: pointer;

      &:hover,
      &.selected {
        background-color: var(--gray-50);
      }
    }
  }
}
</style>
