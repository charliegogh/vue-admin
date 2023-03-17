<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="旧密码"
        >
          <a-input v-decorator="[ 'oldpassword', validatorRules.oldpassword]" type="password" placeholder="请输入旧密码" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="新密码"
        >
          <a-input v-decorator="[ 'password', validatorRules.password]" type="password" placeholder="请输入新密码" />
        </a-form-item>

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="确认新密码"
        >
          <a-input v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]" type="password" placeholder="请确认新密码" @blur="handleConfirmBlur" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import { putAction } from '@/api'

export default {
  name: 'UserPassword',
  data() {
    return {
      title: '修改密码',
      modalWidth: 800,
      visible: false,
      confirmLoading: false,
      validatorRules: {
        oldpassword: {
          rules: [{
            required: true, message: '请输入旧密码!'
          }]
        },
        password: {
          rules: [{
            required: true, message: '请输入新密码!'
          }, {
            validator: this.validateToNextPassword
          }]
        },
        confirmpassword: {
          rules: [{
            required: true, message: '请确认新密码!'
          }, {
            validator: this.compareToFirstPassword
          }]
        }
      },
      confirmDirty: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      form: this.$form.createForm(this),
      url: 'sys/user/updatePassword',
      username: ''
    }
  },
  methods: {
    show(uname) {
      if (!uname) {
        this.$message.warning('当前系统无登录用户!')
        return
      } else {
        this.username = uname
        this.form.resetFields()
        this.visible = true
      }
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          const params = Object.assign({ username: this.username }, values)
          putAction(this.url, params).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.close()
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }
      })
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    }

  }
}
</script>

<style scoped>

</style>

