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
          menus: ['type', 'name', 'pageUrl', 'icon']
        },
        {
          code: 1,
          name: '子菜单',
          menus: ['type', 'pid', 'name', 'pageUrl', 'icon']
        },
        {
          code: 2,
          name: '按钮/权限',
          menus: ['code', 'type']
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
    'form.dataForm.type': {
      immediate: true,
      handler(val) {
        this.form.formFields.forEach(item => {
          item.show = this.dict.type.find(item => item.code === val)?.menus.includes(item.prop)
        })
      }
    }
  },
  methods: {
    // 切换菜单类型
    onChangeMenuType(e) {
      this.form.dataForm.type = e?.target?.value || 0
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    add() {
      this.edit({ type: 0, pid: '' })
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
      try {
        const status = this.$refs.Form.validate() // 调用组件的校验
        if (status) {
          this.confirmLoading = true
          const dataForm = deepClone(this.form.dataForm)
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
