<template>
  <div class="textarea-wrapper">
    <a-textarea
      v-model="$attrs.value"
      class="m-textarea"
      v-bind="$attrs"
      @change="onChange"
    />
    <span
      v-if="showCount"
      class="m-count"
    >{{ textLength }}/<template
      v-if="$attrs['max-length']"
    >{{ $attrs['max-length'] }}</template></span>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    showCount: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 长度控制
    textLength() {
      return (this.$attrs.value || '').length
    }
  },
  mounted() {
    console.log(this.$attrs.maxLength)
  },
  methods: {
    onChange(e) {
      // v-model 回调函数
      this.$emit('change', e.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.textarea-wrapper {
  position: relative;
  display: block;

  .m-textarea {
    padding: 8px 12px;
    height: 100%;
  }

  .m-count {
    color: #808080;
    background: #fff;
    position: absolute;
    font-size: 12px;
    bottom: 8px;
    right: 12px;
  }
}
</style>

