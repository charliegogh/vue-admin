<template>
  <div class="app-login-container">
    <div class="bg row-end-end">
      <div class="form-wrapper">
        <h2>{{ title }}</h2>
        <div class="form-wrapper--main">
          <div class="title">登录</div>
          <Form
            ref="Form"
            :form-fields="formFields"
            :data-form="dataForm"
            :rules="rules"
          >
            <a-button
              slot="submit"
              size="large"
              type="primary"
              html-type="submit"
              class="login-button"
              :loading="confirmLoading"
              @click="handleSubmit"
            >登录
            </a-button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      confirmLoading: false,
      title: null,
      dataForm: {
        username: 'super',
        password: '1'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      formFields: [
        {
          prop: 'username',
          label: '账号',
          component: 'input'
        },
        {
          prop: 'password',
          label: '密码',
          component: 'password'
        }
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          console.log(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const status = this.$refs.Form.validate()
        if (status) {
          this.confirmLoading = true
          const rs = await this.$store.dispatch('user/login', this.dataForm)
          if (rs.code === 200) {
            await this.$router.replace({ path: this.redirect || '/' })
          } else {
            this.confirmLoading = false
            this.$message.error(rs.Message)
          }
        }
      } catch (e) {
        this.confirmLoading = false
      }
    }
  }
}
</script>
<style lang="less">
.form-wrapper--main {
  background-color: #ffffff;
  border-radius: 5px;
  .from-container {
    padding: 10px 15px;
  }
}
</style>
<style lang="less" scoped>
.app-login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  .bg {
    width: 100%;
    background-color: #0183e1;
    padding: 50px 50px;
    .form-wrapper {
      width: 350px;
      font-size: 14px;
      position: relative;
      h2 {
        color: #fff;
        margin-bottom: 1rem;
        letter-spacing: 1px;
        font-size: 28px;
        font-weight: 800;
        text-align: center;
      }
      button {
        width: 100%;
      }
      .title {
        border-bottom: 1px solid #e8eaec;
        padding: 18px 16px;
        font-weight: 500;
        font-size: 16px;
        background: #fff;
        border-radius: 4px 4px 0 0;
      }
    }
  }
}
</style>
