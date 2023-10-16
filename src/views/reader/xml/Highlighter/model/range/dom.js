const getOriginParent = ($node) => {
  let $originParent = $node.parentNode
  // 向上查找
  while ($originParent?.dataset['highlight-id']) {
    $originParent = $originParent.parentNode
  }
  return $originParent
}

export const getDomMeta = ($node) => {
  const $originParent = getOriginParent($node)

  return {
    parentTagName: '',
    parentIndex: '',
    textOffset: ''
  }
}
