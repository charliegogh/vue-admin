<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <Form
        ref="Form"
        :rules="rules"
        :data-form="dataForm"
        :form-fields="formFields"
      />
    </a-spin>
    <div class="row-end-end drawer-bottom-button">
      <a-button @click="handleCancel">
        关闭
      </a-button>
      <div>
        <a-button
          :disabled="disableSubmit"
          type="primary"
          @click="handleOk()"
        >保存
        </a-button>
      </div>
    </div>
  </a-drawer>
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
      disableSubmit: false,
      drawerWidth: 700,
      confirmLoading: false,
      visible: false,
      title: '操作',
      dataForm: {},
      rules: {
        unitName: [
          {
            required: true,
            message: '请输入备案县区/单位名称',
            trigger: 'blur'
          }
        ],
        userName: [
          {
            required: true,
            message: '请输入外出人员名称',
            trigger: 'blur'
          }
        ],
        job: [
          {
            required: true,
            message: '请输入职务',
            trigger: 'blur'
          }
        ]
      },
      formFields: [
        {
          prop: 'unitName', label: '备案县区/单位名称', component: 'input'
        },
        {
          prop: 'userName', label: '备案人', component: 'input'
        },
        {
          prop: 'job', label: '职务', component: 'input'
        },
        {
          prop: 'time', label: '时间', component: 'input'
        }
      ]
    }
  },
  watch: {
    dataForm: {
      deep: true,
      immediate: true,
      handler(val, oldVal) {
      }
    },
    dict: {
      deep: true,
      handler(val) {
        this.formFields.forEach(item => {
          Object.keys(val).forEach(child => {
            if (item.prop === child) {
              item.dataSource = val[item.prop]
            }
          })
        })
      }
    }
  },
  mounted() {

  },
  methods: {
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    // 表单提交
    async handleOk() {
      try {
        const status = this.$refs.Form.validate() // 调用组件的校验
        if (status) {
          this.confirmLoading = true
          if (this.dataForm.status) {
            this.dataForm.status ? this.dataForm.status = '0' : this.dataForm.status = '1'
          }
          try {
            const res = await this.$fetch.postAction('/', this.dataForm)
            if (res.success) {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok')
            }
          } catch (e) {
            this.confirmLoading = false
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
      this.resetScreenSize()
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    }
  }
}
</script>
