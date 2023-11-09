<template>
  <div class="chat-list">
    <x-input
      class="chat-list__search"
      placeholder="搜索对话..."
    >
      <i
        slot="suffix"
        class="iconfont icon-search"
      />
    </x-input>
    <div class="chat-list__handle">
      <div>共{{ $attrs.Session.length || 0 }}个对话</div>
      <div class="chat-list__handle--add">
        <i class="iconfont icon-tianjia" />
        新建对话
      </div>
    </div>
    <div
      v-for="item of $attrs.Session"
      :key="item.id"
      :class="{activeChat:item.id===$attrs.activeChatId}"
      class="chat-list__item"
      @click="switchSession(item.id)"
    >
      <i class="iconfont icon-Comments-Fill" />
      <div class="flex1">
        {{ item.title }}
      </div>
      <div class="chat-list__item--handle">
        <i
          class="chat-edit iconfont icon-Edit"
          @click="handleEdit(item.id)"
        />
        <i
          class="chat-delete iconfont icon-Delate-Outline"
          @click="handleDelete(item.id)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { xInput } from './index.js'
export default {
  components: {
    xInput
  },
  mounted() {
  },
  methods: {
    handleEdit() {
      this.$attrs.editSession()
    },
    handleDelete(id) {
      this.$attrs.deleteSession(id)
    },
    switchSession(id) {
      this.$attrs.switchSession(id)
    }
  }
}
</script>
<style lang="less">
  .Conversations-wrapper {
    .row-start-center;
  }
</style>
