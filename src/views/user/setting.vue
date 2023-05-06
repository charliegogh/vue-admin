<template>
  <a-card :bordered="false">
    <div class="account-settings-info-main" :class="device">
      <div class="account-settings-info-left">
        <a-menu
          :mode="device == 'mobile' ? 'horizontal' : 'inline'"
          :default-selected-keys="['基本设置']"
          :style="{
            border: '0',
            width: device === 'mobile' ? '560px' : 'auto'
          }"
          type="inner"
        >
          <a-menu-item
            v-for="(item, index) of setting"
            :key="index"
            @click="openKeys = index"
          >
            {{ index }}
          </a-menu-item>
        </a-menu>
      </div>
      <div class="account-settings-info-right">
        <div class="account-settings-info-title">
          <span>{{ openKeys }}</span>
        </div>
        <component :is="setting[openKeys].component" />
      </div>
    </div>
  </a-card>
</template>
<script>
import { mapState } from "vuex";
import { register_components } from "./components/setting";
export default {
  components: {
    ...register_components
  },
  data() {
    return {
      openKeys: "基本设置",
      setting: {
        基本设置: {
          component: "BaseSetting"
        },
        个性化: {
          component: "Custom"
        }
      }
    };
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  }
};
</script>
<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
