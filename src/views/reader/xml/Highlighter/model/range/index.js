import { getDomRange } from './selection'
import { getDomMeta } from './dom'
class HighlightRange {
  constructor(start, end, text, id) {
    this.start = start
    this.end = end
    this.text = text
    this.id = id
  }

  // 滑动区域
  static fromSelection() {
    const range = getDomRange()
    if (!range) {
      return null
    }
    const start = {
      $node: range.startContainer,
      offset: range.startOffset
    }
    const end = {
      $node: range.endContainer,
      offset: range.endOffset
    }
    const text = range.toString()
    const id = '1'
    return new HighlightRange(start, end, text, id)
  }

  // 节点序列化
  serialize($root) {
    // const startMeta = getDomMeta()
  }
}

export default HighlightRange
