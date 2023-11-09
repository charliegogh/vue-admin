<template>
  <div
    :class="[
      'x-textarea'
    ]"
  >
    <textarea
      class="x-textarea__inner"
      :disabled="disabled"
      v-bind="$attrs"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
    />
    <span class="x-textarea__suffix">
      <span class="x-textarea__suffix-inner">
        <i
          v-if="showClear"
          class="iconfont icon-NO x-textarea__clear"
          @mousedown.prevent
          @click="clear"
        />
        <slot name="suffix" />
      </span>
    </span>
    <span
      class="x-input__count"
    >
      {{ textLength }}/{{ upperLimit }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'XTextarea',
  inheritAttrs: false,
  props: {
    value: [String, Number],
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovering: false,
      focused: false
    }
  },
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined
        ? ''
        : String(this.value)
    },
    showClear() {
      return this.clearable && this.nativeInputValue
    },
    inputDisabled() {
      return this.disabled
    },
    upperLimit() {
      return this.$attrs.maxlength
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length
      }
      return (this.value || '').length
    }
  },
  mounted() {
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    handleFocus(event) {
      this.focused = true
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.focused = false
      this.$emit('blur', event)
    },
    handleInput(event) {
      event.target.value = event.target.value.replace(/\n/g, '')
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="less">
.x-textarea{
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  &__inner{
    width: 100%;
    background-image: none;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    overflow-y: hidden;
    outline: none;
    background-color: var(--Grayblue_13);
    border: 1px solid var(--Grayblue_09);
    border-radius: 4px;
    padding: 0 40px 0 15px;
    //transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    z-index: 1;
    resize: none;
  }
  &__inner::placeholder {
    color: var(--Grayblue_08);
    font-size: 14px;
  }
  .x-textarea__suffix {
    position: absolute;
    height: 100%;
    right: 8px;
    text-align: center;
    color: #c0c4cc;
    transition: all 0.3s;
    z-index: 2;
    display: flex;
    align-items: center;
    &-inner {
      display: flex;
      align-items: center;
      .x-input__clear {
        margin-right: 5px;
      }
    }
    i {
      line-height: 40px;
      cursor: pointer;
      width: 20px;
      display: flex;
      height: 20px;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
  }
  .x-input__count{
    color: #999da6;
    position: absolute;
    font-size: 12px;
    right: 36px;
    display: flex;
    align-items: center;
    z-index: 2;
  }
}
</style>
