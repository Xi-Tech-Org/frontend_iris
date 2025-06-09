import { userApi } from '../api/api.js';
import { LStorage } from '../util/tool.js';

// =========== 整理 UserInfo 工具 ================
export function formatResponseUserInfo(UserInfo) {
  return {
    account: UserInfo.Account,
    name: UserInfo.Name,
    jwt: UserInfo.Token,
    permissions: UserInfo.Permissions.map((c) => {
      return {
        functionName: c.FunctionName,
        permission: {
          create: c.Permission.Create,
          update: c.Permission.Update,
          read: c.Permission.Read,
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
      if (res && res.UserInfo && res.UserInfo.Token) {
        // 登入成功
        const adjUserInfo = formatResponseUserInfo(res.UserInfo);
        context.commit('updateUserInfo', adjUserInfo);
        context.commit('updateUserInfo', { password: pwd });

        // 導引到所有用戶都有的 dashboard
        this.routerA.push('/dashboard');
      }
    },
    async logout(context) {
      console.log('====DDDD Logout');
      const res = await userApi.logout(context.getters.userInfo.jwt);
      if (res) context.commit('logout');
      console.log(res);
      await new Promise((resolve) => {
        setTimeout(resolve, 140);
      });
      this.routerA.push('/login');
    },
    async loginByJWT(context, jwt) {
      console.log('====DDDD Login By JWT :' + jwt);
      const res = await userApi.verifyJWT(jwt);
      if (res?.UserInfo) {
        const adjUserInfo = formatResponseUserInfo(res.UserInfo);
        context.commit('updateUserInfo', adjUserInfo);
        // JWT 交換成功則導引到所有用戶都有的 dashboard
        // this.routerA.push('/dashboard');
      }
      return res;
    },
  },
};
