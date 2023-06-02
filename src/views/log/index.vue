<template>
  <a-card :bordered="false">
    <a-table
      :columns="columns"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="record=>record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetail(record)">查看</a>
      </span>
    </a-table>
    <Modal
      ref="modalForm"
    />
  </a-card>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
import Modal from './components/LogModal.vue'
const columns = [
  {
    'dataIndex': 'id',
    'title': 'id',
    'align': 'center'
  },
  {
    'dataIndex': 'createTime',
    'title': '创建时间',
    'align': 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center'
  }
]
export default {
  components: {
    Modal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      url: {
        list: '/cnkiLog/List'
      }
    }
  },
  methods: {
  }
}
</script>
