<template>
  <a-checkbox-group
    v-model="selectValue"
  >
    <a-checkbox
      v-for="item of formField.dataSource"
      :key="item[options.value || 'code']"
      :value="item[options.value || 'code']"
    >
      {{ item[options.label || 'name'] }}
    </a-checkbox>
  </a-checkbox-group>
</template>
<script>
export default {
  name: 'CheckboxGroup',
  props: {
    value: {

    },
    formField: {
      type: Object
    }
  },
  data() {
    return {
      selectValue: null,
      options: {
        code: 'code',
        value: 'name'
      }
    }
  },
  watch: {
    formField: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) this.options = Object.assign(this.options, val.options)
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
  }
}
</script>
