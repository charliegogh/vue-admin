<template>
  <a-drawer
    :title="title"
    :mask-closable="true"
    :width="drawerWidth"
    placement="right"
    :visible="visible"
    :closable="true"
    :confirm-loading="confirmLoading"
    @close="handleCancel"
  >
    <div class="drawer-modal-body">
      <a-spin :spinning="confirmLoading">
        <Form
          v-bind="form"
        />
      </a-spin>
      <a-row class="menu-modal-footer row-end-end">
        <a-button @click="handleCancel">
          关闭
        </a-button>
        <a-button
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
        >确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'MenuModal',
  components: { },
  props: {
    dictList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const dict = {
      dictType: [
        {
          code: '0',
          name: '一级菜单',
          list: ['dictType', 'name', 'code', 'sort']
        },
        {
          code: '1',
          name: '子菜单',
          list: ['dictType', 'name', 'parentId', 'code', 'sort']
        }
      ]
    }
    return {
      dict,
      visible: false,
      form: {
        ref: 'Form',
        dataForm: {
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入菜单名称',
              trigger: 'blur'
            }
          ],
          url: [
            {
              required: true,
              message: '请输入菜单路径',
              trigger: 'blur'
            }
          ],
          dict: [
            {
              required: true,
              message: '请输入字典编码',
              trigger: 'blur'
            }
          ]
        },
        formFields: [
          {
            prop: 'dictType', label: '菜单类型', component: 'radio-group',
            dataSource: dict.dictType,
            event: {
              change: (e) => {
                this.onChangeDictType(e)
              }
            }
          },
          {
            prop: 'name', label: '字典名称', component: 'input'
          },
          {
            prop: 'parentId',
            label: '上级菜单',
            component: 'tree-select',
            dict: 'dictList',
            options: {
              replaceFields: {
                title: 'name',
                key: 'id',
                value: 'id'
              }
            }
          },
          {
            prop: 'code', label: '字典编码', component: 'input'
          },
          {
            prop: 'sort', label: '排序', component: 'input'
          }
        ]
      },
      confirmLoading: false,
      drawerWidth: 700,
      title: '操作'
    }
  },
  watch: {
    'form.dataForm.dictType': {
      immediate: true,
      handler(val) {
        this.form.formFields.forEach(item => {
          item.show = this.dict.dictType.find(item => item.code === val)?.list.includes(item.prop)
        })
      }
    },
    dictList: {
      immediate: true,
      handler(val) {
        this.form.formFields.find(i => (i.prop === 'parentId' && (i.dataSource = val)))
      }
    }
  },
  created() {

  },
  methods: {
    // 切换菜单类型
    onChangeDictType(e) {
      this.form.dataForm.dictType = e?.target?.value || '0'
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    add() {
      this.edit({ dictType: '0', parentId: '' })
    },
    edit(record) {
      this.form.dataForm = Object.assign({}, record)
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    async handleOk() {
      const status = this.$refs.Form.validate() // 调用组件的校验
      try {
        if (status) {
          this.confirmLoading = true
          const dataForm = this.form.dataForm
          let res
          if (!dataForm.id) {
            res = await this.$fetch.postAction('/sys/dict/add', dataForm)
          } else {
            res = await this.$fetch.postAction('/sys/dict/edit', dataForm)
          }
          if (res.success) {
            this.$message.success('操作成功')
            this.confirmLoading = false
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error('操作失败')
            this.confirmLoading = false
          }
        }
      } catch (e) {
        throw e
      }
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      const screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
