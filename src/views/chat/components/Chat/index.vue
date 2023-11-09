<template>
  <div class="chat-main">
    <div class="chat-main__header">
      <div class="chat-main__header--tabs">
        <div
          v-for="item of $attrs.chatTypes.tabs"
          :key="item.code"
          :class="{'tab-active': item.active }"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        v-if="$attrs.chatTypes.active==='专题问答'"
        class="chat-main__header--topics"
      >
        <div class="chat-tabs__tip">
          基于当前专题下管理的问答文献进行对话，当前专题：
        </div>
        <div class="chat-topics__select">
          as
        </div>
        <div class="chat-topics__open">
          打开专题
        </div>
      </div>
    </div>
    <div class="chat-main__cont">
      <div class="chart-wrapper flex1">
        <div
          v-for="(item) of chartList"
          :key="item.id"
          class="message-wrapper"
          :class="item.role==='user'?'reverse':''"
        >
          <div class="message-box-wrapper">
            <div class="message-main">
              <div class="message-pp">
                <img v-show="item.role==='assistant'" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOPSURBVHgB7VfNa1RXFP/d+z5m3ptMMjpOzSQNhKpFKKZasN0IIaV0V0qhLtwU2tJdP/4F110VSumiUrqtG90Yd6K48hsU/IqGiF+Jo8k4876/rue+MYzjS5yXKGSTAz/Offdc7vndc889714mSLCBwrHBsklgk8CGE1DzDow8wJoH3BaQMEAQYoU0l1ogobaEIIzVgJLOcs3bl8DTi8DCJeDZHNBcAubvAV5BwDME3FJCECk8gi8xAILA6CjDV7tUfDn8ZhdstULkPQYeHAeWZmnlrkCznWCJdFshp4YkQNokbZJD0r4hCcg2EJAOSIclhq0Vjj93FlHXWH4CHoX68m8JTSJgk8NWEGP8cwWVHTwNdyRDrna2QH7Haif8y313vARn2hEecIHQZKgNcvw9bGCEs3wErv0VYPZsCEdPMDap4tNDRehmvj19Vf5tePinFaQk9g6oOFI2MmMyp8BZSnDrpoVW3UVtSuDAj8a6nEv5oVbEwaoOoQpcYDEuirg/gevnLVh1D3bdx2fflHpsdgg07FX9rWj/aaiAskoLoK06LqL+BB4HDpztPqp7OMoVpUtsAfjlGPAzJebp2cw8qeNl+/Stbn+ZMXyoczDyJKPQl0BDc+C+F4BvS3r65aRyhctkXpfTd7v26Ru9thG14+YRyx64zCENtkYIohCWGfT0m1q3/dH2zDwY39Jtl/Rem5WINAJlWb1YHwKjI0U02i4echteEqPIO9twcIKiY3WcT36AjOwfozF7gDkqVt9O9Npux3Ea693IcQxvuk38T9Unono7Wa7ji6FhvI2c8AMc9l1ElAeHCwa+Zr1rzuTAbqOCoUFNxgunonlc8hexXrnih/jDciBXOELJuJ8pmTErFqI50cZ//gzCgCEKOPapVRwwt+F9vYg8shDFOGn7OGK7iDWerv73kokpVctHIGUfP8MJ+yGsgMppSJNIRISYkPB0iyL6FcYUxEiCvYQiQTbK/JgQEYFfB00cKhRWJLvqr2qfUsX4QBlH2/cxEzo96cPSoDKsXB+7tr26hu+HTHyirf5HZHmu5YtxgJPNp7jt2GiEMZJEumHpZaCi6tii6ahpBRiKRncFBpNWPmHo2Kn3v26wtb4LrjotnLOek26n36aiYAdl99RgFbuKJaxV2HofJotUrGY8B9PNJ7DonH9XG8XHZhlrFfYuXkaSiMF57lPyzgm8jWxeyzcJvAD8AJLZ+TB5YAAAAABJRU5ErkJggg==" alt="">
                <img v-show="item.role==='user'" src="https://gateway.cnki.net/aamsapi/api/image/avatar/12558536-d429-4c11-b3a4-9c0b5e981dcc" alt="">
              </div>
              <div class="message-content">
                <div class="message-box">
                  <div v-html="item.content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-main__cont--action">
        <div class="chat-cont__assistant">
          <span>推荐问题：</span>
          <div v-for="item of $attrs.assistant.tabs" :key="item.code">
            {{ item.name }}
          </div>
        </div>
        <x-textarea
          id="chat-input"
          v-model="inputValue"
          rows="1"
          tabindex="0"
          maxlength="500"
          placeholder="请输入您的问题..."
          @keydown.enter.native="sendMessage"
        >
          <i
            id="chat-input-click"
            slot="suffix"
            class="iconfont icon-a-Airplane-Outline"
            @click="sendMessage"
          />
        </x-textarea>
      </div>
    </div>
  </div>
</template>
<script>

import { xTextarea } from '../index'
export default {
  components: {
    xTextarea
  },
  data() {
    return {
      inputValue: '',
      disabledEnter: false
    }
  },
  computed: {
    chartList() {
      const dataSource = this.$attrs
      return dataSource.Session.find(item => item.id === dataSource.activeChatId)?.chats
    }
  },
  methods: {
    sendMessage(event) {
      event.preventDefault()
      const textarea = document.getElementById('chat-input')
      if (!textarea) {
        return
      }
      const text = textarea.value
      if (text.trim() !== '') {
        this.inputValue = ''
        textarea.value = ''
      }
    }
  }
}
</script>
