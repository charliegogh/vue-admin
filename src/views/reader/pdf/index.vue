<template>
  <div>
    <iframe id="print-pdf-iframe" class="none" />
    <div class="pdf-action">
      <a-button @click="print">打印</a-button>
      <a-button @click="enlarge">放大</a-button>
      <a-button @click="toggleHandTool">抓手</a-button>
      <a-button @click="enlarge">适应宽度</a-button>
      <a-button @click="enlarge">适应高度</a-button>
    </div>
    <a-row :gutter="24">
      <a-col :span="16">
        <div class="pdf-container">
          <!--          @pointerup="mouseup"-->
          <div
            id="viewer"
            ref="attachRef"
            class="PdfHighlighter"
          >
            <div
              ref="importDom"
              class="pdfViewer"
            />
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <FindBar
          :find-bar="findBar"
        />
        <!--        <div-->
        <!--          v-for="(item,idx) of Layers"-->
        <!--          :key="item.id"-->
        <!--          class="notes"-->
        <!--          @click="location(item)"-->
        <!--        >-->
        <!--          {{ idx+1 }}.-->
        <!--          {{ item.text }}-->
        <!--          <span @click="handleDeleteNotes(item)">删除</span>-->
        <!--        </div>-->
      </a-col>
    </a-row>
  </div>
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
import GrabToPan from '@/views/reader/pdf/hook/useGrabToPan'
import FindBar from '../components/FindBar'
import usePdfFindBar from '@/views/reader/pdf/hook/usePdfFindBar'
export default {
  components: {
    FindBar
  },
  data() {
    return {
      containerNode: null,
      pdfViewer: null,
      rects: {},
      pdfDocument: null,
      handTool: null,
      findBar: {
        findStates: '',
        queryMatches: [],
        findMax: 50
      },
      eventBus: new EventBus(),
      Layers: {} //
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    toggleHandTool() {
      this.handTool.toggle()
    },
    // 放大
    enlarge(steps) {
      this.pdfViewer.increaseScale()
    },
    async load() {
      const linkService = new PDFLinkService()
      const loadingTask = getDocument('./1.pdf')
      const viewer = this.$refs.attachRef
      this.containerNode = viewer
      const pdf = await loadingTask.promise
      if (pdf) {
        const pdfViewer = new PDFViewer({
          container: viewer,
          eventBus: this.eventBus, //  ？？？？
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
          l10n: null,
          defaultRenderingQueue: true // 设置默认渲染整个 PDF
        })
        linkService.setDocument(pdf)
        linkService.setViewer(pdfViewer)
        pdfViewer.setDocument(pdf)
        this.pdfViewer = pdfViewer
        this.pdfDocument = pdf
        this.handTool = new GrabToPan({
          element: viewer
        })
        setTimeout(() => {
          this.findBar = usePdfFindBar({
            findField: document.getElementById('findInput'),
            caseSensitiveCheckbox: document.getElementById('findMatchCase'),
            caseCurPageCheckbox: document.getElementById('findMatchCurPage'),
            findInputSearch: document.getElementById('findInputSearch'),
            findList: document.querySelector('.xr-find__list'),
            pdfDocument: this.pdfDocument,
            pdfViewer: this.pdfViewer,
            findMax: this.findBar.findMax,
            root: document.querySelectorAll('.page')
          })
        })
        // 换用 pointerup 监听鼠标指针释放
        // window.addEventListener('mouseup', this.mouseup)
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
      if (rects.length) {
        Layers[pages[0].number].push({
          id: createUUID(),
          rects,
          number: pages[0].number,
          text: range.toString()
        })
        this.Layers = Object.values(Layers).flat()
        this.renderLayers()
      }
      console.log(this.pdfViewer.scroll)
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
                ></div>
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
    },
    // 定位
    location(note) {
      // document.location.hash = `highlight-${note.id}`
      // 定位到某个页面
      this.pdfViewer.scrollPageIntoView({
        pageNumber: 2
      })
    },
    // 打印
    print() {
      // 水印路径
      const image = new Image()
      image.src = 'https://x.cnki.net/read/Content/Images/CNKILogo.png'
      const renderPromises = []
      // 添加打印信息
      const totalPages = this.pdfDocument.numPages
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        renderPromises.push(
          this.pdfDocument.getPage(pageNumber).then(function(page) {
            const scale = 1.5 // 缩放比例
            const viewport = page.getViewport({ scale: scale })

            const canvas = document.createElement('canvas') // 创建新的画布元素
            const context = canvas.getContext('2d')

            canvas.height = viewport.height
            canvas.width = viewport.width
            console.log(canvas)
            // 打印操作
            return page.render({
              canvasContext: context,
              viewport: viewport
            }).promise.then(() => {
              return canvas
            })
          })
        )
      }
      Promise.all(renderPromises).then((canvases) => {
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        // 将 canvas 元素添加到网页中
        const printWindow = iframe.contentWindow
        canvases.forEach(function(canvas) {
          const context = canvas.getContext('2d')
          // 计算图片在 Canvas 中的绘制位置
          const imageX = (canvas.width - image.width) / 2
          const imageY = (canvas.height - image.height) / 2
          // 在 Canvas 中绘制图片
          context.drawImage(image, imageX, imageY)
          iframe.contentDocument.body.appendChild(canvas)
        })
        printWindow.print()
      })
    }
  }
}
</script>
<style lang="less">
.pdf-container {
  position: relative;
  width: 100%;
  height: 800px;
  //height: calc(100vh - 75px);

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
.pdf-action{
  button{
    margin-right: 5px;
  }
}
.grab-to-pan-grab {
  cursor: grab !important;
}
.grab-to-pan-grab *:not(input):not(textarea):not(button):not(select):not(:link) {
  cursor: inherit !important;
}
</style>
