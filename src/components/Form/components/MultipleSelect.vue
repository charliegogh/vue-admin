
<template>
  <a-select
    v-model="selectValue"
    :placeholder="`请选择${formField.label}`"
    mode="multiple"
  >
    <a-select-option
      v-for="(item, index) in formField.dataSource"
      :key="index"
      :value="item[formField.options && formField.options.value || 'code']"
    >
      {{ item[formField.options && formField.options.label || 'name'] }}
    </a-select-option>
  </a-select>
</template>
<script>
export default {
  name: 'MultipleSelect',
  props: {
    value: {
    },
    formField: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      selectValue: []
      // options: {
      //   value: 'code',
      //   name: 'name'
      // }
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
  }
}
</script>
