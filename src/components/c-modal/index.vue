<template>
  <a-modal
    v-bind="$attrs"
    wrap-class-name="ant-modal-fullscreen"
    :visible="true"
    v-on="$listeners"
  >
    <slot />
  </a-modal>
</template>
<style lang="less">
.ant-modal-fullscreen{
  .ant-modal{
    width: 100%!important;
    top: 0;
    padding: 0;
    height: 100vh;
    .ant-modal-content {
      height: 100vh;
      border-radius: 0;
    }
  }
}
</style>
