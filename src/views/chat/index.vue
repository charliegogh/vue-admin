<template>
  <div>
    <Conversations
      v-bind="Chat"
      @createConversation="Chat.createConversation()"
    />
    <textarea id="chart-input" />
    <button id="chart-send__btn">发送</button>
  </div>
</template>
<script>
import Chat from './Chat'
import Conversations from './components/Conversations.vue'
export default {
  components: {
    Conversations
  },
  data() {
    return {
      Chat: {
        conversations: []
      }
    }
  },
  mounted() {
    this.Chat = new Chat({
      field: document.querySelector('#chart-input'),
      sendBtn: document.querySelector('#chart-send__btn')
    })
    console.log(this.Chat)
  }
}
</script>
