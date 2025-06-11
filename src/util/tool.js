import permissionTemplate from '@/cfg/permissionTemplate.json';

// ============== Local Storage Tool ====================
const LOCAL_STORAGE_KEY = 'IRIS_DATA';
const KEY_USERINFO = 'userInfo';

export const LStorage = {
  keyName(key) {
    return LOCAL_STORAGE_KEY + '_' + key;
  },
  read(key) {
    const name = this.keyName(key);
    let rt = localStorage.getItem(name);
    if (!rt) rt = '';
    return rt;
  },
  readObj(key, defaultValue = {}) {
    let str = this.read(key);
    let rt = defaultValue;
    if (str != '') {
      try {
        rt = JSON.parse(str);
      } catch (e) {}
    }
    return rt;
  },
  save(key, val) {
    const name = this.keyName(key);
    if (val) {
      localStorage.setItem(name, val);
      return true;
    } else {
      return false;
    }
  },
  saveObj(key, objA) {
    let val = '';
    try {
      val = JSON.stringify(objA);
    } catch (e) {}
    if (val != '') {
      return this.save(key, val);
    }
    return false;
  },
  delete(key) {
    const name = this.keyName(key);
    localStorage.removeItem(name);
  },
  constKey: {
    KEY_USERINFO,
  },
  getJWT() {
    const r = this.readObj(KEY_USERINFO);
    return r.jwt || '';
  },
};

export const permissionTool = {
  getByID(ID) {
    let perm = permissionTemplate.find((c) => {
      return c.FunctionId == ID;
    });
    return perm;
  },
  getByName(name) {
    let perm = permissionTemplate.find((c) => {
      return c.FunctionName == name;
    });
    return perm;
  },
  getNameByID(ID) {
    let objA = this.getByID(ID);
    if (!objA) return '';
    return objA.FunctionName;
  },
  getIDByName(name) {
    let objA = this.getByName(name);
    if (!objA) return 0;
    return objA.FunctionName;
  },
};
