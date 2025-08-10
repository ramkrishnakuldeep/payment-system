<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import PaymentSummary from 'src/components/PaymentSummary.vue';
import ClicnicDropdown from 'src/components/ClicnicDropdown.vue';

const rawAmount = ref<number>(0);

const $q = useQuasar()

const onResetPayment = () => {
  rawAmount.value = 0;
}

const onPaymentSuccess = () => {
  $q.notify({
    message: 'Payment successful',
    color: 'purple'
  });
  onResetPayment();
}

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.value === '') {
    rawAmount.value = 0;
  } else {
    rawAmount.value = Number(target.value);
  }
}

</script>

<template>

  <q-page class="payments-page">
    <section class="payment-header">
      <div class="payment-title-container">
        <h6 class="payment-title"> {{ $t('collectPayment') }} </h6>
        <div class="clinic-select-desktop">
          <ClicnicDropdown />
        </div>
      </div>
      <div class="reset-payment" v-show="rawAmount > 0" @click="onResetPayment">
        {{ $t('resetPayment') }}
      </div>
    </section>

    <div class="clinic-select-mobile">
      <ClicnicDropdown />
    </div>


    <section class="payment-content">
      <div class="amount-container">
        <div class="amount-input-container">
          <label class="label">Enter Amount</label>
          <div class="amount-display">
            <span class="prefix">$</span>
            <input type="number" @input="onInput" :min="0" v-model="rawAmount" class="amount-input" />
          </div>
        </div>
        <textarea name="amount description" id="" :placeholder="$t('descriptionOptional')"></textarea>
      </div>
      <div class="summary-container">
        <div class="summary-title">
          {{ $t('summary') }}
        </div>
        <PaymentSummary :amount="rawAmount" @paymentSucceed="onPaymentSuccess" />
      </div>
    </section>

  </q-page>

</template>

<style lang="scss" scoped>
.payments-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  gap: 16px;

  @media screen and (max-width: 767px) {
    gap: 12px;
    padding: 16px;

  }



  .clinic-select-mobile {

    display: none;

    @media screen and (max-width: 767px) {
      display: block;
    }
  }

  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .payment-title-container {
      display: flex;
      align-items: center;
      gap: 40px;

      @media screen and (max-width: 767px) {
        padding: 8px 0;
      }

      @media screen and (max-width: 767px) {
        .clinic-select-desktop {
          display: none;
        }

      }

      .payment-title {
        font-weight: 700;
        font-size: var(--font-size-2xl);
        line-height: 100%;
        color: var(--primary-text);
      }
    }

    .reset-payment {
      display: flex;
      align-items: center;

      font-weight: 500;
      text-transform: capitalize;
      color: var(--red-400);
      font-size: var(--font-size-sm);

    }

  }

  .payment-content {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid var(--gray-100);
    border-radius: 8px;

    >div {
      @media screen and (max-width: 767px) {
        &:not(:last-child) {
          border-bottom: 1px solid var(--gray-100);
        }
      }

      @media screen and (min-width: 770px) {
        &:not(:last-child) {
          border-right: 1px solid var(--gray-100);
        }

      }
    }

    .amount-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 60px;
      align-items: center;
      padding: 100px 20px;

      .amount-input-container {
        display: flex;
        flex-direction: column;
        align-items: center;

        .label {
          color: var(--gray-700);
          font-size: var(--font-size-lg);
          margin-bottom: 8px;
          font-weight: 500;
          line-height: 13px;
        }

        .amount-display {
          display: flex;
          align-items: baseline;
          font-size: 64px;
          font-weight: bold;
          position: relative;

          .prefix {
            font-size: var(--font-size-2xl);
            position: absolute;
            left: -25px;
            top: 5px;
          }

          .amount-input {
            font-size: 64px;
            font-weight: bold;
            border: none;
            outline: none;
            width: 200px;
            text-align: center;
            line-height: 65px;
          }
        }

      }

      textarea {
        padding: 8px;
        border-radius: 8px 8px 0 0;
        font-size: var(--font-size-sm2);
        resize: none;
        font-weight: 500;
        height: 100px;
        color: var(--gray-600);
        width: 100%;
        max-width: 400px;
        border: 1px solid var(--grey-0);
        background-color: var(--gray-0);
      }

    }

    .summary-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 360px;
      font-weight: 500;

      @media screen and (max-width: 767px) {
        width: 100%;
      }

      >div {
        padding: 16px 8px;

        &:not(:last-child) {
          border-bottom: 1px solid var(--gray-100);
        }
      }

      .summary-title {
        padding: 16px;
        font-weight: 700;
        font-size: var(--font-size-md);
        width: 100%;
        color: black;
      }
    }

  }


}
</style>
