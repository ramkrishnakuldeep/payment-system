<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';

const emit = defineEmits(['processPayment']);

const seconds = ref(5);
const autoInterval = setInterval(() => {
  if (seconds.value === 1) {
    clearInterval(autoInterval);
    onProcessPayment();
  } else {
    seconds.value -= 1;
  }
}, 1000)


const onProcessPayment = () => {
  emit('processPayment');
}

onUnmounted(() => {
  clearInterval(autoInterval);
})

</script>

<template>
  <q-card class="reader-payment">
    <div class="pos-details">
      <img src="src/assets/reader-payment.jpg">
      <div class="review-details">
        <i class="fa-solid fa-eye"></i>
        <span>{{ $t('reviewDetailsWithPatient') }}</span>
      </div>
      <div class="review-desc">
        {{ $t('reviewDetailsWithPatientDescription') }}
      </div>
    </div>
    <div class="processing">
      <button class="auto-processing"> {{ $t('autoProcessing', { seconds }) }} </button>
      <span class="note">{{ $t('orClickProcessPayment', { processPayment: $t('processPayment') }) }}</span>
    </div>
  </q-card>
</template>

<style lang="scss" scoped>
.reader-payment {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  justify-content: center;
  padding: 40px 24px;

  img {
    width: auto;
    height: 150px;
  }

  .pos-details {
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;

    .review-details {
      display: flex;
      gap: 10px;
      justify-content: center;
      align-items: center;
      color: black;
    }

    .review-desc {
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--gray-700);
    }
  }

  .processing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;

    .auto-processing {
      background-color: var(--teal-50);
      border: 1px solid var(--teal-50);
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
    }

    .note {
      font-size: var(--font-size-xss);
    }
  }

}
</style>
