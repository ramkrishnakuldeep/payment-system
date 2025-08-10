<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOrganizationStore } from 'src/stores/organization';
import { ref, computed } from 'vue'
import { formatNumber } from 'src/utils/NumberFormat';

const props = defineProps<{
  amount: number
}>();

const emit = defineEmits(['updatePercent'])


const organizationStore = useOrganizationStore();
const { totalFeePercent, merchantPercentFactor } = storeToRefs(organizationStore);

const processingFeePercent = computed(() => {
  return totalFeePercent.value;
});

function setSlider() {
  merchantPercentFee.value = processingFeePercent.value;
  updateAmount();
}


const step = 0.001
const merchantPercentFee = ref(merchantPercentFactor.value);
const merchantFee = ref(0)


const updateAmount = () => {
  merchantFee.value = props.amount * merchantPercentFee.value;
  emit('updatePercent', merchantPercentFee.value)
}

updateAmount()

defineExpose({ setSlider });

const thumbPosition = computed(() => {
  return formatNumber((merchantPercentFee.value / processingFeePercent.value) * 100)
})
</script>

<template>
  <div class="slider-container">
    <div class="tooltip" :style="{ left: thumbPosition + '%' }">
      <div class="percentage">{{ formatNumber(merchantPercentFee * 100) }}%</div>
      <div class="amount">${{ formatNumber(merchantFee) }}</div>
    </div>
    <input type="range" min="0" :max="totalFeePercent" :step="step" v-model.number="merchantPercentFee"
      @input="updateAmount" class="slider" :style="{ '--val': formatNumber(merchantPercentFee * 100) }" />
    <div class="labels">
      <span>0</span>
      <span>{{ formatNumber(processingFeePercent * 100) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  margin: 60px auto 0;
}

.tooltip {
  position: absolute;
  top: -57px;
  transform: translateX(-50%);
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 6px 10px;
  text-align: center;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.tooltip::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.percentage {
  font-weight: 700;
  font-size: 16px;
}

.amount {
  font-size: 14px;
  color: #6b7280;
}

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 3px;
  outline: none;
  position: relative;
  margin-top: 20px;
  cursor: pointer;
  background: linear-gradient(to right, #3b9797 0%, #3b9797 calc((var(--val) / 3.5) * 100%), #e5e7eb calc((var(--val) / 3.5) * 100%), #e5e7eb 100%);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
  width: 24px;
  background: white;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 1px 0px black;
  cursor: pointer;
  margin-top: 0px;
  position: relative;
  z-index: 2;
}

.slider::-moz-range-thumb {
  height: 24px;
  width: 24px;
  background: white;
  border: 3px solid white;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.labels {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #4b5563;
  margin-top: 8px;
}
</style>
