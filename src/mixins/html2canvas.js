import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      importDomLoading: false
    }
  },
  methods: {
    importDom(name) {
      this.importDomLoading = true
      try {
        this.$nextTick(() => {
          const canvasID = this.$refs.importDom
          const a = document.createElement('a')
          html2canvas(canvasID, { useCORS: true,
            ignoreElements: (element) => {
              if (element.classList.contains('no-win')) {
                return true
              }
            }
          }).then(canvas => {
            const dom = document.body.appendChild(canvas)
            dom.style.display = 'none'
            a.style.display = 'none'
            const result = dom.toDataURL('image/png')
            a.setAttribute('href', result)
            a.setAttribute('download', `${name}.png`)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            this.importDomLoading = false
          })
        })
      } catch (e) {
        this.importDomLoading = false
      }
    }
  }
}
