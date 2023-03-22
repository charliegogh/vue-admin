<template>
  <a-tree-select
    ref="treeData"
    :value="selectValue"
    :tree-check-strictly="false"
    v-bind="$attrs"
    :show-checked-strategy="SHOW_ALL"
    tree-default-expand-all
    @change="change"
  />
</template>
<script>
import { TreeSelect } from 'ant-design-vue'
// 显示所有节点
const SHOW_ALL = TreeSelect.SHOW_ALL
export default {
  name: 'CTreeSelect',
  props: {
    value: String,
    dataForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      SHOW_ALL,
      selectValue: []
    }
  },
  watch: {
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
  methods: {
    change(el) {
      const { treeData, replaceFields } = this.$refs.treeData
      const { rsTreeParams } = replaceFields || 'rsTreeName'
      this.dataForm[rsTreeParams] = this.filter(treeData, replaceFields, (code) => el.includes(code[replaceFields.value]))
      this.selectValue = el
    },
    filter(tree, config = {}, func) {
      const { children } = config
      function listFilter(list) {
        return list.map(node => ({ ...node })).filter(node => {
          node[children] = node[children] && listFilter(node[children])
          return func(node) || (node[children] && node[children].length)
        })
      }
      return listFilter(tree)
    }
  }
}
</script>
