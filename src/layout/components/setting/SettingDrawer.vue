<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      :closable="false"
      :visible="visible"
      :style="{}"
      @close="visible=false"
    >
      <div class="setting-drawer-index-content">
        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>
          <div style="height: 20px">
            <a-tooltip v-for="(item, index) in colorList" :key="index" class="setting-drawer-theme-color-colorBlock">
              <template slot="title">
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon v-if="item.color === primaryColor" type="check" />
              </a-tag>
            </a-tooltip>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { updateTheme, updateColorWeak, colorList } from './setting'
import config from '@/defaultSettings'
export default {
  data() {
    return {
      visible: true,
      colorList,
      primaryColor: this.$store.getters.color
    }
  },
  computed: {
  },
  mounted() {
    console.log(this.primaryColor)
    // 当主题色不是默认色时，才进行主题编译
    if (this.primaryColor !== config.primaryColor) {
      // updateTheme(this.primaryColor)
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    changeColor(color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch('app/ToggleColor', color)
        updateTheme(color)
        console.log(this.primaryColor)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setting-drawer-index-content {

  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}
.setting-drawer-index-handle {
  position: absolute;
  top: 240px;
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;

  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>
