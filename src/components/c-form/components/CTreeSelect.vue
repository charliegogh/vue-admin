<template>
  <a-tree-select
    ref="treeData"
    v-model="selectValue"
    :tree-check-strictly="false"
    v-bind="$attrs"
    :show-checked-strategy="SHOW_ALL"
    tree-default-expand-all
  />
</template>
<script>
import { TreeSelect } from "ant-design-vue";
// 显示所有节点
const SHOW_ALL = TreeSelect.SHOW_ALL;
export default {
  name: "CTreeSelect",
  props: {
    value: String
  },
  data() {
    return {
      SHOW_ALL,
      selectValue: this.value || undefined
    };
  },
  watch: {
    selectValue: {
      immediate: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
