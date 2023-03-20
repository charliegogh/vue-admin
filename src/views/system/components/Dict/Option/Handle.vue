<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    wrap-class-name="ant-modal-cust-warp"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <Form
      ref="Form"
      v-bind="Form"
    />
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      confirmLoading: false,
      visible: false,
      title: '操作',
      Form: {
        dataForm: {},
        formFields: [
          {
            prop: 'value', label: '名称', component: 'input'
          },
          {
            prop: 'code', label: '编码', component: 'input'
          },
          {
            prop: 'orderNo', label: '排序', component: 'input'
          }
        ],
        rules: {
          value: [
            {
              required: true,
              message: '请输入字典名称',
              trigger: 'blur'
            }
          ],
          code: [
            {
              required: true,
              message: '请输入字典编码',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    // 表单提交
    async handleOk() {
      try {
        this.confirmLoading = true
        const status = this.$refs.Form.validate() // 调用组件的校验
        if (status) {
          const dataForm = this.Form.dataForm
          let res
          if (!dataForm.id) {
            res = await this.$fetch.postAction('/sys/dictValue/add', dataForm)
          } else {
            res = await this.$fetch.postAction('/sys/dictValue/edit', dataForm)
          }
          if (res.code === 200) {
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok')
          }
        }
      } catch (e) {
        this.confirmLoading = false
      }
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 新增
    add() {
      this.edit({})
    },
    edit(record) {
      this.Form.dataForm = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    }
  }
}
</script>

