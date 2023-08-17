<template>
  <div class="x-empty">
    <img :src="image">
    <span v-if="description">
      {{ description }}
    </span>
    <template v-if="$slots.default">
      <slot />
    </template>
  </div>
</template>
<script>
export default {
  props: {
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: './findBar-null.png'
    }
  }
}
</script>
<style lang="less" scoped>
.x-empty{
  font-size: 14px;
  img{
    width: 240px;
    height: 150px;
  }
  span{
    margin-top: 16px;
    color: #6f7582;
  }
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
