<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :visible="visible"
    @close="handleCancel"
  >
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd()">新增</a-button>
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
      <template slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <ModalForm
      ref="modalForm"
      @ok="modalFormOk"
    />
  </a-drawer>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
import ModalForm from './Handle'
export default {
  components: {
    ModalForm
  },
  mixins: [ListMixin],
  data() {
    return {
      columns: [
        {
          title: '名称',
          dataIndex: 'value',
          align: 'center'
        },
        {
          title: '编码',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'orderNo',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 150
        }
      ],
      drawerWidth: 700,
      visible: false,
      title: '字典列表',
      dataForm: {},
      url: {
        list: '/sys/dictValue/getList',
        delete: '/sys/dictValue/delete'
      },
      queryParam: {},
      disableMixinCreated: true
    }
  },
  methods: {
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    show(record) {
      this.queryParam.id = record.id || ''
      this.visible = true
      this.resetScreenSize()
      this.loadData()
    }
  }
}
</script>
