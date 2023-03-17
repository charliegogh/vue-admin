<template>
  <a-drawer
    :title="title"
    :mask-closable="true"
    placement="right"
    :closable="true"
    :width="drawerWidth"
    :visible="visible"
    @close="handleCancel"
  >

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <Form
        v-if="visible"
        ref="Form"
        :data-form="dataForm"
        :rules="rules"
        :form-fields="formFields"
      />
    </a-spin>
    <div v-show="!disableSubmit" class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="handleCancel">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
export default {
  props: {
    dict: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      disableSubmit: false,
      title: '操作',
      confirmLoading: false,
      visible: false,
      drawerWidth: 700,
      dataForm: {
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ],
        roles: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ]
      },
      formFields: [
        {
          prop: 'username', label: '用户账号', component: 'input'
        },
        {
          prop: 'realname', label: '用户姓名', component: 'input'
        },
        {
          prop: 'password', label: '登录密码', component: 'password'
        },
        {
          prop: 'phone', label: '手机号', component: 'input'
        },
        {
          prop: 'roles', label: '角色分配', component: 'select',
          dict: 'roles',
          options: {
            value: 'id',
            label: 'roleName'
          }
        },
        {
          prop: 'sex', label: '性别', component: 'select',
          dict: 'sex'
        },
        {
          prop: 'avatar', label: '头像', component: 'upload',
          options: {
            listType: 'picture-card'
          }
        },
        {
          prop: 'status', label: '状态', component: 'switch',
          dict: 'status',
          options: {
            'checked-children': '启用',
            'un-checked-children': '禁用'
          }
        }
      ]
    }
  },
  watch: {
    'dict': {
      immediate: true,
      deep: true,
      handler(val) {
        this.formFields.forEach(f => {
          Object.keys(val).forEach(d => {
            if (f.dict === d) f.dataSource = val[f.dict]
          })
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    handleCancel() {
      this.visible = false
    },
    add() {
      this.edit({ status: '0' })
    },
    // 编辑
    edit(record) {
      this.dataForm = Object.assign({}, record)
      this.resetScreenSize()
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    async handleSubmit() {
      const status = this.$refs.Form.validate()
      if (status) {
        try {
          this.confirmLoading = true
          let res
          if (!this.dataForm.id) {
            res = await this.$fetch.postAction('/sys/user/add', this.dataForm)
          } else {
            res = await this.$fetch.postAction('/sys/user/edit', this.dataForm)
          }
          if (res.success) {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          } else {
            this.confirmLoading = false
          }
        } catch (e) {
          this.$message.error(e)
          this.confirmLoading = false
          this.visible = false
        }
      }
    }
  }
}
</script>
<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>
