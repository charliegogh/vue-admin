<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        v-permission="['add:dict']"
        type="primary"
        icon="plus"
        @click="handleAdd"
      >新增</a-button>
    </div>
    <a-table
      :columns="columns"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="record=>record.id"
    >
      <template slot="formatTime" slot-scope="text, record">
        <span>{{ record.createTime | formatDateMM }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleOption(record)">字典配置</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <DictModal
      ref="modalForm"
      @ok="modalFormOk"
    />
    <DictOptionModal
      ref="DictOptionModal"
      @ok="modalFormOk"
    />
  </a-card>
</template>
<script>
import DictModal from './components/Dict/Modal'
import DictOptionModal from './components/Dict/Option/index'
import { ListMixin } from '@/mixins/ListMixin'
const columns = [
  {
    title: '字典名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '字典编码',
    dataIndex: 'code',
    key: 'path',
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'order_no',
    align: 'center',
    key: 'sort'
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 200
  }
]
export default {
  components: {
    DictModal,
    DictOptionModal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      url: {
        list: '/sys/dictCode/getList',
        delete: '/sys/dictCode/delete'
      }
    }
  },
  methods: {
    handleOption(record) {
      this.$refs.DictOptionModal.show(record)
    }
  }
}
</script>
