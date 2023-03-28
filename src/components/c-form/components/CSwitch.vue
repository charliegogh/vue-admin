<template>
  <a-switch
    v-model="selectValue"
    v-bind="$attrs"
  />
</template>
<script>
export default {
  name: 'CSwitch',
  props: {
    value: {}
  },
  data() {
    return {
      selectValue: false,
      options: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.selectValue = val === '0'
      }
    },
    selectValue: {
      handler(val) {
        this.$emit('input', val ? '0' : '1')
      }
    }
  }
}
</script>
