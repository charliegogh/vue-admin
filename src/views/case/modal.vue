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
  components: {
  },
  props: {
    dict: {
      type: Object
    }
  },

  data() {
    return {
      confirmLoading: false,
      visible: false,
      title: '操作',
      Form: {
        dataForm: {},
        formField: [

        ],
        rules: {}
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
          const res = await this.$fetch.postAction('/', this.dataForm)
          if (res.success) {
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
      this.dataForm = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    }
  }
}
</script>

