import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueCodemirror from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css';

Vue.use(BootstrapVue);
Vue.use(VueCodemirror);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
