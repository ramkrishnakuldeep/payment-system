<script setup lang="ts">
import { CONSTANTS } from 'src/utils/constants';
import { reactive, ref } from 'vue';


defineProps<{ transAmt: number }>()

const formRef = ref();
const form = reactive({
  cardholder: '',
  cardNo: '',
  expiry: '',
  cvv: '',
  country: '',
  zip: ''
});

const countries = ref<{ label: string; value: string }[]>(CONSTANTS.COUNTRIES);

const validateNumber = (val: string): true | string => {
  if (!val) return 'Card number is required';
  const digits = val.replace(/\s+/g, '');
  if (!/^[0-9]{16}$/.test(digits)) return 'Invalid card number';
  return luhnCheck(digits) || 'Card number failed validation';
}

const validateExpiry = (val: string): true | string => {
  if (!val) return 'Expiry date is required';
  const [mm = 0, yy = 0] = val.split('/').map(Number);
  if (mm < 1 || mm > 12) return 'Invalid month';
  const now = new Date();
  const expiryDate = new Date(2000 + yy, mm);
  if (expiryDate < now) return 'Card expired';
  return true;
}

const luhnCheck = (num: string): boolean => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

const onSubmit = async (callback: () => void): Promise<void> => {
  const isValid = await formRef.value.validate();

  if (!isValid) return;

  const payload = { ...form };
  payload.cardNo = payload.cardNo.replace(/\s+/g, '');
  console.log('Submitted card details:', payload);

  // call payment API or redirect to Bank portal
  setTimeout(callback, 1000)
}

defineExpose({ onSubmit })
</script>

<template>
  <q-card class="card-detail q-pa-md">
    <q-form ref="formRef" class="form-container">
      <q-input v-model="form.cardholder" label="Cardholder Name" outlined :rules="[v => !!v || 'Name is required']" />
      <q-input v-model="form.cardNo" label="Card Number" outlined mask="#### #### #### ####"
        :rules="[validateNumber]" />
      <div class="row-flex">
        <q-input v-model="form.expiry" label="Expiry (MM/YY)" outlined mask="##/##" :rules="[validateExpiry]" />
        <q-input v-model="form.cvv" label="CVV" outlined mask="####"
          :rules="[v => /^[0-9]{3,4}$/.test(v) || 'Invalid CVV']" type="password" />
      </div>
      <div class="row-flex">
        <q-select v-model="form.country" label="Country" outlined :options="countries" emit-value map-options
          :rules="[v => !!v || 'Country is required']" />
        <q-input v-model="form.zip" label="ZIP / Postal Code" outlined
          :rules="[v => /^[0-9A-Za-z\-\s]{3,10}$/.test(v) || 'Invalid ZIP']" />
      </div>
    </q-form>
  </q-card>
</template>

<style lang="scss" scoped>
.card-detail {
  padding: 24px 24px 12px;

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .row-flex {
      display: flex;
      gap: 1rem;

      @media screen and (max-width:720px) {
        flex-wrap: wrap;
      }

      &>* {
        flex: 1;

        @media screen and (max-width:720px) {
          flex: 1 1 100%;
        }
      }
    }

  }
}
</style>
