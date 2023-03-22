<template>
  <a-drawer
    v-bind="$attrs"
    :mask-closable="true"
    placement="right"
    :closable="true"
    :width="drawerWidth"
    :visible="value"
    @close="$emit('input',false)"
  >
    <template slot="title">
      <div style="width: 100%;">
        <span>{{ $attrs.title || '操作' }}</span>
      </div>
    </template>
    <a-spin :spinning="$attrs.loading">
      <slot />
    </a-spin>
    <div class="drawer-bottom-button">
      <a-button @click="$emit('input',false)">取消</a-button>
      <a-button
        type="primary"
        :loading="$attrs.loading"
        @click="$emit('handleSubmit')"
      >提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
export default {
  name: 'CDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerWidth: 700
    }
  },
  watch: {
    'value': {
      handler(val) {
        val && this.resetScreenSize()
      }
    }
  },
  methods: {
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    }
  }
}
</script>
<style lang="less">
.drawer-bottom-button {
  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
  button{
    margin-left: 5px;
  }
}
</style>
