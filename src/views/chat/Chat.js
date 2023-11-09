import WebSocketClient from './WebSocketClient'

const webSocketClient = new WebSocketClient()
import { createUUID, getCurrentDateTimeFormatted } from './utils'

class Chat {
  constructor(options) {
    this.field = options.field || null
    this.sendBtn = options.sendBtn || null
    this.inputValue = ''
    this.test = ''
    // 对话
    this.Session = [
      {
        id: '1',
        title: '二大爷的快乐生活,狗屁玩意儿的二大爷？',
        chats: [
          {
            role: 'assistant',
            content: '二大爷你好啊'
          },
          {
            role: 'user',
            content: '你好大佬'
          },
          {
            role: 'assistant',
            content: '你在干嘛呢'
          }
        ]
      },
      {
        id: '2',
        title: '你在吹什么牛逼呢',
        chats: [

        ]
      }
    ]

    this.activeChatId = '1'

    this.literature = [
      {
        id: '1',
        title: 'Python3入门人工智能掌握深度机器学习',
        type: 'xml'
      },
      {
        id: '2',
        title: '数据挖掘中的两大经典算法：K-Means聚类算法和决策树算法数据挖掘中的两大经典算法：K-Means聚类算法和决策树算法',
        type: 'pdf'
      }
    ]

    this.chatTypes = {
      active: '专题问答',
      tabs: [
        {
          name: '全库回答',
          active: false,
          code: '0'
        },
        {
          name: '专题问答',
          code: '1',
          active: true,
          tip: '基于当前专题下管理的问答文献进行对话，当前专题：'
        }
      ]
    }

    this.assistant = {
      active: '',
      tabs: [
        {
          name: '生成文献综述',
          active: false,
          code: '0'
        },
        {
          name: '生成文献矩阵',
          active: false,
          code: '1'
        }
      ]
    }

    this.inputValue = null
    // 绑定上下文
    this.handleEvent = this.handleEvent.bind(this)
    this.editSession = this.editSession.bind(this)
    this.deleteSession = this.deleteSession.bind(this)
    this.switchSession = this.switchSession.bind(this)

    this.deleteLiterature = this.deleteLiterature.bind(this)

    // 输入框监听
    this.field?.addEventListener('input', (e) => {
      this.inputValue = e.target.value
    })

    // 回车监听
    this.field?.addEventListener('keydown', (evt) => {
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
    webSocketClient.$on((e) => {
      this.$on(e)
    })
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
    if (!this.activeChatId) this.createSession()
    // 开始对话
    this.handleChat()
  }

  // 创建会话
  createSession() {
    const id = createUUID()
    const params = {
      id,
      title: null,
      createTime: getCurrentDateTimeFormatted(),
      updateTime: getCurrentDateTimeFormatted(),
      dialogue: [
        {
          role: 'user',
          content: this.inputValue
        }
      ]
    }

    this.activeChatId = id
  }

  // 编辑会话
  editSession() {
    console.log('编辑会话')
  }

  // 删除会话
  deleteSession(id) {
    const target = this.Session.findIndex(_ => _.id === id)
    this.Session.splice(target, 1)
  }

  // 切换会话
  switchSession(id) {
    this.activeChatId = id
  }

  // 开始对话
  handleChat() {
    const target = this.Session.find(_ => _.id === this.activeChatId)
    target.dialogue.push({
      role: 'user',
      content: this.inputValue
    })
    webSocketClient.$emit(target.dialogue)
  }

  // 接收会话信息
  $on(e) {
    if (e.header.code !== 0) {
      console.log('失败')
      return
    }
    const rs = e.payload.choices.text[0].content
    this.test += rs
    console.log(this.test)
  }

  // 删除文献
  deleteLiterature(id) {
    const target = this.literature.findIndex(_ => _.id === id)
    this.literature.splice(target, 1)
  }
}

export default Chat
