<template>
  <a-card :bordered="false">
    <a-button @click="handleAdd">新增</a-button>
    <a-tabs
      v-model="active"
      :default-active-key="0"
      tab-position="top"
      @change="(e)=>{
        active=e
      }"
    >
      <a-tab-pane
        v-for="(item,index) of dataForm.list"
        :key="index"
        :tab="`记录-${index+1}`"
      />
    </a-tabs>
    <div
      v-for="(item,index) of dataForm.list"
      :key="item.id"
    >
      <Form
        v-show="active===index"
        :data-form="item"
        :form-fields="formFields"
      />
    </div>
  </a-card>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      dataForm: {
        list: [
          {
            id: Date.now()
          }
        ]
      },
      formFields: [
        {
          prop: 'name', label: '名称', component: 'input'
        }
      ]
    }
  },
  watch: {
    'dataForm.list': {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val)
      }
    }
  },
  async mounted() {
  },
  methods: {
    // 新增
    handleAdd() {
      this.dataForm.list.push({
        id: Date.now()
      })
      this.active++
    }
  }
}
</script>
