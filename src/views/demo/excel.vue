<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="/excel/test.xlsx">模板下载</a>
          </a-menu-item>
          <a-menu-item>
            <ImportFile
              :show-upload-list="false"
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              @change="handleFileChange"
            />
          </a-menu-item>
        </a-menu>
        <a-button type="primary" icon="import" :loading="importLoading">
          {{ importLoading ? "正在加载" : "导入" }}</a-button>
      </a-dropdown>
    </div>

    <a-table
      :columns="columns"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="(record, index) => index"
    />
  </a-card>
</template>
<script>
import ImportFile from '@/components/c-form/components/ImportFile'
import xlsxLoader from '@/plugins/xlsx'
const columns = [
  {
    title: 'id',
    dataIndex: 'school_id'
  },
  {
    title: '学校名称',
    dataIndex: 'hightitle'
  }
]
export default {
  components: {
    ImportFile
  },
  data() {
    return {
      loading: false,
      columns,
      importLoading: false,
      dataSource: []
    }
  },
  mounted() {},
  methods: {
    async handleFileChange(el) {
      this.loading = true
      await xlsxLoader()
      const XLSX = window.XLSX
      this.importLoading = true
      const rawFile = el
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.dataSource = results
          this.importLoading = false
          this.loading = false
          this.$message.success('导入成功')
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }
  }
}
</script>
