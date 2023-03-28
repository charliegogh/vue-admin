<template>
  <Form
    ref="Form"
    v-bind="Form"
  >
    <a-button
      slot="submit"
      type="primary"
      html-type="submit"
      class="login-button"
      :loading="confirmLoading"
      @click="handleSubmit"
    >提交
    </a-button>
  </Form>
</template>
<script>
export default {
  name: 'BaseSetting',
  data() {
    return {
      confirmLoading: false,
      Form: {
        ref: 'Form',
        dataForm: {},
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户账号',
              trigger: 'blur'
            }
          ]
        },
        // 按空配置处理
        layout: {},
        formFields: [
          {
            prop: 'username', label: '姓名', component: 'input'
          },
          {
            prop: 'phone', label: '手机号', component: 'input'
          },
          {
            prop: 'email', label: '邮箱', component: 'input'
          }
        ]
      },
      submitLoading: false
    }
  },
  methods: {
    handleSubmit() {
      const status = this.$refs.Form.validate() // 调用组件的校验
      if (status) {
        this.confirmLoading = true
      }
    }
  }
}
</script>
