function scrollIntoView(dataIndex) {
  const matchedElement = document.querySelectorAll(
    `[data-index="${dataIndex}"]`
  )
  if (matchedElement[0]) {
    matchedElement[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
    matchedElement[0].classList.add('find-select')
  }
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
const createUUID = function() {
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(
    /[xy]/g,
    function(c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}

const getPlainText = richCont => {
  let value = richCont
  if (richCont) {
    // 方法一：
    // value = value.replace(/\s*/g, '') // 去掉空格
    value = value.replace(/<[^>]+>/g, '') // 去掉所有的html标记
    // value = value.replace(/↵/g, '') // 去掉所有的↵符号
    // value = value.replace(/[\r\n]/g, '') // 去掉回车换行
    return value
  }
  return null
}
const FindStates = {
  FIND_FOUND: 0,
  FIND_NOTFOUND: 1,
  FIND_WRAPPED: 2,
  FIND_PENDING: 3,
  FIND_MAX: 50
}

class FindBar {
  constructor(options) {
    this.findField = options.findField || null
    this.findInputSearch = options.findInputSearch || null
    this.caseSensitive = options.caseSensitiveCheckbox || null
    this.findList = options.findList || null
    this.originalTextContent = options.originalTextContent || null
    this.root = options.root || null

    this.findMax = options.findMax || 50
    FindStates.FIND_MAX = this.findMax

    this.inputValue = options.inputValue || ''
    this.state = null
    this.findStates = null
    this.pageContents = ''
    this.textContent = null

    this.matches = []
    this.pageMatches = []

    this.queryMatches = []

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

    // 列表点击
    this.findList.addEventListener('click', function(event) {
      if (event.target.classList.contains('xr-find__item--target')) {
        const dataIndex = event.target.getAttribute('data-id')
        const selectedElements = document.querySelectorAll('.find-select')
        selectedElements.forEach(element => {
          element.classList.remove('find-select')
        })
        scrollIntoView(dataIndex)
      }
    })

    const events = [
      'find',
      'findagain',
      'findhighlightallchange',
      'findcasesensitivitychange'
    ]
    for (let i = 0, len = events.length; i < len; i++) {
      window.addEventListener(events[i], this.handleEvent)
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
        // 查找 pending~~~~~
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
      caseSensitive: this.caseSensitive.checked
    })
    return window.dispatchEvent(event)
  }

  // 事件监听
  handleEvent(e) {
    this.removeMatches().then(() => {
      this.state = e.detail
      this.extractText()
      this.calcFindMatch()
    })
  }

  // 提取文档文字
  extractText() {
    this.pageContents = getPlainText(this.originalTextContent)
  }

  // 原文查找
  calcFindMatch() {
    let pageContent = this.normalize(this.pageContents)
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

    this.pageMatches = matches
    this.queryMatches = this.extractQueryMatches(pageContent, query, matches)
    if (this.queryMatches.length === 0) {
      this.updateUIState(FindStates.FIND_NOTFOUND)
      return
    }
    this.updatePage()
  }

  // 返回结果数组
  extractQueryMatches(text, query, matches) {
    const { caseSensitive } = this.state
    const queryMatches = []
    const queryLen = query.length
    const beforeChars = 5
    const afterChars = 5
    let regex = new RegExp(query, 'gi')
    if (caseSensitive) {
      regex = new RegExp(query, 'g')
    }
    if (!containsEnglish(query)) {
      text = removeSpaces(text)
      let matchIdx = -queryLen
      const _matches = []
      while (true) {
        matchIdx = text.indexOf(query, matchIdx + queryLen)
        if (matchIdx === -1) {
          break
        }
        _matches.push(matchIdx)
      }
      matches = _matches
    }
    for (const idx of matches) {
      const start = Math.max(0, idx - beforeChars)
      const end = Math.min(text.length, idx + queryLen + afterChars)
      const matchText = text.substring(start, end)
      const highlightedMatchText = matchText.replace(
        regex,
        '<span class="query-highlight">$&</span>'
      )
      queryMatches.push({
        id: createUUID(),
        title: highlightedMatchText
      })
    }
    return queryMatches
  }

  // 页面层渲染
  updatePage() {
    this.extractNode()
    this.updateMatches()
    this.updateUIState(FindStates.FIND_FOUND)
  }
  extractNode() {
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
    extractPageText(this.root)
    this.textContent = textContent
    this.textDivs = textDivs

    console.log(this.textDivs)
    console.log(this.textContent)
  }

  updateMatches() {
    this.matches = this.convertMatches(this.pageMatches)
    this.renderMatches(this.matches)
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

  // render 高亮
  renderMatches(matches) {
    if (matches?.length === 0) {
      return
    }
    const bidiTexts = this.textContent
    const textDivs = this.textDivs
    let prevEnd = null
    const isSelectedPage = false
    const selectedMatchIdx = -1
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
      const matchId = `$__${i}`
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

  // 格式化
  normalize(text) {
    const self = this
    return text.replace(this.normalizationRegex, function(ch) {
      return self.charactersToNormalize[ch]
    })
  }

  reset() {
    this.removeMatches()
    this.queryMatches = []
  }
}

function useXmlFindBar(options) {
  return new FindBar(options)
}

export default useXmlFindBar
