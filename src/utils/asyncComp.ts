import { defineAsyncComponent } from 'vue'

const EnterCardDetails = defineAsyncComponent(() =>
  import('/src/components/EnterCardDetails.vue')
)

const ReaderPayment = defineAsyncComponent(() =>
  import('/src/components/ReaderPayment.vue')
)

export type IAsyncComp = Record<string, ReturnType<typeof defineAsyncComponent>>
export const asyncComponents: IAsyncComp = {
  EnterCardDetails,
  ReaderPayment
}
