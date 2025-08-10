export const CONSTANTS = {
  MINIMUM_CASH_AMOUNT: 0.50,
  DEFAULT_MERCHANT_FEE_SPLIT: 0.5,
  LOCALE: 'en-US',
  NUMBER_FORMAT_OPTIONS: {
    style: 'decimal',
    minimumFractionDigits: 3,
  } as Intl.NumberFormatOptions,
  COUNTRIES: [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Taiwan', value: 'TW' },
    { label: 'India', value: 'IN' },
    { label: 'Australia', value: 'AU' },
  ]
};
