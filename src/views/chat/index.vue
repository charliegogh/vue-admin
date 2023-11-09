<template>
  <div class="chat-wrapper">
    <ChatList
      v-bind="Chat"
    />
    <ChatMain
      v-bind="Chat"
    />
    <Literature
      v-bind="Chat"
    />
  </div>
</template>
<script>
import Chat from './Chat'
import ChatList from './components/ChatList.vue'
import ChatMain from './components/Chat/index.vue'
import Literature from './components/Literature'
export default {
  components: {
    ChatList,
    ChatMain,
    Literature
  },
  data() {
    return {
      Chat: {
        Session: [],
        chatTypes: {
          active: '专题问答',
          tabs: []
        },
        assistant: {
          active: '生成文献综述',
          tabs: []
        },
        literature: [],
        activeChatId: '1'
      }
    }
  },
  watch: {
    Chat: {
      deep: true,
      handler(newVal, oldVal) {
        console.log(newVal)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.Chat = new Chat({
        field: document.querySelector('#chat-input'),
        sendBtn: document.querySelector('#chat-input-click')
      })
      console.log(this.Chat)
    })
  }
}
</script>
<style lang="less">
@import "./styles";
</style>
