<template>
  <div
    :class="[
      'x-input',
      {
        'is-disabled': inputDisabled,
      },
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
    <span class="x-input__suffix">
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
  name: 'XInput',
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
      return this.value === null || this.value === undefined
        ? ''
        : String(this.value)
    },
    showClear() {
      return this.clearable && this.nativeInputValue
    },
    inputDisabled() {
      return this.disabled
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
.x-input {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  .x-input__inner {
    background-image: none;
    box-sizing: border-box;
    color: var(--Grayblue_01);
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    width: 100%;
    border: none;
    background-color: var(--Grayblue_13);
    border-radius: 4px;
    padding: 0 40px 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    z-index: 1;
  }
  .x-input__inner::placeholder {
    color: var(--Grayblue_08);
    font-size: 14px;
  }
  .x-input__suffix {
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
      height: 100%;
      line-height: 40px;
      cursor: pointer;
    }
  }
}
.x-input__inner:focus {
  outline: none;
  border-color: var(--Primayblue_03);
}
.x-input__inner:hover {
  border-color: var(--Grayblue_08);
}
.has-error {
  .x-input__inner {
    background-color: var(--Grayblue_13);
    border-color: var(--Red_03);
  }
  .x-input__suffix-inner {
    i {
      color: var(--Red_03);
    }
  }
}
.x-form-explain {
  color: var(--Red_03);
  min-height: 22px;
  font-size: 12px;
  line-height: 1.5;
  transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.x-input.is-disabled {
  .x-input__inner {
    background-color: var(--Grayblue_11);
    border-color: var(--Grayblue_09);
    color: var(--Grayblue_08);
    cursor: not-allowed;
  }
  i {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
