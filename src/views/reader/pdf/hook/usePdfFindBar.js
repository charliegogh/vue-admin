function scrollIntoView(dataIndex) {
  const matchedElement = document.querySelectorAll(`[data-index="${dataIndex}"]`)
  if (matchedElement[0]) {
    matchedElement[0].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }
}

const FindStates = {
  FIND_FOUND: 0,
  FIND_NOTFOUND: 1,
  FIND_WRAPPED: 2,
  FIND_PENDING: 3,
  FIND_MAX: 50
}

function removeSpaces(input) {
  return input.replace(/\s+/g, '')
}
//  是否包含英文
function containsEnglish(input) {
  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (/[a-zA-Z]/.test(char)) {
      return true
    }
  }

  return false
}

class FindBar {
  constructor(options) {
    this.findField = options.findField || null
    this.findInputSearch = options.findInputSearch || null
    this.caseSensitive = options.caseSensitiveCheckbox || null
    this.findMatchCurPage = options.caseCurPageCheckbox || null
    this.findList = options.findList || null
    this.root = options.root || null

    this.findMax = options.findMax || 50
    FindStates.FIND_MAX = this.findMax

    this.inputValue = options.inputValue || ''

    this.state = null
    this.findStates = null

    this.queryMatches = []

    this.matches = []
    this.pageMatches = []
    this.textDivs = []
    this.textContent = []

    // 提取文字promise
    this.extractTextPromises = []
    this.pendingFindMatches = {}
    // pdf
    this.pdfDocument = options.pdfDocument || null
    this.pdfViewer = options.pdfViewer || null

    this.selected = {
      pageIdx: -1,
      matchIdx: -1
    }

    this.charactersToNormalize = {
      '\u2018': "'",
      '\u2019': "'",
      '\u201A': "'",
      '\u201B': "'",
      '\u201C': '"',
      '\u201D': '"',
      '\u201E': '"',
      '\u201F': '"',
      '\u00BC': '1/4',
      '\u00BD': '1/2',
      '\u00BE': '3/4'
    }

    this.events= [
      'find',
      'findcasesensitivitychange',
      'findmatchcurpage',
      'findtextlayerrendered'
    ]

    const replace = Object.keys(this.charactersToNormalize).join('')
    this.normalizationRegex = new RegExp(`[${replace}]`, 'g')

    // 绑定上下文
    this.handleEvent = this.handleEvent.bind(this)
    const self = this

    // 输入框
    this.findField.addEventListener('input', function(e) {
      if (e.data && e.data.length <= FindStates.FIND_MAX) {
        self.updateUIState(FindStates.FIND_FOUND)
      }
      self.inputValue = e.target.value
    })
    // 搜索
    this.findInputSearch.addEventListener('click', function() {
      dispatchEvent('')
    })

    // 回车
    this.findField.addEventListener('keydown', function(evt) {
      switch (evt.keyCode) {
        case 13:
          dispatchEvent('')
          break
        case 27: // Escape
          break
      }
    })

    // 区分大小写
    this.caseSensitive.addEventListener('click', function() {
      dispatchEvent('casesensitivitychange')
    })

    // 仅在当前页
    this.findMatchCurPage.addEventListener('click', function(e) {
      dispatchEvent('matchcurpage')
    })

    // 列表点击
    this.findList.addEventListener('click', function(event) {
      if (event.target.classList.contains('xr-find__item--target')) {
        const dataIndex = event.target.getAttribute('data-id')
        const idx = dataIndex.split('__')
        const pageIdx = +idx[0] + 1
        self.selected = {
          pageIdx: pageIdx,
          matchIdx: +idx[1]
        }
        // 跳转监听
        const page = self.pdfViewer.getPageView(pageIdx - 1)
        if (page?.textLayer?.textDivs.length) {
          self.removeSelect()
          self.removeMatches(pageIdx - 1).then(() => {
            self.updatePage(pageIdx - 1)
            scrollIntoView(dataIndex)
          })
        } else {
          self.pdfViewer.currentPageNumber = pageIdx
        }
      }
    })

    // 懒加载文档
    this.pdfViewer.eventBus.on('textlayerrendered', function(e) {
      if (self.queryMatches.length !== 0) {
        const pageIndex = e.pageNumber - 1
        self.updatePage(pageIndex)
        if (self.selected.matchIdx !== -1) {
          setTimeout(() => {
            const { pageIdx, matchIdx } = self.selected
            scrollIntoView(`${pageIdx - 1}__${matchIdx}`)
          }, 150)
        }
      }
    })

    for (let i = 0, len = this.events.length; i < len; i++) {
      window.addEventListener(this.events[i], this.handleEvent)
    }

    function dispatchEvent(type) {
      const findFieldValue = self.findField.value
      // 输入框不为空，添加宏任务
      if ((findFieldValue ?? '') !== '') {
        // 超过50个字
        if (findFieldValue.length > FindStates.FIND_MAX) {
          self.updateUIState(FindStates.FIND_MAX)
          return
        }
        // 查找 pendding~~~~~
        self.updateUIState(FindStates.FIND_PENDING)
        setTimeout(() => {
          self.dispatchEvent(type)
        })
      } else {
        // 查找空
        if (type === '') {
          self.updateUIState(FindStates.FIND_WRAPPED)
          return
        }
        setTimeout(() => {
          self.dispatchEvent(type)
        })
      }
    }
  }

