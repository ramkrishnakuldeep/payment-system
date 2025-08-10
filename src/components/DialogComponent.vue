<script setup lang="ts">
import { ref, watch } from 'vue';


const props = withDefaults(defineProps<
  { showDialog: boolean; title: string; actionText: string; showCloseIcon?: boolean }>(),
  { showDialog: false, title: '', actionText: '', showCloseIcon: true }
)
const emit = defineEmits(['submitAction', 'cancelAction']);

const backdropFilter = ref('brightness(60%)');
const dialog = ref(props.showDialog);

watch(() => props.showDialog, (val) => {
  dialog.value = val;
});

const onSubmit = () => {
  emit('submitAction');
}
const onClose = () => {
  emit('cancelAction');
}

</script>
<template>
  <q-dialog v-model="dialog" :backdrop-filter="backdropFilter" @hide="onClose">
    <q-card>
      <q-card-section class="row items-center q-pb-none header-section" v-show="title">
        <span class="dialog-title">{{ $t(title) }}</span>
        <q-space />
        <q-btn class="close-icon" v-show="showCloseIcon" icon="close" flat round dense v-close-popup @click="onClose" />
      </q-card-section>
      <slot></slot>
      <q-separator></q-separator>
      <footer class="footer">
        <q-btn class="cancel-btn" flat :label="$t('cancel')" v-close-popup @click="onClose" />
        <q-btn class="submit" @click="onSubmit">
          {{ $t(actionText) }}
        </q-btn>
      </footer>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.header-section {
  padding: 24px 24px 0;

  .dialog-title {
    font-size: var(--font-size-2xl);
    color: var(--primary-text);
    font-weight: 700;
    line-height: 29px;
  }

  .close-icon {
    color: var(--gray-300);
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;
  padding: 12px;

  .cancel-btn {
    color: var(--gray-600);
    text-transform: capitalize;
  }

  .submit {
    color: white;
    background-color: var(--orange-400);
  }
}
</style>
