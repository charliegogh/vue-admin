<template>
  <a-card :bordered="false">
    <Form
      ref="Form"
      v-bind="form"
    >
      <a-button
        slot="submit"
        type="primary"
        html-type="submit"
        class="login-button"
        :loading="confirmLoading"
        @click="handleSubmit"
      > 发送
      </a-button>
    </Form>
  </a-card>
</template>
<script>
export default {
  data() {
    return {
      confirmLoading: false,
      form: {
        dataForm: {
          url: null,
          suffix: '.doxc',
          name: 'test'
        },
        rules: {
          url: [
            {
              required: true,
              message: '请输入请求路径',
              trigger: 'blur'
            }
          ]
        },
        formFields: [
          {
            prop: 'url',
            label: '请求路径',
            component: 'textarea'
          },
          {
            prop: 'name',
            label: '文件名称',
            component: 'input'
          },
          {
            prop: 'suffix',
            label: '文件后缀',
            component: 'input'
          }
        ]
      }
    }
  },
  methods: {
    async handleSubmit(e) {
      try {
        const status = this.$refs.Form.validate()
        if (status) {
          this.confirmLoading = true
          const { url, suffix, name } = this.form.dataForm
          const res = await this.$fetch.getAction(url)
          const blob = new Blob([res])
          // 创建下载链接
          const link = document.createElement('a')
          const objectUrl = URL.createObjectURL(blob) // 创建URL
          link.href = objectUrl
          // 执行下载名称
          link.download = name + '.' + suffix
          link.click() // 下载文件
          // 清理下载链接
          document.body.removeChild(link)
          URL.revokeObjectURL(objectUrl)
        }
      } catch (e) {
        this.confirmLoading = false
      }
    }
  }
}
</script>
