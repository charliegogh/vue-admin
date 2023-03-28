<template>
  <CDrawer
    v-model="visible"
    :loading="confirmLoading"
    @handleSubmit="handleOk"
  >
    <Form v-bind="Form" />
  </CDrawer>
</template>
<script>
import { deepClone } from '_utils'

export default {
  name: 'MenuModal',
  components: { },
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const dict = {
      type: [
        {
          code: 0,
          name: '一级菜单',
          menus: ['type', 'name', 'pageUrl', 'icon', 'orderNo']
        },
        {
          code: 1,
          name: '子菜单',
          menus: ['type', 'pid', 'name', 'pageUrl', 'icon', 'orderNo']
        },
        {
          code: 2,
          name: '按钮/权限',
          menus: ['name', 'code', 'type', 'orderNo']
        }
      ]
    }
    return {
      dict,
      visible: false,
      Form: {
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
          pageUrl: [
            {
              required: true,
              message: '请输入菜单路径',
              trigger: 'blur'
            }
          ],
          code: [
            {
              required: true,
              message: '请输入字典编码',
              trigger: 'blur'
            }
          ]
        },
        formFields: [
          {
            prop: 'type', label: '菜单类型', component: 'radio-group',
            dataSource: dict.type,
            event: {
              change: (e) => {
                this.onChangeMenuType(e)
              }
            }
          },
          {
            prop: 'name', label: '菜单名称', component: 'input'
          },
          {
            prop: 'pid',
            label: '上级菜单',
            component: 'treeSelect',
            dict: 'menu',
            treeData: this.menuList,
            replaceFields: {
              title: 'name',
              key: 'id',
              value: 'id'
            }
          },
          {
            prop: 'pageUrl', label: '菜单路径', component: 'input'
          },
          {
            prop: 'code', label: '字典编码', component: 'input'
          },
          {
            prop: 'orderNo', label: '排序', component: 'input'
          },
          {
            prop: 'icon', label: '菜单图标', component: 'input'
          }
        ]
      },
      confirmLoading: false,
      drawerWidth: 700,
      title: '操作'
    }
  },
  watch: {
    'Form.dataForm.type': {
      immediate: true,
      handler(val) {
        this.Form.formFields.forEach(item => {
          item.show = this.dict.type.find(item => item.code === val)?.menus.includes(item.prop)
        })
      }
    }
  },
  methods: {
    // 切换菜单类型
    onChangeMenuType(e) {
      this.Form.dataForm.type = e?.target?.value || 0
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    add() {
      this.edit({ type: 0, pid: '' })
    },
    edit(record) {
      this.Form.dataForm = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.$refs.Form.clearValidate()
      })
    },
    async handleOk() {
      try {
        const status = this.$refs.Form.validate() // 调用组件的校验
        if (status) {
          this.confirmLoading = true
          const dataForm = deepClone(this.Form.dataForm)
          delete dataForm.children
          let res
          if (!dataForm.id) {
            res = await this.$fetch.postAction('/sys/permission/add', dataForm)
          } else {
            res = await this.$fetch.postAction('/sys/permission/edit', dataForm)
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
    }
  }
}
</script>

<style scoped lang="less">

</style>
