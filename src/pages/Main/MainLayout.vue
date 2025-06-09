<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <sidebar-fixed-toggle-button />
    <side-bar :background-color="sidebarBackground" short-title="XG" title="Iris Hub">
      <template slot="links">
        <sidebar-item
          :link="{
            name: $t('sidebar.dashboard'),
            icon: 'tim-icons icon-chart-pie-36',
            path: '/dashboard',
          }"
        >
        </sidebar-item>
        <sidebar-item v-for="(cat, ci) in sideItems" :key="ci" :link="cat.link">
          <sidebar-item v-for="(p, pi) in cat.children" :key="pi" :link="p.link"></sidebar-item>
        </sidebar-item>
        <div>
          <div style="min-width: 100px; height: 100px">.</div>
        </div>
      </template>
    </side-bar>
    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar @click_menu="clickNavMenu"></dashboard-navbar>
      <router-view name="header"></router-view>

      <div :class="{ content: !$route.meta.hideContent }" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import DashboardNavbar from './MainNavbar.vue';
import ContentFooter from './MainFooter.vue';
import SidebarFixedToggleButton from '../Layout/SidebarFixedToggleButton.vue';
import { ZoomCenterTransition } from 'vue2-transitions';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    SidebarFixedToggleButton,
    ZoomCenterTransition,
  },
  computed: {
    sideItems() {
      const isLogin = this.$store.getters.isLogin;
      const permMap = this.$store.getters.userPermissionMap;
      const list = this.sideRawItems.map((c) => {
        c.children = c.children.filter((item) => {
          let rt = true;
          const meta = item.meta;
          if (!!meta.isLogin && !isLogin) rt = false;
          if (!!meta.permission && !permMap.has(meta.permission)) rt = false;
          return rt;
        });
        return c;
      });
      return list;
    },
  },
  data() {
    return {
      flgChangePassword: false,
      sidebarBackground: 'primary', //vue|blue|orange|green|red|primary
      sideRawItems: [],
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('main-panel');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    },
    clickNavMenu(item) {
      console.log(item);
    },
  },
  mounted() {
    this.initScrollbar();
    window.MainLayout = this;
    this.sideRawItems = this.$xiPage.getSidebarItems();
  },
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
