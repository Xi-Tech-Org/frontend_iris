import { userApi, updateJWT2Header } from '../api/api.js';
import { LStorage, permissionTool } from '../util/tool.js';
import { checkStatusSuccess, errCode2Msg } from '@/util/apiHelper.js';
import { elUI } from '@/util/uiux.js';

// =========== 整理 UserInfo 工具 ================
export function formatResponseUserInfo(UserInfo) {
  return {
    account: UserInfo.Account,
    name: UserInfo.Name,
    jwt: UserInfo.Token,
    permissions: UserInfo.Permissions.map((c) => {
      const fnName = permissionTool.getNameByID(c.FunctionId);
      return {
        functionName: fnName,
        permission: {
          create: !!c.Create,
          update: !!c.Update,
          read: !!c.Read,
        },
      };
    }),
  };
}

export const userInfo = {
  namespaced: false,
  state: {
    account: '',
    password: '',
    name: '',
    jwt: '',
    permissions: [],
    isInitDone: false,
  },
  getters: {
    isLogin(state) {
      return state.jwt != '';
    },
    isCheckedUserToken(state) {
      return state.isInitDone;
    },
    userInfo(state) {
      return state;
    },
    userPermissionMap(state) {
      const permissions = state.permissions;
      const permMap = new Map();
      permissions.forEach((p) => {
        const fnName = p.functionName;
        if (!!p.permission.read) permMap.set(fnName, p.permission);
      });
      return permMap;
    },
  },
  mutations: {
    updateUserInfo(state, objA = {}) {
      // 所有操作都要經過 upateUserInfo
      Object.assign(state, objA);
      let sObj = {};
      Object.assign(sObj, {
        account: state.account,
        jwt: state.jwt,
      });
      LStorage.saveObj(LStorage.constKey.KEY_USERINFO, JSON.parse(JSON.stringify(sObj)));
    },
    updatePassword(state, pwd) {
      this.commit('updateUserInfo', { password: pwd });
    },
    updateJWT(state, jwt) {
      this.commit('updateUserInfo', { jwt: jwt });
    },
    callUserTokenInitDone(state) {
      state.isInitDone = true;
    },
    logout(state) {
      this.commit('updateUserInfo', { jwt: '', permission: [], level: '' });
    },
  },
  actions: {
    async login(context, objA) {
      if (typeof objA !== 'object') return false;
      const acc = objA.account;
      const pwd = objA.password;
      console.log('====DDDD Account:' + acc + ' , ' + 'Password:' + pwd);
      const res = await userApi.login(acc, pwd);
      console.log(res);
      if (res && checkStatusSuccess(res.StatusCode) && res.Data && res.Data.Token) {
        // 登入成功
        const adjUserInfo = formatResponseUserInfo(res.Data);
        context.commit('updateUserInfo', adjUserInfo);
        context.commit('updateUserInfo', { password: pwd });
        updateJWT2Header(res.Data.Token);

        // 導引到所有用戶都有的 dashboard
        this.routerA.push('/dashboard');
      } else {
        const errMsg = errCode2Msg(res);
        elUI.message.error(errMsg);
      }
    },
    async logout(context) {
      console.log('====DDDD Logout');
      const res = await userApi.logout(context.getters.userInfo.jwt);
      if (res && checkStatusSuccess(res.StatusCode)) {
        context.commit('logout');
        this.routerA.push('/login');
      } else {
        const errMsg = errCode2Msg(res);
        elUI.message.error(errMsg);
      }
    },
    async loginByJWT(context, jwt) {
      console.log('====DDDD Login By JWT :' + jwt);
      const res = await userApi.verifyJWT(jwt);
      if (res?.Data) {
        const adjUserInfo = formatResponseUserInfo(res.Data);
        context.commit('updateUserInfo', adjUserInfo);
        // JWT 交換成功則導引到所有用戶都有的 dashboard
        // this.routerA.push('/dashboard');
      }
      return res;
    },
  },
};
