import i18n from '@/i18n';
import DashboardLayout from '@/pages/Main/MainLayout.vue';
// Components pages
const Buttons = () => import(/* webpackChunkName: "components" */ '@/pages/Components/Buttons.vue');
const GridSystem = () => import(/* webpackChunkName: "components" */ '@/pages/Components/GridSystem.vue');
const Panels = () => import(/* webpackChunkName: "components" */ '@/pages/Components/Panels.vue');
const SweetAlert = () => import(/* webpackChunkName: "components" */ '@/pages/Components/SweetAlert.vue');
const Notifications = () => import(/* webpackChunkName: "components" */ '@/pages/Components/Notifications.vue');
const Icons = () => import(/* webpackChunkName: "components" */ '@/pages/Components/Icons.vue');
const Typography = () => import(/* webpackChunkName: "components" */ '@/pages/Components/Typography.vue');

const tt = function (key) {
  return i18n.t(key);
};

function makeCategoryItems(path, name, meta, components, link) {
  return {
    routerInfo: {
      path: path,
      name: name,
      meta: meta,
      components: { default: components },
    },
    sidebarInfo: { link: link },
  };
}
const CATEGORY_COMPONENTS = {
  category: {
    routerKey: 'componentsMenu',
    routerInfo: {
      path: '/components',
      component: DashboardLayout,
      redirect: '/components/buttons',
      name: 'Components',
      meta: {
        needLogin: true,
      },
    },
    sidebarInfo: {
      link: { name_t: 'sidebar.components', icon: 'tim-icons icon-molecule-40' },
    },
  },
  items: [
    // {
    //   routerInfo: {
    //     path: 'buttons',
    //     name: 'Buttons',
    //     meta: {
    //       needLogin: true,
    //     },
    //     components: { default: Buttons },
    //   },
    //   sidebarInfo: {
    //     link: { name_t: 'sidebar.buttons' },
    //   },
    // },
    makeCategoryItems('buttons', 'Buttons', { needLogin: true }, Buttons, { name_t: 'sidebar.buttons' }),
    makeCategoryItems('grid-system', 'Grid System', { needLogin: true }, GridSystem, { name_t: 'sidebar.gridSystem' }),
    makeCategoryItems('panels', 'Panels', { needLogin: true }, Panels, { name_t: 'sidebar.panels' }),
    makeCategoryItems('sweet-alert', 'Sweet Alert', { needLogin: true }, SweetAlert, { name_t: 'sidebar.sweetAlert' }),
    makeCategoryItems('notifications', 'Notifications', { needLogin: true }, Notifications, { name_t: 'sidebar.notifications' }),
    makeCategoryItems('icons', 'Icons', { needLogin: true }, Icons, { name_t: 'sidebar.icons' }),
    makeCategoryItems('typography', 'Typography', { needLogin: true }, Typography, { name_t: 'sidebar.typography' }),
  ],
};

const CATEGORY_SEARCH = {
  category: {
    routerKey: 'searchMenu',
    routerInfo: {
      path: '/search',
      component: DashboardLayout,
      redirect: '/search/bytransactionid',
      name: 'Search',
      meta: {
        needLogin: true,
      },
    },
    sidebarInfo: {
      link: { name_t: 'search', icon: 'tim-icons icon-zoom-split' },
    },
  },
  items: [
    makeCategoryItems('bytransactionid', 'ByTransactionID', { permission: 'SearchByBetID' }, Panels, { name_t: 'byTransactionID' }),
    makeCategoryItems('byplayers', 'ByPlayers', { permission: 'SearchByPlayer' }, Buttons, { name_t: 'byPlayers' }),
  ],
};

const CATEGORY_REPORTS = {
  category: {
    routerKey: 'reportMenu',
    routerInfo: {
      path: '/report',
      component: DashboardLayout,
      redirect: '/report/game',
      name: 'Report',
      meta: {
        needLogin: true,
      },
    },
    sidebarInfo: {
      link: { name_t: 'reports', icon: 'tim-icons icon-single-copy-04' },
    },
  },
  items: [
    makeCategoryItems('game', 'GameReport', { needLogin: true }, Panels, { name_t: 'gameReport' }),
    makeCategoryItems('native-currency', 'NativeCurrencyReport', { needLogin: true }, Buttons, { name_t: 'nativeCurrencyReport' }),
    makeCategoryItems('player', 'PlayerReport', { needLogin: true }, Panels, { name_t: 'playersReport' }),
    makeCategoryItems('table-round', 'TableRoundsReport', { needLogin: true }, Buttons, { name_t: 'tableRouneReport' }),
  ],
};

