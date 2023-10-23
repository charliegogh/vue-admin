import WebSocketClient from './WebSocketClient'
const webSocketClient = new WebSocketClient()
import { createUUID, getCurrentDateTimeFormatted } from './utils'

class Chat {
  constructor(options) {
    this.field = options.field || null
    this.sendBtn = options.sendBtn || null

    // 对话
    this.conversations = []
    this.inputValue = null
    // 绑定上下文
    this.handleEvent = this.handleEvent.bind(this)

    // 输入框监听
    this.field.addEventListener('input', (e) => {
      this.inputValue = e.target.value
    })

    // 回车监听
    this.field.addEventListener('keydown', (evt) => {
      switch (evt.keyCode) {
        case 13:
          this.dispatchEvent('send')
          break
        case 27: // Escape
          break
      }
    })

    // 发送
    this.sendBtn?.addEventListener('click', (e) => {
      this.dispatchEvent('send')
    })

    // events
    this.events = [
      'send'
    ]
    for (let i = 0, len = this.events.length; i < len; i++) {
      window.addEventListener(this.events[i], this.handleEvent)
    }
  }

  dispatchEvent(type) {
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(`${type}`, true, true, {
      type
    })
    return window.dispatchEvent(event)
  }

  handleEvent(e) {
    // 创建对话
    this.createConversation()
    // webSocketClient.connect()
  }

  createConversation() {
    const params = {
      id: createUUID(),
      title: null,
      createTime: getCurrentDateTimeFormatted(),
      updateTime: getCurrentDateTimeFormatted()
    }
    this.conversations.unshift(params)
  }
}

export default Chat
