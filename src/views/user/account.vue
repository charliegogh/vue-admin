<template>
  <div class="account-settings-info-view">
    <Form
      ref="Form"
      :data-form="dataForm"
      :rules="rules"
      :label-col="2"
      :form-fields="formFields"
    >
      <a-form-item>
        <a-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >保存</a-button>
      </a-form-item>
    </Form>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
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
      submitLoading: false,
      formFields: [
        {
          prop: 'username', label: '用户账号', component: 'input'
        },
        {
          prop: 'phone', label: '手机号', component: 'input'
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      const status = this.$refs.Form.validate() // 调用组件的校验
      if (status) {
        this.submitLoading = true
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
