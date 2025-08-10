<script setup lang="ts">
import { computed, ref } from 'vue';
import ProcessingFee from './ProcessingFee.vue';
import LogPayment from 'src/components/LogPayment.vue';

import { useClinicsStore } from 'src/stores/clinics';
import { useOrganizationStore } from 'src/stores/organization';
import { storeToRefs } from 'pinia';
import { PaymentMethod } from 'src/utils/enum';
import { CONSTANTS } from 'src/utils/constants';
import DialogComponent from 'src/components/DialogComponent.vue'

const clinicsStore = useClinicsStore();
const organizationStore = useOrganizationStore();
const { patientFixedFee, patientPercentFactor } = storeToRefs(organizationStore);
const { setMerchantFee } = organizationStore

const emit = defineEmits(['paymentSucceed'])

const { currentClinic } = storeToRefs(clinicsStore);

const props = defineProps<{ amount: number; }>()

const processingFeeRef = ref<InstanceType<typeof ProcessingFee> | null>(null);

const minCashAmt = CONSTANTS.MINIMUM_CASH_AMOUNT;

const dialog = ref(false);
const paymentMethod = ref<PaymentMethod>(PaymentMethod.CASH);

const taxRate = computed(() => currentClinic.value?.taxRate || 0);

const totalTax = computed(() => props.amount * taxRate.value);

const totalAmount = computed(() => props.amount + totalTax.value);

const cardProcessingFee = computed(() => {
  return (totalAmount.value * patientPercentFactor.value) + (props.amount ? patientFixedFee.value : 0);
});

const onFeeUpdate = () => {
  if (processingFeeRef.value) {
    const { mFixed, mPercent } = processingFeeRef.value.getMerchantPercent();
    setMerchantFee({ mFixed, mPercent })
    dialog.value = false;
  }
}

const cardAmount = computed(() => totalAmount.value + cardProcessingFee.value);
const overallTotal = computed(() => paymentMethod.value === PaymentMethod.CARD ? cardAmount.value : totalAmount.value)
const amountStatusClass = computed(() => overallTotal.value > minCashAmt ? 'green' : 'red')

</script>
<template>

  <section class="amount-summary">
    <div class="amount">
      <div class="sub-total">
        <span>{{ $t("subTotal") }}</span>
        <span>$<span v-number-format="amount" /></span>
      </div>
      <div class="tax">
        <span>{{ $t("tax", { taxRate }) }}</span>
        <span>$<span v-number-format="totalTax" /></span>
      </div>
    </div>
    <div class="total-container">
      <div class="total">
        <span>{{ $t("total") }}</span>
        <span>$<span v-number-format="totalAmount" /></span>
      </div>
      <div class="payment-method">
        <button :class="{ 'active': paymentMethod === PaymentMethod.CASH }" @click="paymentMethod = PaymentMethod.CASH">
          <i class="fa-solid fa-sack-dollar"></i> {{ $t("payByCash") }}
          <span class="amt-val">$<span v-number-format="totalAmount" /></span>
        </button>
        <button :class="{ 'active': paymentMethod === PaymentMethod.CARD }" @click="paymentMethod = PaymentMethod.CARD">
          <i class="fa-solid fa-credit-card"></i> {{ $t("payByCard") }}
          <span class="amt-val">$<span v-number-format="cardAmount" /></span>
        </button>
      </div>
      <div class="processing-fee" v-show="paymentMethod === PaymentMethod.CARD">
        <div class="processing-fee-label">
          {{ $t('patientCardProcessingFee') }}
        </div>
        <span class="amt-val">$<span v-number-format="cardProcessingFee" /> <i @click="dialog = true"
            class="fa-solid fa-pen-to-square"></i> </span>
      </div>
    </div>
    <div class="total-amount">
      <div class="payment-by">
        <span> {{ $t(paymentMethod) }} {{ $t('total') }} </span>
        <span :class="['amount-val', amountStatusClass]"> $<span v-number-format="overallTotal" /></span>
      </div>
      <span v-if="totalAmount < minCashAmt" class="amount-warning">{{
        $t('minimumTotalAmount', { minAmt: minCashAmt }) }}</span>
    </div>

    <DialogComponent :show-dialog="dialog" :title="'editMerchantProcessingFee'" :action-text="`${$t('update')}`"
      @submit-action="onFeeUpdate" @cancelAction="dialog = false">
      <ProcessingFee ref="processingFeeRef" :transactionAmount="totalAmount" />
    </DialogComponent>

  </section>
  <LogPayment :transactionAmt="overallTotal" :paymentMethod="paymentMethod"
    @paymentReceived="() => emit('paymentSucceed')" />
</template>
<style lang="scss" scoped>
.amount-summary {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--gray-700);
  padding: 16px;

  >div {
    width: 100%;
  }

  .amount {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--teal-700);

    .sub-total,
    .tax {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 36px;

      span {
        font-size: var(--font-size-xs);
        font-weight: 500;
        color: var(--gray-700);
      }
    }
  }

  .total-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 0 24px;
    border-bottom: 1px solid var(--teal-700);

    .total {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 24px 16px;
      font-weight: bold;

      span {
        font-size: var(--font-size-xs);
        font-weight: 500;
        color: black;
      }
    }

    .payment-method {
      display: flex;
      justify-content: space-between;
      width: 100%;
      border: 1px solid var(--teal-100);
      border-radius: 9px;


      button {
        cursor: pointer;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: none;
        width: 50%;
        font-weight: 500;
        background-color: transparent;
        font-size: var(--font-size-xss);
        color: var(--teal-700);
        width: 100%;

        &:first-child {
          border-radius: 8px 0 0 8px;
        }

        &:last-child {
          border-radius: 0 8px 8px 0;
        }


        &.active,
        &:hover {
          background-color: var(--teal-100);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .amt-val {
          font-weight: 600;
        }
      }
    }

    .processing-fee {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 24px 16px 0;
      color: var(--gray-700);
      font-size: var(--font-size-xs);
      font-weight: 500;

      .processing-fee-label {
        display: flex;
        align-items: center;


      }

      .amt-val {
        i {
          color: var(--teal-400);
          margin-left: 8px;
          cursor: pointer;
        }
      }
    }

  }

  .total-amount {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px 16px 16px;
    position: relative;

    .payment-by {
      display: flex;
      align-items: center;
      justify-content: center;
      justify-content: space-between;
      width: 100%;
      font-weight: 700;

      font-size: var(--font-size-xs);
      color: black;

      span.amount-val {
        font-size: var(--font-size-xl);
        font-weight: bold;

        &.green {
          color: var(--green-500);
        }

        &.red {
          color: var(--red-500);
        }
      }
    }

    .amount-warning {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      color: var(--red-500);
      font-size: var(--font-size-xss);
    }
  }

}
</style>
