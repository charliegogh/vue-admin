<template>
  <CDrawer
    v-model="visible"
    :loading="confirmLoading"
    @handleSubmit="handleSubmit"
  >
    <Form v-bind="Form" />
  </CDrawer>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      title: '操作',
      confirmLoading: false,
      visible: false,
      Form: {
        ref: 'Form',
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
            dict: 'sys_user_status',
            options: {
              'checked-children': '启用',
              'un-checked-children': '禁用'
            }
          }
        ]
      }
    }
  },
  methods: {
    add() {
      this.edit()
    },
    // 编辑
    edit(record) {
      this.Form.dataForm = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    async handleSubmit() {
      const status = this.$refs.Form.validate()
      if (status) {
        try {
          const Form = this.dataForm
          this.confirmLoading = true
          let res
          if (!Form.id) {
            res = await this.$fetch.postAction('/sys/user/add', Form)
          } else {
            res = await this.$fetch.postAction('/sys/user/edit', Form)
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

