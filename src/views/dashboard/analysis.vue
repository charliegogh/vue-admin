<template>
  <a-auto-complete
    v-model="value"
    :data-source="dataSource"
    style="width: 200px"
    placeholder="input here"
    @select="onSelect"
    @search="onSearch"
    @change="onChange"
  />
</template>
<script>
import { getAction } from '@/api'
export default {
  data() {
    return {
      value: '',
      dataSource: []
    }
  },
  watch: {
    value(val) {
      console.log('value', val)
    }
  },
  methods: {
    onSearch(searchText) {
      getAction(`https://mxapi.cnki.net//activity/common/chinaUniverInfo?searchKey=${searchText}`)
        .then(d => {
          this.dataSource = d.content
        })
    },
    onSelect(value) {
      console.log('onSelect', value)
    },
    onChange(value) {
      console.log('onChange', value)
    }
  }
}
</script>
