export default {
  methods: {
    dispatch(eventName, params) {
      const parent = this.$parent.$parent
      if (parent) {
        // 这里不太懂
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    }
  }
}
