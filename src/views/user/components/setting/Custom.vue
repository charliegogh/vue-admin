<template>
  <a-list item-layout="horizontal">
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">风格配色</a>
        <span slot="description">
          整体风格配色设置
        </span>
      </a-list-item-meta>
      <div slot="actions">
        <cSwitch
          checked-children="暗色"
          un-checked-children="白色"
        />
      </div>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <a slot="title">主题色</a>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>
<script>
import cSwitch from '@/components/c-form/components/CSwitch'
export default {
  name: 'Custom',
  components: {
    cSwitch
  }
}
</script>
