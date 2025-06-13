import axios from 'axios';
import permissionTemplate from '@/cfg/permissionTemplate.json';

const env = process.env;
const DEFINE_DOMAIN = env.VUE_APP_API;
const DEFINE_STAGE = env.VUE_APP_STAGES;
const BASE_URL = `https://${DEFINE_DOMAIN}/${DEFINE_STAGE}`;

function makeRequest(opt = {}) {
  let headers = Object.assign(
    {
      Authorization: 'none',
      'Content-Type': 'application/json',
    },
    opt
  );
  return axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    withCredentials: false,
    headers: headers,
  });
}

let req = makeRequest();

export function updateJWT2Header(jwt) {
  req = makeRequest({
    Authorization: 'Bearer ' + jwt,
  });
}

function fakeGiveuserData(acc, jwt) {
  const permissionJson = permissionTemplate.map((c) => {
    return {
      FunctionId: c.FunctionId,
      ...c.Permission,
    };
  });
  return {
    Account: acc,
    Name: acc + ' Man',
    Token: jwt,
    Permissions: permissionJson,
  };
}

export const userApi = {
  login(acc, pwd) {
    return req
      .post(
        '/UserLogin',
        {
          Account: acc,
          Password: pwd,
        },
        {}
      )
      .then((e) => {
        console.log('====DDDD login then', e);
        const data = e.data;
        // data.Data.Permissions = fakeGiveuserData(acc, 'abc1234jwtnlasiofdso8sijsdoigfsirjoajf8.sgfuhsdg8f.sfgdsf09gsd09').Permissions;
        return data;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  },
  logout() {
    return req
      .post('/UserLogout', {}, {})
      .then((e) => {
        console.log('====DDDD logout then', e);
        const data = e.data;
        return data;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  },
  verifyJWT(jwt) {
    return req
      .post(
        '/UserLogin',
        {
          Token: jwt,
        },
        {}
      )
      .then((e) => {
        const j = 'abc134fgdngjodfg.dfhdfhdfhdf.iojse03olj.ghj87ergds.' + Date.now();
        // return { errCode: 1005 };
        return {
          UserInfo: fakeGiveuserData('Hive', j),
          errCode: 1,
        };
      })
      .catch((e) => {
        console.log(e);
        return { errCode: 89005 };
      });
  },
  changePassword(jwt, oldpwd, pwd) {
    return req
      .post(
        '/UserChangePassword',
        {
          jwt: jwt,
          oldpwd: oldpwd,
          pwd: pwd,
        },
        {}
      )
      .then((e) => {
        const j = 'abc134fgdngjodfg.dfhdfhdfhdf.iojse03olj.ghj87ergds.' + Date.now();
        // return { errCode: 1005 };
        return {
          UserInfo: fakeGiveuserData('Hive', j),
          errCode: 1,
        };
      })
      .catch((e) => {
        console.log(e);
        return { errCode: 89005 };
      });
  },
};