const CATEGORY_LIST = {
  category: {
    routerKey: 'listMenu',
    routerInfo: {
      path: '/list',
      component: DashboardLayout,
      redirect: '/list/game',
      name: 'List',
      meta: {
        needLogin: true,
      },
    },
    sidebarInfo: {
      link: { name_t: 'list', icon: 'tim-icons icon-paper' },
    },
  },
  items: [
    makeCategoryItems('game', 'GameList', { permission: 'GameList' }, Notifications, { name_t: 'gameList' }),
    makeCategoryItems('currency', 'CurrencyList', { permission: 'CurrencyList' }, Icons, { name_t: 'currencyList' }),
  ],
};

const CATEGORY_ADMIN = {
  category: {
    routerKey: 'adminMenu',
    routerInfo: {
      path: '/admin',
      component: DashboardLayout,
      redirect: '/admin/role',
      name: 'Admin',
      meta: {
        needLogin: true,
      },
    },
    sidebarInfo: {
      link: { name_t: 'admin', icon: 'tim-icons icon-single-02' },
    },
  },
  items: [
    makeCategoryItems('role', 'RoleManagement', { permission: 'RoleManagement' }, Panels, { name_t: 'roleManagement' }),
    makeCategoryItems('user', 'UserManagement', { permission: 'UserManagement' }, Buttons, { name_t: 'userManagement' }),
    makeCategoryItems('vendor', 'VendorManagement', { permission: 'VendorManagement' }, Panels, { name_t: 'vendorManagement' }),
    makeCategoryItems('game-provider', 'GameProviderManagement', { permission: 'GameProviderManagement' }, Buttons, { name_t: 'gameProviderManagement' }),
  ],
};
const cfg = [CATEGORY_COMPONENTS, CATEGORY_SEARCH, CATEGORY_REPORTS, CATEGORY_LIST, CATEGORY_ADMIN];

function getRouterItems() {
  const rt = {};
  cfg.forEach((cat) => {
    const key = cat.category.routerKey;
    rt[key] = { ...cat.category.routerInfo };
    rt[key].children = cat.items.map((c) => {
      return c.routerInfo;
    });
  });
  return rt;
}
function getRouterItemsArray() {
  let a = getRouterItems();
  return Object.values(a).map((c) => c);
}

function getSidebarItems() {
  const rt = [];
  // link 需要的 name 從 name_t 過 tt 轉換，icon 直印，path 由 routerInfo 讀取
  cfg.forEach((cat) => {
    var a = {
      link: {},
      children: [],
    };
    var catLink = cat.category.sidebarInfo.link;
    var catName = catLink.name_t ? tt(catLink.name_t) : catLink.name;
    a.link.name = catName;
    a.meta = cat.category.routerInfo.meta || {};
    if (catLink.icon) a.link.icon = catLink.icon;

    // 處理第二層
    if (cat.items && cat.items.length > 0) {
      a.children = cat.items.map((item) => {
        var b = { link: {} };
        var itemLink = item.sidebarInfo.link;
        var itemName = itemLink.name_t ? tt(itemLink.name_t) : itemLink.name;
        b.link.name = itemName;
        if (itemLink.icon) b.link.icon = itemLink.icon;
        b.link.path = cat.category.routerInfo.path + '/' + item.routerInfo.path;
        b.meta = item.routerInfo.meta || {};
        return b;
      });
    }

    // 推到回傳陣列
    rt.push(a);
  });
  return rt;
}

function getLabelByRouteName(str) {
  let sidebarInfo = {};
  const cats = getSidebarItems();
  cfg.forEach((cat) => {
    if (cat.category.routerInfo.name == str) {
      sidebarInfo = cat.category.sidebarInfo;
    } else {
      cat.items.forEach((item) => {
        if (item.routerInfo.name == str) {
          sidebarInfo = item.sidebarInfo;
        }
      });
    }
  });

  let rt = '';
  if (sidebarInfo.link) {
    rt = sidebarInfo.link.name_t ? tt(sidebarInfo.link.name_t) : sidebarInfo.link.name;
  }
  return rt;
}

function install(Vue, options) {
  Vue.prototype.$xiPage = {
    cfg,
    getSidebarItems,
    getLabelByRouteName,
  };
}

export default {
  getRouterItemsArray,
  getRouterItems,
  getSidebarItems,
  getLabelByRouteName,
  install,
  cfg: cfg,
};
