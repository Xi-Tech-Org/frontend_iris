import Vue from 'vue';
import Router from 'vue-router';
// import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
// import DashboardLayout from './../pages2/Starter/SampleLayout.vue';
import DashboardLayout from '@/pages/Main/MainLayout.vue';
import MainPage from './../pages/Main/MainPage.vue';
// import MainPage from './../pages2/Dashboard/Dashboard.vue';
import AuthLayout from 'src/pages/Pages/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import store from '@/store/store';
import pageConfig from '../cfg/pageConfig';

Vue.use(Router);
Vue.use(pageConfig);

const Login = () => import(/* webpackChunkName: "pages" */ 'src/pages/Pages/Login.vue');
const Register = () => import(/* webpackChunkName: "pages" */ 'src/pages/Pages/Register.vue');

let authPages = {
  path: '/',
  component: AuthLayout,
  name: 'Authentication',
  children: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
  ],
};

const dynamicRouters = pageConfig.getRouterItemsArray();

const routerA = new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
    },
    authPages,
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: {
            needLogin: true,
          },
          components: { default: MainPage },
        },
        {
          path: 'search_by_bet',
          name: 'search_by_bet',
          components: { default: MainPage },
          meta: {
            permission: 'SearchByTransactionId',
          },
        },
        {
          path: 'search_by_player',
          name: 'search_by_player',
          components: { default: MainPage },
          meta: {
            permission: 'SearchByPlayer',
          },
        },
      ],
    },
    ...dynamicRouters,
    { path: '*', component: NotFound },
  ],
  linkActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

store.routerA = routerA;

routerA.beforeEach(async (to, from, next) => {
  const perm = to?.meta?.permission;
  const needLogin = to?.meta?.needLogin || !!perm;
  if (!perm && !needLogin) {
    // 沒有路由權限偵測必要
    console.log('====DDDD 沒有路由權限偵測必要的路徑', to?.meta);
    next();
    return true;
  }
  const fnName = to.meta.permission;
  let flg = false;

  if ((!store.state?.userInfo?.permissions || store.state.userInfo.permissions.length == 0) && !store.getters.isCheckedUserToken && from.name == null) {
    // 尚未初始化完成直接 return false
    console.log('====DDDD 需要權限但還沒初始化完成，先 pending', store.state?.userInfo?.permissions);
    while (!store.getters.isCheckedUserToken) {
      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });
    }
    console.log('====DDDD 需要權限初始化完成，繼續', store.state?.userInfo?.permissions);
  }
  if (!store.state?.userInfo?.permissions || store.state.userInfo.permissions.length == 0) {
    console.log('====DDDD 需要權限但用戶沒有', to?.meta, store.state?.userInfo?.permissions);
    if (from.path != '/login') routerA.push('/login');
    return false;
  }

  if (to.meta.needLogin && store.getters.isLogin) flg = true;
  store.state.userInfo.permissions.forEach((c) => {
    if (c.functionName == fnName && c.permission?.read == true) {
      flg = true;
    }
  });
  if (flg) {
    console.log('====DDDD 用戶權限符合', to?.meta, store.state?.userInfo?.permissions);
    next();
  } else {
    console.log('====DDDD 用戶權限不符合', to?.meta, store.state?.userInfo?.permissions);
    if (from.path != '/login') routerA.push('/login');
    return false;
  }
  return true;
});

export default routerA;
