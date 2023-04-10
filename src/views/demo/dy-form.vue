<template>
  <a-card :bordered="false">
    <a-tabs
      v-model="active"
      :default-active-key="0"
      tab-position="top"
      type="editable-card"
      @edit="onEdit"
      @change="(e)=>active=e"
    >
      <a-tab-pane
        v-for="(item,index) of dataForm.list"
        :key="item.id"
        :tab="`记录-${index+1}`"
      >
        <Form
          :ref="'Form'+item.id"
          :data-form="item"
          :form-fields="formFields"
          :rules="rules"
        />
      </a-tab-pane>
    </a-tabs>
    <a-button
      @click="submit"
    >提交
    </a-button>
  </a-card>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      rules: {
        name: [
          {
            required: true,
            message: '请输入~~',
            trigger: 'blur'
          }
        ]
      },
      dataForm: {
        list: [
          {
            id: 0
          }
        ]
      },
      formFields: [
        {
          prop: 'name', label: '名称', component: 'input'
        },
        {
          prop: 'code', label: '编码', component: 'input'
        }
      ]
    }
  },
  async mounted() {
  },
  methods: {
    validate() {
      return this.dataForm.list.map((i, index) => (this.$refs[`Form${i.id}`][0].validate())).every(i => i === true)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    // 新增
    add() {
      if (!this.validate()) return false
      const id = Date.now()
      this.dataForm.list.push({
        id
      })
      this.active = id
    },
    remove(targetKey) {
      const tar = this.dataForm.list
      if (tar.length === 1) {
        this.$message.error('至少需要一条记录')
      }
      let activeKey = this.active
      let lastIndex
      tar.forEach((pane, i) => {
        if (pane.id === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = tar.filter(pane => pane.id !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].id
        } else {
          activeKey = panes[0].id
        }
      }
      this.dataForm.list = panes
      this.active = activeKey
    },
    submit() {
      if (!this.validate()) return false
      console.log(this.dataForm)
    }
  }
}
</script>
