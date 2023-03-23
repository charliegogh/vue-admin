<template>
  <a-card :bordered="false">
    <c-search
      :data-form="{}"
      :form-fields="formFields"
      @handleAdd="handleAdd"
      @searchQuery="searchQuery"
      @searchReset="searchReset"
    />
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
      <!--      <template slot="action" slot-scope="record" />-->
    </c-table>
    <user-modal
      ref="modalForm"
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
  name: 'User',
  components: {
    UserModal
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      formFields: [
        {
          prop: 'username', label: '用户账号', component: 'input'
        }
      ],
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
        sys_user_status: [
          {
            name: '正常',
            code: '0'
          },
          {
            name: '停用',
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

