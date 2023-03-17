const tree = {
  // 扁平化转换
  flatToTree(data, topid = null, parid = 'pid') {
    const _data = JSON.parse(JSON.stringify(data)) // 源数据处理
    // 这种方式不能计算深度，参考：https://zhuanlan.zhihu.com/p/99911823，https://github.com/zTree/zTree_v3/blob/master/js/jquery.ztree.core.js#L706
    const result = []

    const map = {}
    _data.forEach((item, i) => map[item.id] = i)
    _data.forEach(item => {
      if (item[parid] === topid) {
        result.push(item)
      } else {
        const parent = _data[map[item[parid]]]
        parent && (parent.children ? parent.children.push(item) : parent.children = [item])
      }
    })
    return result
  },
  // 树查找
  findTree(tree, id) {
    let isGet = false
    let retNode = null

    function deepSearch(tree, id) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deepSearch(tree[i].children, id)
        }
        if (id === tree[i].id || isGet) {
          isGet || (retNode = tree[i])
          isGet = true
          break
        }
      }
    }

    deepSearch(tree, id)
    return retNode
  },
  // 整合id集合
  getTreeIds(tree) {
    const ids = []
    function deep(tree, id) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children && tree[i].children.length > 0) {
          deep(tree[i].children)
        } else {
          ids.push(tree.id)
        }
      }
    }

    deep(tree)
    return ids
  }
}
module.exports = tree
