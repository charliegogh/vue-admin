<template>
  <button
    class="x-button"
  >
    <template v-if="$slots.default"><slot /></template>
  </button>
</template>
<script>
export default {
  name: 'XButton'
}
</script>

<style lang="less" scoped>
.x-button{
  cursor: pointer;
}
</style>
