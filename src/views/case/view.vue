<template>
  <a-card :bordered="false">
    <QueryForm
      v-bind="filter"
      @searchReset="searchReset"
      @searchQuery="searchQuery"
    />
    <a-table
      :columns="columns"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="record=>record.id"
    >
      <template slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <Modal
      ref="modalForm"
    />
  </a-card>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
import Modal from './modal'
const columns = [
  {
    title: '链接类型',
    dataIndex: 'type',
    align: 'center'
  },
  {
    title: '基金类型',
    dataIndex: 'fundType',
    align: 'center'
  },
  {
    title: '基金名称',
    dataIndex: 'fundName',
    align: 'center'
  },
  {
    title: '基金管理公司',
    dataIndex: 'fundCompany',
    align: 'center'
  },
  {
    title: '基金管理公司',
    dataIndex: 'scaleFirst',
    align: 'center'
  },
  {
    title: '投资领域',
    dataIndex: 'domain',
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 150
  }
]
export default {
  components: {
    QueryForm,
    Modal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      query: {
        dataForm: {},
        formFields: [
          {
            prop: 'name', label: '名称', component: 'input'
          },
          {
            prop: 'date', label: '选择日期', component: 'date-range'
          },
          {
            prop: 'ff', label: '发布频率', component: 'checkbox-group',
            dataSource: [
              {
                name: '季度报告',
                code: '0'
              },
              {
                name: '年度报告',
                code: '1'
              }
            ]
          }
        ]
      },
      url: {
        list: '/'
      }
    }
  },
  methods: {
  }
}
</script>
