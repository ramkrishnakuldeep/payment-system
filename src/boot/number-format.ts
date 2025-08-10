import { boot } from 'quasar/wrappers';
import { registerNumberFormatDirective } from 'src/utils/NumberFormat';

export default boot(({ app }) => {
  registerNumberFormatDirective(app);
});
