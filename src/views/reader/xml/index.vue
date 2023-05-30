<template>
  <div style="position: relative;width: 500px;line-height: 1.5">
    <div ref="content" v-underline-text class="content" v-html="text" />
    <div
      v-for="highlight in highlights"
      :key="highlight.id"
      class="Highlight__part"
      :style="getHighlightStyle(highlight)"
    >
      <span>{{ highlight.note }}</span>
    </div>
    <!--    :style="getHighlightStyle(highlight.range)"-->
  </div>
</template>

<script>
import { content } from '@/views/reader/xml/data'
const getClientRects = (range, pageRect) => {
  const clientRects = Array.from(range.getClientRects())
  const rects = []
  for (const clientRect of clientRects) {
    const highlightedRect = {
      top: clientRect.top - pageRect.top,
      left: clientRect.left - pageRect.left,
      width: clientRect.width,
      height: clientRect.height
    }
    console.log(clientRect)
    rects.push(highlightedRect)
  }
  return rects
}
export default {
  directives: {
    underlineText: {
      bind(el, binding, vnode) {
        el.addEventListener('mouseup', handleMouseUp)

        function handleMouseUp(event) {
          const selection = window.getSelection()
          const selectedText = selection.toString()

          if (selectedText) {
            const range = selection.getRangeAt(0)
            const pageRect = document.getElementsByClassName('content')[0]
            vnode.context.highlights = getClientRects(range, pageRect.getBoundingClientRect())
          }
        }
        function handleUnbind() {
          el.removeEventListener('mouseup', handleMouseUp)
        }
        vnode.context.$once('hook:unbind', handleUnbind)
      }
    }
  },
  data() {
    return {
      text: content,
      highlights: [
      ]
    }
  },
  methods: {
    getHighlightStyle(rect) {
      return {
        position: 'absolute',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      }
    }
  }
}
</script>
<style lang="less">
.Highlight__part{
  position: absolute;
  cursor: text;
  pointer-events: none;
  border-bottom: 2px solid red;
}
</style>