  // 自定义事件
  dispatchEvent(type) {
    this.queryMatches = []
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(`find${type}`, true, true, {
      query: this.findField.value,
      caseSensitive: this.caseSensitive.checked,
      matchCurPage: this.findMatchCurPage.checked,
      type
    })
    return window.dispatchEvent(event)
  }

  // 事件监听
  handleEvent(e) {
    this.selected = {
      pageIdx: -1,
      matchIdx: -1
    }
    this.removeMatches().then(() => {
      this.state = e.detail
      this.extractText()
      this.nextMatch()
    })
  }

  // 提取文档文字
  extractText() {
    this.pageContents = []
    this.extractTextPromises = []
    this.pendingFindMatches = {}
    const extractTextPromisesResolves = []
    const { numPages } = this.pdfDocument
    const { matchCurPage } = this.state
    const self = this
    for (let i = 0; i < numPages; i++) {
      this.extractTextPromises.push(
        new Promise(function(resolve) {
          extractTextPromisesResolves.push(resolve)
        })
      )
    }
    // 当前页
    if (matchCurPage) {
      const currentPageIndex = this.pdfViewer.currentPageNumber - 1
      this.extractTextPromises = this.extractTextPromises.splice(
        currentPageIndex,
        1
      )
      this.updateUIState(FindStates.FIND_FOUND)
    }
    function extractPageText(pageIndex) {
      self
        .getPageTextContent(pageIndex)
        .then(function textContentResolved(textContent) {
          const textItems = textContent.items
          const str = []
          for (let i = 0, len = textItems.length; i < len; i++) {
            str.push(textItems[i].str)
          }
          self.pageContents.push(str.join(''))
          extractTextPromisesResolves[pageIndex](pageIndex)

          if (pageIndex + 1 < numPages) {
            extractPageText(pageIndex + 1)
          }
        })
    }

    extractPageText(0)
  }

  // 打点吧
  nextMatch() {
    const self = this
    let { numPages } = this.pdfDocument
    // 当前页
    const { matchCurPage } = this.state
    if (matchCurPage) {
      numPages = 1
    }
    for (let i = 0; i < numPages; i++) {
      if (!(i in this.pendingFindMatches)) {
        this.pendingFindMatches[i] = true
        this.extractTextPromises[i].then(function(pageIdx) {
          delete self.pendingFindMatches[pageIdx]
          self.calcFindMatch(pageIdx)
        })
      }
    }
  }

  // 查找位置
  calcFindMatch(pageIndex) {
    let pageContent = this.normalize(this.pageContents[pageIndex])
    let query = this.normalize(this.state.query)
    const { caseSensitive } = this.state
    const queryLen = query.length
    if (queryLen === 0) {
      this.updateUIState(FindStates.FIND_FOUND)
      return
    }
    if (!caseSensitive) {
      pageContent = pageContent.toLowerCase()
      query = query.toLowerCase()
    }
    const matches = []
    let matchIdx = -queryLen
    while (true) {
      matchIdx = pageContent.indexOf(query, matchIdx + queryLen)
      if (matchIdx === -1) {
        break
      }
      matches.push(matchIdx)
    }
    this.pageMatches[pageIndex] = matches
    this.queryMatches = [
      ...this.queryMatches,
      ...this.extractQueryMatches(
        pageContent,
        query,
        matches,
        pageIndex
      )
    ]
    if (Object.keys(this.pendingFindMatches).length === 0) {
      this.updateUIState(FindStates.FIND_FOUND)
      if (this.queryMatches.length === 0) {
        this.updateUIState(FindStates.FIND_NOTFOUND)
      }
    }
    this.updatePage(pageIndex)
  }

