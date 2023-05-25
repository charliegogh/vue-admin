<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import ResizeHandler from './mixins/ResizeHandler'
export default {
  name: 'App',
  mixins: [ResizeHandler],
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>

