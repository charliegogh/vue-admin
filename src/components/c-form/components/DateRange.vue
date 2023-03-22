<!--
  1. 普通日期 YYYY-MM-DD（默认）
  2. YYYY-MM YYYY 按文档配置
-->
<template>
  <a-range-picker
    :key="timer"
    v-model="fieldValue"
    v-bind="$attrs"
    :format="format"
    :mode="cas_mode"
    @change="handleChange"
    @panelChange="handlePanelChange"
  />
</template>
<script>
import moment from 'moment'
export default {
  name: 'DateRange',
  props: {
    value: {
      type: Array
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    mode: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      fieldValue: [],
      timer: 0,
      cas_mode: this.mode
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if ((val ?? '') !== '' && Array.isArray(val)) {
          this.fieldValue = val.map(i => (moment(i)))
        } else {
          this.fieldValue = []
        }
      }
    }
  },
  methods: {
    handlePanelChange(val, mode) {
      this.cas_mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
      this.handleChange(val)
    },
    handleChange(val) {
      const value = val.map(i => (moment(i).format(this.format)))
      this.fieldValue = val
      this.$emit('input', value)
      if (val.length === 0) this.timer++
    }
  }
}
</script>