  // 返回结果数组
  extractQueryMatches(text, query, matches, pageIndex) {
    const { caseSensitive } = this.state
    const queryMatches = []
    const queryLen = query.length
    const beforeChars = 5
    const afterChars = 5
    let regex = new RegExp(query, 'gi')
    // 大小写
    if (caseSensitive) {
      regex = new RegExp(query, 'g')
    }
    for (let index = 0; index < matches.length; index++) {
      const idx = matches[index]
      const start = Math.max(0, idx - beforeChars)
      const end = Math.min(text.length, idx + queryLen + afterChars)
      const matchText = text.substring(start, end)
      const highlightedMatchText = matchText.replace(
        regex,
        '<span class="query-highlight">$&</span>'
      )
      queryMatches.push({
        pageIndex: pageIndex + 1,
        id: `${pageIndex}__${index}`,
        matchIdx: index,
        title: highlightedMatchText
      })
    }
    return queryMatches
  }

  // 页面层渲染
  updatePage(pageIndex) {
    this.extractNode(pageIndex)
    this.updateMatches(pageIndex)
  }

  // 提取node
  extractNode(pageIndex) {
    const textDivs = []
    const textContent = []
    const extractPageText = node => {
      if (node.nodeType === 3) {
        // 文本节点
        textDivs.push(node.parentNode)
        textContent.push({ str: node.textContent })
        // div 节点
      } else if (node.nodeType === 1) {
        // 元素节点
        const children = Array.from(node.childNodes)
        for (const child of children) {
          extractPageText(child)
        }
      }
    }
    const el = this.root[pageIndex].querySelector('.textLayer')
    el && extractPageText(el)
    this.textContent = textContent
    this.textDivs = textDivs
  }

