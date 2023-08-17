<template>
  <div
    :class="['x-input',
             {
               'is-disabled': inputDisabled,
             }
    ]"
  >
    <input
      :tabindex="tabindex"
      class="x-input__inner"
      v-bind="$attrs"
      :disabled="disabled"
      v-on="$listeners"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <!-- 后置内容 -->
    <span
      class="x-input__suffix"
    >
      <span class="x-input__suffix-inner">
        <i
          v-if="showClear"
          class="iconfont icon-NO x-input__clear"
          @mousedown.prevent
          @click="clear"
        />
        <slot name="suffix" />
      </span>
    </span>
    <!-- 后置元素 -->
    <div v-if="$slots.append" class="x-input-group__append">
      <slot name="append" />
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    value: [String, Number],
    tabindex: String,
    suffixIcon: String,
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
      return this.value === null || this.value === undefined ? '' : String(this.value)
    },
    showClear() {
      return this.clearable &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
    },
    inputDisabled() {
      return this.disabled
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        console.log(val)
      }
    }
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
    }
  }
}
</script>
<style lang="less">
.x-input{
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  .x-input__inner{
    background-image: none;
    box-sizing: border-box;
    color: #1E232E;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    width: 100%;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    z-index: 1;
  }
  .x-input__inner::placeholder{
    color: #c1c3c9;
  }
  .x-input__suffix{
    position: absolute;
    height: 100%;
    right: 9.8px;
    top: 0;
    text-align: center;
    color: #c0c4cc;
    transition: all .3s;
    z-index: 2;
    &-inner{
      display: flex;
      align-items: center;
      .x-input__clear{
        margin-right: 5px;
      }
    }
    i{
      height: 100%;
      line-height: 40px;
      cursor: pointer;
    }
  }
}
.x-input__inner:focus{
  outline: none;
  border-color: #1A5EFF;
}
.has-error{
  .x-input__inner{
    background-color: #fff;
    border-color: #f5222d;
  }
  .x-input__suffix-inner{
    i{
      color: #f5222d;
    }
  }
}
.x-form-explain{
  color: #f5222d;
  min-height: 22px;
  font-size: 12px;
  line-height: 1.5;
  transition: color .3s cubic-bezier(.215,.61,.355,1);
}
.x-input.is-disabled{
  .x-input__inner{
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  i{
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
