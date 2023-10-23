<template>
  <div class="Conversations-wrapper">
    <div class="conversation-add" @click="$emit('createConversation')">新建对话</div>
    <div
      v-for="item of $attrs.conversations"
      :key="item.id"
      class="conversation-list"
    >
      {{ item.id }}
    </div>
  </div>
</template>
<style lang="less">
  .Conversations-wrapper {
    .row-start-center;
  }
</style>
