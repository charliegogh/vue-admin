<template>
  <a-card :bordered="false">
    <alert
      description="平台自动抽取部分文献的研究方法、研究结论、研究目的、研究结果4项要素内容，并填充到相应要素中，仅供参考。"
      :visible="visible"
      :closable="false"
    />
  </a-card>
</template>
<script>
import alert from '@/components/alert'
import { Local } from '_utils/storage'
export default {
  components: {
    alert
  },
  data() {
    return {
      visible: true
    }
  },
  mounted() {
    console.log(!Local.readData('X-ALERT--WXJZ'))
  },
  methods: {
    close(e) {
      Local.saveData('X-ALERT--WXJZ', 1)
    }
  }
}
</script>
