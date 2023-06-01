<template>
  <div
    v-if="show"
    class="x-alert"
    :class="[typeClass]"
  >
    <span v-if="$slots.default && !description" class="x-alert-message">
      <slot />
    </span>
    <span v-if="description && !$slots.default" class="x-alert-message">
      {{ description }}
    </span>
    <button
      v-show="closable"
      type="button"
      class="x-alert-close-icon"
      @click="close"
    >
      <svg
        class="xicon xicon-close"
        t="1685501284358"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="10768"
        width="16"
        height="16"
      ><path d="M570.88 512l271.786667-271.786667a38.4 38.4 0 0 0 0-54.186666 38.826667 38.826667 0 0 0-54.613334 0l-271.36 271.36-271.36-270.506667a38.826667 38.826667 0 0 0-54.613333 0 38.4 38.4 0 0 0 0 54.186667L462.506667 512l-271.786667 272.213333a38.4 38.4 0 1 0 54.613333 54.186667l271.36-271.36 271.36 271.36a38.4 38.4 0 1 0 54.613334-54.186667z" p-id="10769" fill="#6F7582" /></svg>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    },
    visible: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: this.visible
    }
  },
  computed: {
    typeClass() {
      return `x-alert--${this.type}`
    }
  },
  methods: {
    close(e) {
      this.show = false
      this.$emit('close', e)
    }
  }
}
</script>
<style lang="less" scoped>
.x-alert{
  margin: 0;
  padding: 8px 0 8px 8px;
  position: relative;
  background: #fff1e5;
  .x-alert-message{
    color: #914100;
    box-sizing: border-box;
    font-size: 14px;
    font-size: 14px;
    font-family: Microsoft YaHei UI, Microsoft YaHei UI-Regular;
    font-weight: 400;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .x-alert-close-icon{
    position: absolute;
    top: 8px;
    right: 16px;
    padding: 0;
    overflow: hidden;
    font-size: 12px;
    line-height: 22px;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    .x-alert-close{
      margin-right: 18px;
      font-size: 12px;
      color: #6f7582;
    }
  }
}

</style>
