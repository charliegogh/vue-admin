<!--
  兼容三种格式：
  1. 普通日期 YYYY-MM-DD（默认）
  2. 年 YYYY (atnd 选择年，无法自动关闭面板，目前采用key更新)
     mode:'year',
     format: 'YYYY',
  3. 具体到时分秒
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: true
-->
<template>
  <a-date-picker
    :key="timer"
    v-model="fieldValue"
    v-bind="$attrs"
    :format="format"
    :show-time="showTime && {defaultValue: moment('00:00:00', 'HH:mm:ss') }"
    @change="handleChange"
    @panelChange="handleChange($event,'panel')"
  />
</template>
<script>
import moment from 'moment'
export default {
  name: 'DatePicker',
  props: {
    value: {
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    showTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moment,
      timer: 0,
      fieldValue: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.fieldValue = (val ?? '') !== '' ? moment(val) : null
      }
    }
  },
  methods: {
    handleChange(val, type) {
      if (val) {
        const value = moment(val).format(this.format)
        this.$emit('input', value)
      }
      if ((type === 'panel' || !val) && !this.showTime) this.timer++
    }
  }
}
</script>
