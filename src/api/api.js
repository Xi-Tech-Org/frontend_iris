import axios from 'axios';
import permissionTemplate from '@/cfg/permissionTemplate.json';

let req = axios.create({
  baseURL: 'https://tdx.transportdata.tw/api/basic/v3/',
  timeout: 60000,
  withCredentials: false,
  headers: {
    Authorization: 'none',
    'Content-Type': 'application/json',
  },
});

function fakeGiveuserData(acc, jwt) {
  return {
    Account: acc,
    Name: acc + ' Man',
    Token: jwt,
    Permissions: permissionTemplate,
  };
}

export const userApi = {
  login(acc, pwd) {
    return req
      .get(
        'Rail/TRA/Network',
        {
          account: acc,
          password: pwd,
        },
        {}
      )
      .then((e) => {
        console.log('====DDDD login then', e);
        const data = e.data;
        data.UserInfo = fakeGiveuserData(acc, 'abc1234jwtnlasiofdso8sijsdoigfsirjoajf8.sgfuhsdg8f.sfgdsf09gsd09');
        return data;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  },
  logout(jwt) {
    return req
      .get(
        'Rail/TRA/Network',
        {
          Token: jwt,
        },
        {}
      )
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
      .get(
        'Rail/TRA/Network',
        {
          jwt: jwt,
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
      .get(
        'Rail/TRA/Network',
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
