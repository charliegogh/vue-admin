<template>
  <a-card :bordered="false">
    <div class="pdf-container">
      <div
        id="viewer"
        ref="attachRef"
        class="PdfHighlighter"
      >
        <div class="pdfViewer" />
        <div
          v-for="(rect,idx) of rects"
          :key="idx"
          class="Highlight__part"
          :style="{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            height: `${rect.height}px`,
            width: `${rect.width}px`,
          }"
        >
          <div
            :style="{
              marginTop: `${rect.height}px`,
              borderBottom: `2px solid rgba(255,136,0)`,
            }"
          />
        </div>
      </div>
    </div>
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
export default {
  data() {
    return {
      containerNode: null,
      pdfViewer: null,
      rects: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.load()
    })
  },
  methods: {
    async load() {
      const linkService = new PDFLinkService()
      const loadingTask = getDocument('./1.pdf')
      const viewer = this.$refs.attachRef
      this.containerNode = viewer

      const pdf = await loadingTask.promise
      if (pdf) {
        linkService.setDocument(pdf)
        linkService.setViewer(pdfViewer)
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
        pdfViewer.setDocument(pdf)
        this.pdfViewer = pdfViewer
        window.addEventListener('mouseup', this.addListener)
      }
    },
    addListener: debounce(function() {
      const container = this.containerNode
      const selection = getWindow(container).getSelection()
      // 获取选择的第一个文本范围
      const range = selection.getRangeAt(0)
      const pages = getPagesFromRange(range)
      if (!pages.length) return
      const rects = getClientRects(range, [pages[0]])
      if (rects) this.rects = rects
    }, 500)
  }
}
</script>
<style lang="less">
.pdf-container{
  position: relative;
  width: 800px  ;
  height: calc(100vh - 75px);
  .PdfHighlighter{
    position: absolute;
    overflow: auto;
    width: 100%;
    height: calc(100vh - 75px);
  }
}
.Highlight__part{
  position:absolute;
  cursor: text;
}
</style>
