<template>
  <a-card :bordered="false">
    <c-search
      @handleAdd="handleAdd"
      @searchQuery="searchQuery"
      @searchReset="searchReset"
    />
    <a-table
      :columns="columns.filter(i=>(colCheckedList.includes(i.dataIndex)))"
      size="middle"
      :data-source="dataSource"
      :loading="loading"
      :row-key="record=>record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="handlePerssion(record.id)">授权</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
    <RoleModal ref="modalForm" @ok="modalFormOk" />
    <AuthModal ref="AuthModal" @ok="modalFormOk" />
  </a-card>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
import RoleModal from './components/Role/RoleModal'
import AuthModal from './components/Role/AuthModal'
const columns = [
  {
    title: '角色名称',
    align: 'center',
    dataIndex: 'roleName'
  },
  {
    title: '角色编码',
    align: 'center',
    dataIndex: 'roleCode'
  //   test
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: 180
  }
]
export default {
  components: {
    RoleModal,
    AuthModal
  },
  mixins: [ListMixin],
  data() {
    return {
      colCheckedList: columns.map(i => i.dataIndex),
      columns,
      url: {
        list: '/sys/role/list',
        delete: '/sys/role/delete'
      }
    }
  },
  watch: {
    colSetting(value) {
      console.log(value)
    }
  },
  methods: {
    handlePerssion(roleId) {
      this.$refs.AuthModal.show(roleId)
    }
  }
}
</script>
<style lang="less">
.test{
}
</style>
