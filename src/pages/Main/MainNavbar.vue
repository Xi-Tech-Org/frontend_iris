<template>
  <base-nav v-model="showMenu" class="navbar-absolute top-navbar" type="white" :transparent="true">
    <div slot="brand" class="navbar-wrapper">
      <div class="navbar-minimize d-inline"><sidebar-toggle-button /></div>
      <div class="navbar-toggle d-inline" :class="{ toggled: $sidebar.showSidebar }">
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand" href="#pablo">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
      <div class="search-bar input-group" @click="searchModalVisible = true">
        <!--
          <input type="text" class="form-control" placeholder="Search...">
          <div class="input-group-addon"><i class="tim-icons icon-zoom-split"></i></div>
        -->
        <button class="btn btn-link" id="search-button" data-toggle="modal" data-target="#searchModal">
          <i class="tim-icons icon-zoom-split"></i>
        </button>
        <!-- You can choose types of search input -->
      </div>
      <modal :show.sync="searchModalVisible" class="modal-search" id="searchModal" :centered="false" :show-close="true">
        <input slot="header" v-model="searchQuery" type="text" class="form-control" id="inlineFormInputGroup" placeholder="SEARCH" />
      </modal>
      <!-- Classic Modal Change Password -->
      <modal :show.sync="flgChangePassword" body-classes="p-0" modal-classes="modal-dialog-centered modal-md" headerClasses="justify-content-center" footerClasses="modal_footer_class">
        <ValidationObserver v-slot="{ handleSubmit }">
          <card type="secondary" header-classes="pb-5" body-classes="px-lg-5 py-lg-5 modal_secondary_bg" class="border-0 mb-0">
            <template>
              <div class="text-muted text-center mb-3">
                <h4>{{ $t('changePassword') }}</h4>
              </div>
            </template>
            <form @submit.prevent="handleSubmit(submitChangePassword)">
              <div class="form-row">
                <ValidationProvider name="password" rules="required|min:1" v-slot="{ passed, failed, errors }">
                  <base-input
                    class="col-md-10"
                    v-model="password.old"
                    type="password"
                    :label="$t('oldPassword')"
                    :placeholder="$t('keyIn1')"
                    :error="errors[0]"
                    :class="[{ 'has-success': passed }, { 'has-danger': failed }]"
                  />
                </ValidationProvider>
                <ValidationProvider name="password" rules="required|min:1|confirmed:confirmation" v-slot="{ passed, failed, errors }">
                  <base-input
                    class="col-md-10"
                    v-model="password.pwd"
                    type="password"
                    :label="$t('newPassword')"
                    :placeholder="$t('keyIn1')"
                    :error="errors[0]"
                    :class="[{ 'has-success': passed }, { 'has-danger': failed }]"
                  />
                </ValidationProvider>
                <ValidationProvider name="password" vid="confirmation" rules="required|min:1" v-slot="{ passed, failed, errors }">
                  <base-input
                    class="col-md-10"
                    v-model="password.confirm"
                    type="password"
                    :label="$t('confirmPassword')"
                    :placeholder="$t('keyIn1')"
                    :error="errors[0]"
                    :class="[{ 'has-success': passed }, { 'has-danger': failed }]"
                  />
                </ValidationProvider>
              </div>
              <div class="m_footer">
                <base-button type="primary" native-type="submitChangePassword">{{ $t('reset') }}</base-button>
                <base-button type="danger" @click.native="flgChangePassword = false">Close </base-button>
              </div>
              <div class="m_footer_hint">
                <div>{{ $t('change_password_hint_1') }}</div>
              </div>
            </form>
          </card>
        </ValidationObserver>
      </modal>
      <base-dropdown tag="li" :menu-on-right="!$rtl.isRTL" title-tag="a" class="nav-item" title-classes="nav-link" menu-classes="dropdown-navbar">
        <template slot="title">
          <div class="photo"><img src="img/mike.jpg" /></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">Log out</p>
        </template>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Profile</a>
        </li>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Settings</a>
        </li>
        <li class="nav-link" @click="menuClick('changePassword')">
          <a href="#" class="nav-item dropdown-item">{{ $t('changePassword') }}</a>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link" @click="logout()">
          <span class="nav-item dropdown-item">Log out</span>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { BaseNav, Modal } from '@/components';
import SidebarToggleButton from '../Layout/SidebarToggleButton';
import { extend } from 'vee-validate';
import { required, min, confirmed } from 'vee-validate/dist/rules';
import { userApi } from '../../api/api';
import { checkStatusSuccess, errCode2Msg } from '@/util/apiHelper.js';
import { elUI } from '@/util/uiux.js';

extend('min', min);
extend('required', required);
extend('confirmed', confirmed);

export default {
  components: {
    SidebarToggleButton,
    BaseNav,
    Modal,
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      const str = this.$xiPage.getLabelByRouteName(name);
      return this.capitalizeFirstLetter(str);
    },
    isRTL() {
      return this.$rtl.isRTL;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  data() {
    return {
      flgChangePassword: false,
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
      password: {
        old: '',
        pwd: '',
        confirm: '',
      },
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    menuClick(item) {
      this.$emit('click_menu', item);
      if (item == 'changePassword') {
        this.flgChangePassword = true;
      }
    },
    resetPassword() {
      Object.keys(this.password).forEach((c) => {
        this.password[c] = '';
      });
    },
    submitChangePassword() {
      console.log('====DDDD OK Change Password');
      const uf = this.userInfo;
      userApi.changePassword(uf.account, this.password.old, this.password.pwd).then((res) => {
        if (checkStatusSuccess(res)) {
          // 如果成功
          this.resetPassword();
          this.$store.commit('updatePassword', this.password.pwd);
          this.flgChangePassword = false;
          this.logout();
        } else {
          const errMsg = errCode2Msg(res);
          elUI.message.error(errMsg);
        }
      });
    },
  },
  mounted() {
    const uf = this.userInfo;
    if (uf.password) {
      this.password.old = uf.password;
    }
  },
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}

.title-up {
  text-transform: capitalize;
}
.m_footer {
  display: flex;
  justify-content: space-between;
  padding: 24px 24px 0px 24px;
  box-sizing: border-box;
  width: 100%;
}
.m_footer_hint {
  padding: 0px 24px 16px 24px;
  color: var(--danger);
  display: flex;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
}
.m_footer_hint > div {
  width: 100%;
  white-space: nowrap;
  box-sizing: border-box;
  text-align: right;
}
</style>
