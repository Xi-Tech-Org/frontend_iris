import i18n from '@/i18n';
const tt = function (key) {
  return i18n.t(key);
};

const SUCCESS_CODE = 10001;
const SUCCESS_LOGIN_CODE = 1;

export function checkStatusSuccess(p) {
  if (typeof p == 'object') {
    if (typeof p.StatusCode == 'number') {
      p = p.StatusCode;
    }
  }

  return p == SUCCESS_CODE || p == SUCCESS_LOGIN_CODE;
}

export function errCode2Msg(errCode, msg) {
  if (typeof errCode == 'object') {
    const p = errCode;
    errCode = p.StatusCode;
    msg = p.Message;
  }
  const key = 'errcode_' + errCode;
  const tx = tt('errcode_' + errCode);
  if (tx == key) return msg || tt('fail_cap');
  return tx;
}
