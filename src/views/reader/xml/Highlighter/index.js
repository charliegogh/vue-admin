import HighlightRange from './model/range'
class Highlighter {
  constructor() {
    this.eventHandlers = {}
    this.highlights = []
    this.waitForTargetElement()
  }

  on(type, handler) {
    if (!this.eventHandlers[type]) {
      this.eventHandlers[type] = []
    }
    this.eventHandlers[type].push(handler)
  }
  waitForTargetElement() {
    const targetElement = document.querySelector('.content')

    if (targetElement) {
      targetElement.addEventListener('mouseup', this._handleSelection.bind(this))
      this.renderHighlights()
    } else {
      setTimeout(this.waitForTargetElement.bind(this), 1000)
    }
  }

  // 划词监听
  _handleSelection() {
    const range = HighlightRange.fromSelection()
    if (range) {
    }
    /*  const selection = window.getSelection()
    const selectedText = selection.toString().trim()

    // 检查是否有选中文本
    if (selectedText) {
      const range = selection.getRangeAt(0)
      const startOffset = range.startOffset
      const endOffset = range.endOffset

      // 创建一个包裹高亮的<span>元素
      const highlightElement = document.createElement('markL')
      highlightElement.className = 'highlighted' // 可以定义高亮样式的类名

      // 获取选中范围的内容
      const cloneContents = range.cloneContents()

      // 清空选中范围
      range.deleteContents()

      // 将克隆的内容包裹在 < span > 元素中
      highlightElement.appendChild(cloneContents)

      // 插入包装后的内容到选中范围
      range.insertNode(highlightElement)

      const highlightInfo = {
        selectedText,
        startOffset,
        endOffset
      }
      this.highlights.push(highlightInfo)

      console.log(this.highlights, '信息收集')
      // 触发自定义事件并传递选中文本和起始偏移量
      this.dispatchEvent('selection', { selectedText, startOffset, endOffset })
    } */
  }

  // 事件推送
  dispatchEvent(type, detail) {
    if (this.eventHandlers[type]) {
      const event = new CustomEvent(type, {
        bubbles: true, // 是否冒泡
        cancelable: true, // 是否可以被取消
        detail
      })
      this.eventHandlers[type].forEach((handler) => {
        handler(event)
      })
    }
  }

  // 渲染笔记
  renderHighlights() {
    this.highlights.forEach((highlightInfo) => {
      const highlightElement = document.createElement('markL')
      highlightElement.className = 'highlighted'

      // 获取选中范围的内容
      const range = document.createRange()
      const startContainer = document.querySelector('.ChapterH1')
      range.setStart(startContainer.firstChild, highlightInfo.startOffset)
      range.setEnd(startContainer.firstChild, highlightInfo.endOffset)

      const cloneContents = range.cloneContents()

      // 将克隆的内容包裹在<span>元素中
      highlightElement.appendChild(cloneContents)

      // 插入包装后的内容到选中范围
      range.deleteContents()
      range.insertNode(highlightElement)
    })
  }
}

export default Highlighter

