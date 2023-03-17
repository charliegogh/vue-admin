<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      ref="Form"
      :data-form="dataForm"
      :rules="rules"
      :form-fields="formFields"
    />
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      title: '操作',
      confirmLoading: false,
      visible: false,
      dataForm: {},
      rules: {
        roleCode: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ]
      },
      formFields: [
        {
          prop: 'roleCode', label: '角色编码', component: 'input'
        },
        {
          prop: 'roleName', label: '角色名称', component: 'input'
        }
      ]
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 新增
    add() {
      this.edit({})
    },
    // 编辑
    edit(record) {
      this.dataForm = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    // 提交
    async handleOk() {
      const status = this.$refs.Form.validate()
      if (status) {
        this.confirmLoading = true
        try {
          let res
          if (!this.dataForm.id) {
            res = await this.$fetch.postAction('/sys/role/add', this.dataForm)
          } else {
            res = await this.$fetch.postAction('/sys/role/edit', this.dataForm)
          }
          if (res.success) {
            this.$emit('ok')
            this.visible = false
            this.confirmLoading = false
          }
        } catch (e) {
          this.confirmLoading = false
          throw e
        }
      }
    }
  }
}
</script>
