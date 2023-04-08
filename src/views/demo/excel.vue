<template>
  <a-card :bordered="false">
    读取本地excel表格
    <a-table
      :columns="columns"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="(record,index)=>index"
    />
  </a-card>
</template>
<script>
import excel from '@/mixins/excel.js'
const columns = [
  {
    title: '时间',
    dataIndex: '时间'
  },
  {
    title: '推送状态',
    dataIndex: '推送状态'
  }
]
export default {
  mixins: [excel],
  data() {
    return {
      loading: false,
      columns,
      dataSource: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      this.dataSource = await this.readLocalFile('excel/test.xlsx')
      this.loading = false
    }
  }
}
</script>
