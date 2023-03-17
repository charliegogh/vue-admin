<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      :columns="columns"
      size="middle"
      :pagination="false"
      :data-source="dataSource"
      :loading="loading"
      :row-key="record=>record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleAddSub(record)">添加下级</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <MenuModal v-if="!loading" ref="modalForm" :menu-list="dataSource" @ok="modalFormOk" />
  </a-card>
</template>
<script>
import MenuModal from './components/MenuModal'
import { ListMixin } from '@/mixins/ListMixin'
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '路径',
    dataIndex: 'url',
    key: 'url',
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort'
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
    MenuModal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      url: {
        list: '/sys/permission/getSystemMenuList',
        delete: '/sys/permission/delete'
      }
    }
  },
  mounted() {

  },
  methods: {
    handleAddSub(record) {
      this.$refs.modalForm.title = '添加子菜单'
      this.$refs.modalForm.edit({ type: 1, 'pid': record.id })
    }
  }
}
</script>
