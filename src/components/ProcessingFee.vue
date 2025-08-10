<script setup lang="ts">
import { computed, ref } from "vue";
import { useOrganizationStore } from "src/stores/organization";
import { storeToRefs } from "pinia";
import SliderComponent from "./SliderComponent.vue";
import { formatNumber } from "src/utils/NumberFormat";

const props = defineProps<{ transactionAmount: number }>();

const sliderRef = ref<InstanceType<typeof SliderComponent> | null>(null);

const organizationStore = useOrganizationStore();
const {
  merchantFixedFee,
  totalFixedFee,
  totalFeePercent,
  merchantPercentFactor,
} = storeToRefs(organizationStore);

const merchFixedFee = ref(merchantFixedFee.value);
const pFixedFee = computed(() => totalFixedFee.value - merchFixedFee.value);
const merchPercentFactor = ref(merchantPercentFactor.value);

const totalMerchantFee = computed(() => {
  return (
    merchPercentFactor.value * props.transactionAmount +
    (props.transactionAmount ? merchFixedFee.value : 0)
  );
});

const patientPercentFactor = computed(
  () => totalFeePercent.value - merchPercentFactor.value
);

const totalPatientFee = computed(() => {
  return (
    patientPercentFactor.value * props.transactionAmount +
    (props.transactionAmount ? pFixedFee.value : 0)
  );
});

const setPatientFee = (setAmount: number) => {
  merchFixedFee.value = totalFixedFee.value - setAmount;
  sliderRef.value?.setSlider();
};

const onUpdatePercent = (percent: number) => (merchPercentFactor.value = percent);

function getMerchantPercent() {
  return { mFixed: merchFixedFee.value, mPercent: merchPercentFactor.value };
}

defineExpose({ getMerchantPercent });
</script>

<template>
  <section class="">
    <main class="merchant-processing-fee">
      <span>{{ $t("onlyAppliesToThisTransaction") }}</span>
      <div class="fee-details">
        <div class="edit-fee">
          <SliderComponent ref="sliderRef" :amount="transactionAmount" @updatePercent="onUpdatePercent" />
        </div>
        <q-separator></q-separator>
        <div class="fee-details-container">
          <div class="merchant-fee">
            <span class="text">{{ $t("merchantProcessingFee") }}</span>
            <div class="fees">
              <div class="percent-fee">
                <span class="selected-fee">
                  <span class="value" v-number-format="merchPercentFactor * 100" />%
                </span>
                <span class="total">/ <span v-number-format="totalFeePercent * 100" />%</span>
              </div>
              <span class="plus"> <i class="fa-solid fa-plus"></i> </span>
              <div class="fixed-fee">
                <span class="selected-fee"> $
                  <input class="merch-fixed-input" type="number" :step="0.01" min="0" :max="totalFixedFee"
                    v-model="merchFixedFee">
                </span>
                <span class="total">/ ${{ totalFixedFee }}</span>
              </div>
            </div>
          </div>
          <div class="patient-fee">
            <span class="text">{{ $t("patientProcessingFee") }}</span>
            <div class="fees">
              <div class="percent-fee">
                <span class="selected-fee">
                  <span class="value" v-number-format="patientPercentFactor * 100" />%
                </span>
                <span class="total">/ <span v-number-format="totalFeePercent * 100" />%</span>
              </div>
              <span class="plus"> <i class="fa-solid fa-plus"></i> </span>
              <div class="fixed-fee">
                <span class="selected-fee"> $ <span class="value" v-number-format="pFixedFee" /> </span>
                <span class="total">/ ${{ totalFixedFee }}</span>
              </div>
            </div>
          </div>
          <div class="set-patient-fee">
            <span @click="() => setPatientFee(0)"> {{ $t("setPatientProcessingFee", { fee: 0 }) }}
            </span>
          </div>

          <div class="processing-fee-notice">
            <span>{{
              $t("transactionMerchantFeeAndPatientFee", {
                transaction: `$${transactionAmount}`,
                merchantFee: `$${formatNumber(totalMerchantFee)}`,
                patientFee: `$${formatNumber(totalPatientFee)}`,
              })
            }}</span>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<style lang="scss" scoped>
.merchant-processing-fee {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 24px;

  .fee-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    .edit-fee {
      padding: 0 20px;
      width: 100%;
    }

    .fee-details-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .merchant-fee,
      .patient-fee {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        justify-content: flex-start;

        .text {
          color: var(--gray-900);
          font-weight: 500;
          font-size: var(--font-size-sm);

          @media screen and (max-width: 600px) {
            display: flex;
            width: 100%;
            justify-content: center;
          }
        }

        .fees {
          display: flex;
          flex: 1;
          font-size: 14px;
          align-items: center;
          justify-content: space-between;
          color: var(--text-secondary);

          .percent-fee,
          .fixed-fee {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;

            .selected-fee {
              display: flex;
              justify-content: space-between;
              padding: 4px;
              background-color: var(--gray-50);
              border: 1px solid var(--gray-50);
              border-radius: 8px;
              min-width: 80px;
              font-size: var(--font-size-sm2);
              font-weight: 500;
              color: var(--gray-700);

              @media screen and (max-width: 360px) {
                min-width: 70px;
              }

              .merch-fixed-input {
                width: 60px;
                border: none;
                text-align: right;
                font-weight: 700;
                font-size: var(--font-size-md);
                color: var(--primary-text);
              }

              .value {
                font-size: var(--font-size-md);
                font-weight: 700;
                color: var(--primary-text);
              }
            }

            .total {
              font-size: var(--font-size-xss);
              font-weight: 400;
              color: var(--gray-700);
              line-height: 12px;
            }
          }

          .plus {
            i {
              color: var(--gray-700);
            }
          }
        }
      }
    }
  }

  .set-patient-fee {
    font-size: var(--font-size-xs);
    color: var(--teal-400);
    text-decoration: underline;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    span {
      cursor: pointer;
    }
  }

  .processing-fee-notice {
    padding: 10px 0 0;
    font-weight: 700;
    font-size: var(--font-size-sm);
    color: var(--primary-text);
    text-align: center;
    margin: auto;
  }
}
</style>
