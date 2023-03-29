<!--
  级联选择器
  - 默认省市区级联，数据使用jsonp形式加载（vuex公用方法）
  - 如果自定义数据源，直接赋值dataSource即替换
  - field-names 可自定配置
  - 统一数据接收返回格式：逗号拼接
-->
<template>
  <a-cascader
    :placeholder="`请选择${formField.label}`"
    :value="selectValue"
    :options="treeData"
    :field-names="formField.options['field-names']||{
      multiple: false, // 是否多选
      label: 'name',
      value: 'code',
      children: 'children'
    }"
    :show-search="{ filter }"
    @change="handleChange"
  />
</template>
<script>
export default {
  name: 'Cascade',
  props: {
    value: {},
    formField: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      selectValue: [],
      treeData: []
    }
  },
  watch: {
    formField: {
      deep: true,
      handler(val) {
        if (val.dataSource.length !== 0) {
          this.treeData = val.dataSource
        }
      }
    },
    value: {
      immediate: true,
      handler(val) {
        this.selectValue = (val ?? '') !== '' ? val.split(',') : []
      }
    },
    selectValue: {
      handler(val) {
        this.$emit('input', val.map(i => i).toString())
      }
    }
  },
  // 加载默认省市区列表信息
  async mounted() {
    this.treeData = await this.$store.dispatch('app/getRegionList')
  },
  methods: {
    handleChange(value) {
      this.selectValue = value
      this.$emit('clearValidate', this.formField['prop'])
    },
    filter(inputValue, path) {
      return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    }
  }
}
</script>
