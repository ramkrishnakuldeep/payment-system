<script setup lang="ts">

import { useClinicsStore } from 'src/stores/clinics';
import { storeToRefs } from 'pinia';
import { CONSTANTS } from 'src/utils/constants';
import { computed, ref, watch } from 'vue';
import { PaymentMethod } from 'src/utils/enum';
import ReaderDropdown from './ReaderDropdown.vue';
import { asyncComponents } from 'src/utils/asyncComp';
import DialogComponent from 'src/components/DialogComponent.vue'
import { useOrganizationStore } from 'src/stores/organization';
import { formatNumber } from "src/utils/NumberFormat";

const creditCardForm = ref();


const clinicsStore = useClinicsStore();
const organizationStore = useOrganizationStore();
const { currentClinic } = storeToRefs(clinicsStore);
const { resetMerchantFee } = organizationStore

const creditCardDialog = ref(false);
const readerPaymentDialog = ref(false);

const emit = defineEmits(['paymentReceived'])
const props = defineProps<{ transactionAmt: number; paymentMethod: PaymentMethod }>()

const minCashAmt = CONSTANTS.MINIMUM_CASH_AMOUNT;
const isEnoughCash = computed(() => (props.transactionAmt + (props.transactionAmt * currentClinic.value.taxRate)) >= minCashAmt);

const creditCardPayment = () => {
  resetMerchantFee();
  creditCardForm.value.onSubmit(() => {
    // callback function after successfully receiving the payment
    creditCardDialog.value = false;
    emit('paymentReceived');
  })
}
const onProcessPayment = () => {
  readerPaymentDialog.value = false;
  resetMerchantFee();
  emit('paymentReceived');
}

const onCashPayment = () => {
  resetMerchantFee();
  emit('paymentReceived');
}

watch(() => props.transactionAmt, (val) => {
  console.log('transactionAmt updated:', val);
});


</script>

<template>

  <section class="log-payment-container">
    <main class="log-payment-content">
      <div class="current-clinic">
        <i class="fa-solid fa-location-dot"></i>
        <span class="clinic-name">{{ currentClinic?.name }}</span>
      </div>

      <div class="cash-payment" v-if="PaymentMethod.CASH === paymentMethod">
        <button :disabled="!isEnoughCash" @click="onCashPayment">
          <i class="fa-solid fa-money-bill-1-wave"></i>
          {{ $t('logPayment') }}
        </button>
      </div>
      <div class="card-payment" v-else>
        <ReaderDropdown />
        <div class="initial-payment">
          <button class="reader" @click="readerPaymentDialog = true" :disabled="!transactionAmt">
            <i class="fa-solid fa-mobile-screen"></i>
            <div>{{ $t('initiatePaymentOnReader') }}</div>
          </button>
          <button class="manual" @click="creditCardDialog = true" :disabled="!transactionAmt">
            <i class="fa-solid fa-credit-card"></i>
            <div>{{ $t('inputCardNumberManually') }}</div>
          </button>
        </div>
      </div>

    </main>

    <DialogComponent :show-close-icon="false" :show-dialog="readerPaymentDialog" :title="''"
      :action-text="$t('processPayment')" @submit-action="onProcessPayment" @cancelAction="readerPaymentDialog = false">
      <component @process-payment="onProcessPayment" :is="asyncComponents.ReaderPayment" />
    </DialogComponent>

    <DialogComponent :show-dialog="creditCardDialog" :title="'creditCardDetails'"
      :action-text="`${$t('pay')} $${formatNumber(transactionAmt)}`" @submit-action="creditCardPayment"
      @cancelAction="creditCardDialog = false">
      <component ref="creditCardForm" :transAmt="transactionAmt" :is="asyncComponents.EnterCardDetails" />
    </DialogComponent>


  </section>

</template>

<style lang="scss" scoped>
.log-payment-container {
  display: flex;
  padding: 16px;
  width: 100%;
  gap: 12px;
  border-top: 1px solid var(--gray-100);

  .log-payment-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;

    .current-clinic {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      i {
        color: var(--gray-600);
      }

      .clinic-name {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: black;
      }
    }

    .cash-payment {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 24px 0;



      button {
        height: 36px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        gap: 8px;
        font-weight: 600;
        font-size: var(--font-size-sm);
        color: white;
        background-color: var(--orange-400);
        border: none;
        cursor: pointer;

      }
    }

    .card-payment {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;

      .initial-payment {
        padding: 24px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 12px;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          gap: 8px;
          font-weight: 600;
          font-size: var(--font-size-sm);

          border: none;

          &.reader {
            background-color: var(--orange-400);
            color: var(--secondary-text);
          }

          &.manual {
            background-color: var(--orange-50);
            color: var(--orange-400);
          }
        }
      }
    }
  }
}
</style>
