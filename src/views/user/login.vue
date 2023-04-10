<template>
  <div class="app-login-container">
    <div class="bg">
      <div class="w960 row-between-center">
        <img src="~@/assets/img/login.png" class="enter-x-animation" alt="">
        <div class="form-wrapper enter-x-animation">
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
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      confirmLoading: false,
      title: this.$config.title,
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
          prop: 'username', label: '账号', component: 'input'
        },
        {
          prop: 'password', label: '密码', component: 'password'
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
        }
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    async handleSubmit(e) {
      const status = this.$refs.Form.validate()
      if (status) {
        this.confirmLoading = true
        this.login(this.dataForm).then((res) => {
          if (res.code === 200) {
            this.$router
              .replace({
                path: this.redirect || '/'
              }).catch(() => {})
          } else {
            this.confirmLoading = false
          }
        }).catch((e) => {
          this.confirmLoading = false
          this.$message.error('服务器错误')
        })
      }
    }
  }
}
</script>
<style lang="less">
@import "~@/styles/animations.less";
.form-wrapper--main{
  background-color: #ffffff;
  border-radius: 5px;
  .from-container{
    padding: 10px;
    .ant-row:last-child{
    }
  }
  .ant-row{
  }
}
</style>
<style lang="less" scoped>
.w960 {
  width: 960px;
  margin: 0 auto;
}

.app-login-container {
  height: 100vh;
  display: flex;
  align-items: center;

  .bg {
    width: 100%;
    background-color: #0183e1;
    padding: 50px 0;

    .form-wrapper {
      width: 350px;
      font-size: 14px;
      position: relative;
      transform: translate(50px);
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

    img {
      width: 450px;
      transform: translate(-50px);
    }
  }
}
</style>
