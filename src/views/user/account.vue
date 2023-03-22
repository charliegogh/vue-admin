<template>
  <div class="account-settings-info-view">
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
      >确定
      </a-button>
    </Form>
  </div>
</template>
<script>
export default {
  components: {
  },
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
        formFields: [
          {
            prop: 'username', label: '用户账号', component: 'input'
          },
          {
            prop: 'phone', label: '手机号', component: 'input'
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
<style>
.account-settings-info-view{
  background-color: #ffffff;
  padding: 20px;
}
</style>
