<template>
  <a-card :bordered="false">
    <div class="pdf-container">
      <div
        id="viewer"
        ref="attachRef"
        class="PdfHighlighter"
      >
        <div class="pdfViewer" />
      </div>
    </div>
  </a-card>
</template>
<script>
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
GlobalWorkerOptions.workerSrc = pdfjsWorker
import {
  EventBus,
  PDFViewer,
  PDFLinkService
} from 'pdfjs-dist/legacy/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'
export default {
  data() {
    return {
      containerNode: null
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      var loadingTask = getDocument('./1.pdf')
      let viewer = document.getElementById('viewer');
      loadingTask.promise.then(
        pdf => {
          const pdfViewer = new PDFViewer({
            container: viewer,
            textLayerMode: 2,
            annotationMode: 2,
            annotationEditorMode: 0,
            enablePrintAutoRotate: true,
            useOnlyCssZoom: false,
            maxCanvasPixels: 16777216,
            enablePermissions: false,
            removePageBorders: true,
            linkService: self.linkService,
            renderer: 'canvas',
            l10n: null,
          })
          console.log(pdfViewer)
          pdfViewer.setDocument(pdf)
        },
        reason => {
          // PDF loading error
          console.error(reason)
        }
      )
    }
  }
}
</script>
<style lang="less">
.pdf-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 75px);
  .PdfHighlighter{
    position: absolute;
    overflow: auto;
    width: 100%;
    height: calc(100vh - 75px);
  }
}

</style>
