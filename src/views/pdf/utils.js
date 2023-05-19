export const getDocument = elm => (elm || {}).ownerDocument || document
export const getWindow = elm => (getDocument(elm) || {}).defaultView || window
export const isHTMLElement = elm =>
  elm instanceof HTMLElement || elm instanceof getWindow(elm).HTMLElement
export const isHTMLCanvasElement = elm =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm).HTMLCanvasElement

export const asElement = x => x

export const getPageFromElement = target => {
  const node = asElement(target.closest('.page'))

  if (!node || !isHTMLElement(node)) {
    return null
  }

  const number = Number(asElement(node).dataset.pageNumber)

  return { node, number }
}

export const getPagesFromRange = range => {
  const startParentElement = range.startContainer.parentElement
  const endParentElement = range.endContainer.parentElement
  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return []
  }
  const startPage = getPageFromElement(asElement(startParentElement))
  if (!startPage?.number) {
    return []
  }
  if (startPage.number) {
    return [startPage]
  }
  return []
}
const isClientRectInsidePageRect = (clientRect, pageRect) => {
  if (clientRect.top < pageRect.top) {
    return false
  }
  if (clientRect.bottom > pageRect.bottom) {
    return false
  }
  if (clientRect.right > pageRect.right) {
    return false
  }
  if (clientRect.left < pageRect.left) {
    return false
  }

  return true
}
export const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

export const getClientRects = (range, pages) => {
  // 获取给定文本选区范围内所有客户端矩形坐标
  const clientRects = Array.from(range.getClientRects())
  let rects = []
  for (const clientRect of clientRects) {
    for (const page of pages) {
      // getBoundingClientRect 获取一个元素的大小及其相对于视口的位置
      const pageRect = page.node.getBoundingClientRect()
      // 检查它是否位于某个页面的范围内
      if (
        isClientRectInsidePageRect(clientRect, pageRect) &&
        clientRect.top >= 0 &&
        clientRect.bottom >= 0 &&
        clientRect.width > 0 &&
        clientRect.height > 0 &&
        clientRect.width < pageRect.width &&
        clientRect.height < pageRect.height
      ) {
        // console.log(clientRect.top, page.node.scrollTop, pageRect.top)
        const highlightedRect = {
          top: clientRect.top + page.node.scrollTop - pageRect.top,
          left: clientRect.left + page.node.scrollLeft - pageRect.left,
          width: clientRect.width,
          height: clientRect.height,
          pageNumber: page.number
        }
        rects.push(highlightedRect)
      }
    }
  }
  // 按行数分组
  rects = sortByKey(rects, 'top')
  // todo 将 rects 数组按照矩形顶部的 Y 坐标进行升序排序，然后计算所有矩形高度的平均值，并将数组中所有矩形的高度设置为平均值。接着，它遍历所有矩形，如果有两个矩形之间的距离小于平均值，则将它们的顶部位置设置为相同，以此来将矩形分成更合适的行。
  const average =
    rects.reduce((acc, curr) => acc + Number(curr.height), 0) / rects.length
  for (let i = 0; i < rects.length; i++) {
    if (i < rects.length - 1 && rects[i + 1].top - rects[i].top < average) {
      rects[i + 1].top = rects[i].top
    }
    rects[i].height = average
  }
  return rects
}
