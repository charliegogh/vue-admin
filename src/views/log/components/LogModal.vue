
<template>
  <a-drawer
    :visible="visible"
    :width="700"
    @close="visible=false"
  >
    <div v-for="(item,idx) of dataForm" :key="idx">
      <span style="color: red">{{ idx }}：</span>
      <p>{{ item }}</p>
    </div>
  </a-drawer>
</template>
<script>
export default {
  data() {
    return {
      confirmLoading: false,
      visible: false,
      title: '操作',
      dataForm: {}
    }
  },
  methods: {
    detail(record) {
      this.dataForm = Object.assign({}, record)
      this.visible = true
    }
  }
}
</script>

