import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import VueHighcharts from 'vue3-highcharts';

import messages from 'src/i18n';

const i18n = createI18n({
  locale: 'en-US',
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
  app.use(VueHighcharts)

});

export { i18n };
