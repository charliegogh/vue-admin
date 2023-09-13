<template>
  <div>
    123
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
    }
  },
  async mounted() {
    // 下载文件
    const params = {
      'jsonContent': '{"root":{"data":{"id":"a0496ab9-b704-4ec9-b0e3-f8e7d87fbd13","type":"title","text":"跨界一体、协同治理：长三角示范区跨区域规划标准化探索","level":null,"layout":null,"colorIndex":null,"background":null,"font-family":"微软雅黑,Microsoft YaHei","font-size":16,"font-weight":null,"font-style":null,"hyperlink":null,"hyperlinkTitle":null,"note":null,"notedev":null,"notemore":null,"detail":null,"expandState":null,"image":null,"imageSize":{"width":338,"height":238},"color":null,"appId":null,"parentId":null,"quote":null,"contents":null,"isFreeNode":1,"nodeType":0},"children":[]},"template":"right","theme":"snow","version":"1.4.43__0"}',
      'type': 'xmind'
    }
    const rs = await fetch(`http://localhost:88/xfatApi/mind/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    const json = await rs.json()
    const blob = await rs.blob()
    console.log(json)
    // 创建下载链接
    const link = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob) // 创建URL
    link.href = objectUrl
    // 执行下载名称
    link.download = '1.xmind'
    link.click() // 下载文件
  }
}
</script>
<style lang="less">

</style>
