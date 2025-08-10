export const formatNumber = (value: number | string): string => {
  const locale = 'en-US';
  const options: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3
  }
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  if (isNaN(value)) return '';

  return new Intl.NumberFormat(locale, options).format(value);
}


// Vue directive
import type { App, DirectiveBinding } from 'vue';

export const NumberFormatDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value != null && binding.value !== '') {
      el.textContent = formatNumber(binding.value);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value != null && binding.value !== '') {
      el.textContent = formatNumber(binding.value);
    }
  }
};

export const registerNumberFormatDirective = (app: App) => {
  app.directive('number-format', NumberFormatDirective);
};
