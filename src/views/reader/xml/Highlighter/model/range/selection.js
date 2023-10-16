export const getDomRange = () => {
  const selection = window.getSelection()
  if (selection.isCollapsed) {
    console.debug('no text')
    return null
  }
  return selection.getRangeAt(0)
}

export const removeSelection = () => {
  window.getSelection().removeAllRanges()
}

