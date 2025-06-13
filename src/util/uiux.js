import { Message } from 'element-ui';

export const elUI = {
  message: Message,
};

function install(Vue, opt = {}) {
  Vue.prototype.$elUI = elUI;
}

const UIUX = {
  elUI: elUI,
  install: install,
};

export default UIUX;
