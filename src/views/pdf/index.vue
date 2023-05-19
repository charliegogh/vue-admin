<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :span="12">
        <div class="pdf-container">
          <div
            id="viewer"
            ref="attachRef"
            class="PdfHighlighter"
            @pointerup="mouseup"
          >
            <div class="pdfViewer" />
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div v-for="(item,idx) of Layers" :key="item.id" class="notes">
          {{ idx+1 }}.
          {{ item.text }}
          <span @click="handleDeleteNotes(item)">删除</span>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

GlobalWorkerOptions.workerSrc = pdfjsWorker
import { EventBus, PDFViewer, PDFLinkService } from 'pdfjs-dist/legacy/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'

export const _getDocument = elm => (elm || {}).ownerDocument || document
export const getWindow = elm => (_getDocument(elm) || {}).defaultView || window
import { debounce } from '@/utils'
import { getPagesFromRange, getClientRects } from './utils'
import { createUUID } from '@/utils'
const Layers = {}
export default {
  data() {
    return {
      containerNode: null,
      pdfViewer: null,
      rects: {},
      pdfDocument: null,
      Layers: {} //
    }
  },
  mounted() {
    this.load()
  },
  methods: {

    async load() {
      const linkService = new PDFLinkService()
      const loadingTask = getDocument('./1.pdf')
      const viewer = this.$refs.attachRef
      this.containerNode = viewer
      const pdf = await loadingTask.promise
      if (pdf) {
        const pdfViewer = new PDFViewer({
          container: viewer,
          eventBus: new EventBus(), //  ？？？？
          textLayerMode: 2, // 显示文字类型 渲染文字图层
          annotationMode: 2,
          annotationEditorMode: 0,
          enablePrintAutoRotate: true, // 启用打印旋转
          useOnlyCssZoom: false, // 否可以通过css控制页面的缩放,默认 false
          maxCanvasPixels: 16777216,
          enablePermissions: false,
          removePageBorders: true,
          linkService,
          renderer: 'canvas',
          l10n: null
        })
        linkService.setDocument(pdf)
        linkService.setViewer(pdfViewer)
        pdfViewer.setDocument(pdf)
        this.pdfDocument = pdf
        this.setPageData()
        // 换用 pointerup 监听鼠标指针释放
        // window.addEventListener('mouseup', this.mouseup)
      }
    },
    // 配置页面data
    setPageData() {
      const numPages = this.pdfDocument.numPages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        Layers[pageNum] = []
      }
    },
    // 鼠标滑动监听
    mouseup: debounce(function() {
      const container = this.containerNode
      const selection = getWindow(container).getSelection()
      // 获取选择的第一个文本范围
      const range = selection.getRangeAt(0)
      // 属于哪个页面
      const pages = getPagesFromRange(range)
      if (!pages.length) return
      // 边界信息
      const rects = getClientRects(range, [pages[0]])
      if (rects && rects.length) {
        Layers[pages[0].number].push({
          id: createUUID(),
          rects,
          number: pages[0].number,
          text: range.toString()
        })
        this.Layers = Object.values(Layers).flat()
        this.renderLayers()
      }
    }, 500),
    // 绘制滑动图形
    renderLayers() {
      setTimeout(() => {
        Object.keys(Layers).forEach((a, adx) => {
          const pageContainer = document.querySelector(`div[data-page-number="${adx + 1}"]`)
          // 清空页面所有的元素
          const elements = document.querySelectorAll('.highlight')
          elements.forEach(function(element) {
            element.remove()
          })
          setTimeout(() => {
            // 新增
            const _highlight = Layers[a].map(b => (
              `
              <div class="highlight" id="highlight_${b.id}">
               ${b.rects.map((c, cdx) => (
                `
                <div
                 class="Highlight__part ${cdx}"
                 style="top:${c.top}px;left:${c.left}px;height: ${c.height}px;width: ${c.width}px"
                >

                </div>
              `
              )).join(' ')}
              </div>
            `
            ))
            if (_highlight && _highlight.length) {
              _highlight.forEach(i => {
                pageContainer.insertAdjacentHTML('beforeend', i)
              })
            }
          })
        })
      })
    },
    // 删除
    handleDeleteNotes(e) {
      Layers[e.number].splice(Layers[e.number].findIndex(j => e.id === j.id), 1)
      this.Layers = Object.values(Layers).flat()
      const el = document.getElementById(`highlight_${e.id}`)
      el.parentNode.removeChild(el)
    }
  }
}
</script>
<style lang="less">
.pdf-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 75px);

  .PdfHighlighter {
    position: absolute;
    overflow: auto;
    width: 100%;
    height: 100%;
  }
}

.Highlight__part {
  position: absolute;
  cursor: text;
  pointer-events: none;
  border-bottom: 2px solid red;
}
.notes{
  cursor: pointer;
}
</style>