  updateMatches(pageIndex) {
    // var matches = this.matches
    // var textDivs = this.textDivs
    // var bidiTexts = this.textContent
    // if (textDivs.length===0){
    //   return
    // }
    // var clearedUntilDivIdx = -1
    // // Clear all current matches.
    // for (var i = 0, len = matches.length; i < len; i++) {
    //   var match = matches[i]
    //   var begin = Math.max(clearedUntilDivIdx, match.begin.divIdx)
    //   for (var n = begin, end = match.end.divIdx; n <= end; n++) {
    //     var div = textDivs[n]
    //       div.textContent = bidiTexts[n].str
    //       div.className = ''
    //   }
    //   clearedUntilDivIdx = match.end.divIdx + 1
    // }
    this.matches = this.convertMatches(this.pageMatches[pageIndex], pageIndex) || []
    this.renderMatches(this.matches, pageIndex)
  }
  // 标签位置
  convertMatches(matches) {
    let i = 0
    let iIndex = 0
    const bidiTexts = this.textContent
    if (!bidiTexts.length) {
      return
    }
    const end = bidiTexts.length - 1
    const queryLen = this.state?.query?.length
    const ret = []
    for (let m = 0, len = matches.length; m < len; m++) {
      let matchIdx = matches[m]

      // Loop over the divIdxs.
      while (i !== end && matchIdx >= iIndex + bidiTexts[i].str.length) {
        iIndex += bidiTexts[i].str.length
        i++
      }

      if (i === bidiTexts.length) {
        console.error('Could not find a matching mapping')
      }

      const match = {
        begin: {
          divIdx: i,
          offset: matchIdx - iIndex
        }
      }
      matchIdx += queryLen
      while (i !== end && matchIdx > iIndex + bidiTexts[i].str.length) {
        iIndex += bidiTexts[i].str.length
        i++
      }

      match.end = {
        divIdx: i,
        offset: matchIdx - iIndex
      }
      ret.push(match)
    }

    return ret
  }
  renderMatches(matches, pageIndex) {
    if (matches.length === 0) {
      return
    }
    const bidiTexts = this.textContent
    const textDivs = this.textDivs
    // console.log(matches,pageIndex,bidiTexts,textDivs)
    let prevEnd = null
    const isSelectedPage = pageIndex + 1 === this.selected.pageIdx
    const selectedMatchIdx = this.selected.matchIdx
    const highlightAll = true
    const infinity = {
      divIdx: -1,
      offset: undefined
    }

    function beginText(begin, className, matchId) {
      const { divIdx } = begin
      textDivs[divIdx].textContent = ''
      appendTextToDiv(divIdx, 0, begin.offset, className, matchId)
    }

    function appendTextToDiv(divIdx, fromOffset, toOffset, className, matchId) {
      const div = textDivs[divIdx]
      const content = bidiTexts[divIdx].str.substring(fromOffset, toOffset)
      const node = document.createTextNode(content)
      if (className) {
        const span = document.createElement('findmark')
        span.setAttribute('data-index', matchId)
        span.className = className
        span.appendChild(node)
        div.appendChild(span)
        return
      }
      div.appendChild(node)
    }
    let i0 = selectedMatchIdx
    let i1 = i0 + 1
    if (highlightAll) {
      i0 = 0
      i1 = matches.length
    } else if (!isSelectedPage) {
      return
    }
    for (let i = i0; i < i1; i++) {
      const match = matches[i]
      const matchId = `${pageIndex}__${i}`
      const { begin } = match
      const { end } = match
      const isSelected = isSelectedPage && i === selectedMatchIdx
      const highlightSuffix = isSelected ? ' find-select' : ''

      // Match inside new div.
      if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
        if (prevEnd !== null) {
          appendTextToDiv(
            prevEnd.divIdx,
            prevEnd.offset,
            infinity.offset,
            '',
            matchId
          )
        }
        beginText(begin, '', matchId)
      } else {
        appendTextToDiv(
          prevEnd.divIdx,
          prevEnd.offset,
          begin.offset,
          '',
          matchId
        )
      }

      if (begin.divIdx === end.divIdx) {
        appendTextToDiv(
          begin.divIdx,
          begin.offset,
          end.offset,
          `find-highlight${highlightSuffix}`,
          matchId
        )
      } else {
        appendTextToDiv(
          begin.divIdx,
          begin.offset,
          infinity.offset,
          `find-highlight begin${highlightSuffix}`,
          matchId
        )
        for (let n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
          textDivs[n0].className = `find-highlight middle${highlightSuffix}`
        }
        beginText(end, `find-highlight end${highlightSuffix}`, matchId)
      }
      prevEnd = end
    }

    if (prevEnd) {
      appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset)
    }
  }

  removeMatches(pageIndex) {
    return new Promise((resolve, reject) => {
      const root = pageIndex !== undefined ? this.root[pageIndex] : document
      const spans = root.querySelectorAll('findmark')
      const promises = []

      spans.forEach(span => {
        const promise = new Promise(innerResolve => {
          span.outerHTML = span.innerHTML
          innerResolve()
        })
        promises.push(promise)
      })

      Promise.all(promises)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  removeSelect() {
    const spans = document.querySelectorAll('.find-select')
    spans.forEach(span => {
      span.outerHTML = span.innerHTML
    })
  }

  // 查询状态更新
  updateUIState(state) {
    let status = ''
    switch (state) {
      case FindStates.FIND_FOUND:
        break

      case FindStates.FIND_PENDING:
        status = 'pending'
        break

      case FindStates.FIND_NOTFOUND:
        status = 'notFound'
        break

      case FindStates.FIND_WRAPPED:
        status = 'notQuery'
        break
      case FindStates.FIND_MAX:
        status = 'MAX'
        break
    }
    this.findStates = status
  }

  // 获取 pdf 内容信息
  getPageTextContent(pageIndex) {
    return this.pdfDocument.getPage(pageIndex + 1).then(function(page) {
      return page.getTextContent()
    })
  }
  // 格式化
  normalize(text) {
    const self = this
    return text.replace(this.normalizationRegex, function(ch) {
      return self.charactersToNormalize[ch]
    })
  }
  async reset(isRemoveListener=true) {
    await this.removeMatches()
    this.selected = {
      pageIdx: -1,
      matchIdx: -1
    }
    this.queryMatches = []
    if (isRemoveListener){
      // 移除监听器
      for (let i = 0, len = this.events.length; i < len; i++) {
        window.removeEventListener(this.events[i],this.handleEvent)
      }
    }
  }
}
function usePdfFindBar(options) {
  return new FindBar(options)
}

export default usePdfFindBar
