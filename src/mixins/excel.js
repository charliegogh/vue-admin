import axios from 'axios'
import xlsxLoader from '@/plugins/xlsx'
export default {
  methods: {
    // 导出
    exportExcel(tHeader, filterVal, exportData) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal, exportData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'excel'
        })
      })
    },
    formatJson(filterVal, exportData) {
      return exportData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 解析excel
    async readLocalFile(url) {
      await xlsxLoader()
      const XLSX = window.XLSX
      const res = await axios.get(url, {
        responseType: 'arraybuffer'
      })
      const data = new Uint8Array(res.data)
      const wb = XLSX.read(data, { type: 'array' })
      const firstSheetName = wb.SheetNames[0] // 获取文档数据
      const worksheet = wb.Sheets[firstSheetName]
      const result = XLSX.utils.sheet_to_json(worksheet)
      return Promise.resolve(result)
    }
  }
}
