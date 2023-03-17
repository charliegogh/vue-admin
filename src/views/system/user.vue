<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">添加用户</a-button>
    </div>

    <c-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
    >
      <template slot="formatRoleName" slot-scope="record">
        <span>{{ record.roles | formatDict(dict.roles,'id','roleName') }}</span>
      </template>
      <template slot="formatSex" slot-scope="record">
        <span>{{ record.sex | formatDict(dict.sex) }}</span>
      </template>
      <template slot="formatStatus" slot-scope="record">
        <span>{{ record.status | formatDict(dict.status) }}</span>
      </template>
      <template slot="avatarslot" slot-scope="record">
        <div class="anty-img-wrap">
          <a-avatar shape="square" :src="$config.fileContext+record.avatar" icon="user" />
        </div>
      </template>
    </c-table>
    <user-modal
      ref="modalForm"
      :dict="dict"
      @ok="modalFormOk"
    />
  </a-card>
</template>
<script>
import UserModal from './components/UserModal'
import { ListMixin } from '@/mixins/ListMixin'
const columns = [
  {
    title: '用户账号',
    dataIndex: 'username',
    align: 'center',
    key: 'username'
  },
  {
    title: '角色名称',
    scopedSlots: { customRender: 'formatRoleName' },
    align: 'center',
    key: 'roleName'
  },
  {
    title: '头像',
    scopedSlots: { customRender: 'avatarslot' },
    align: 'center',
    key: 'avatar'
  },
  {
    title: '性别',
    scopedSlots: { customRender: 'formatSex' },
    align: 'center',
    key: 'sex'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'formatStatus' },
    align: 'center',
    key: 'status'
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
    UserModal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      url: {
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        dict: [
          {
            code: 'roles',
            api: '/sys/role/list'
          }
        ]
      },
      dict: {
        sex: [
          {
            name: '男',
            code: '0'
          },
          {
            name: '女',
            code: '1'
          }
        ],
        status: [
          {
            name: '启用',
            code: '0'
          },
          {
            name: '禁用',
            code: '1'
          }
        ]
      }
    }
  },
  created() {

  }
}
</script>

