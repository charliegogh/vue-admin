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
    matchedElement[0].classList.add('find-xml-select')
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
    value = value.replace(/\s*/g, '') // 去掉空格
    value = value.replace(/<[^>]+>/g, '') // 去掉所有的html标记
    value = value.replace(/↵/g, '') // 去掉所有的↵符号
    value = value.replace(/[\r\n]/g, '') // 去掉回车换行
    value = value.replace(/&nbsp;/g, '') // 去掉空格
    // value = convertIdeogramToNormalCharacter(value)
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

    this.textContent = null
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

    // 列表点击
    this.findList.addEventListener('click', function(event) {
      if (event.target.classList.contains('xr-find__item--target')) {
        const dataIndex = event.target.getAttribute('data-id')
        const selectedElements = document.querySelectorAll('.find-xml-select')
        selectedElements.forEach(element => {
          element.classList.remove('find-xml-select')
        })
        scrollIntoView(dataIndex)
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
    this.removeMatches()
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
    this.state = e.detail
    this.extractText()
    setTimeout(() => {
      this.calcFindMatch()
    }, 50)
  }

  // 提取文档文字
  extractText() {
    this.textContent = getPlainText(this.originalTextContent)
  }

  // 原文查找
  calcFindMatch() {
    let pageContent = this.normalize(this.textContent)
    let query = this.normalize(this.state.query)
    const { caseSensitive } = this.state
    const queryLen = query.length
    if (queryLen === 0) {
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
    this.queryMatches = this.extractQueryMatches(pageContent, query, matches)
    if (this.queryMatches.length === 0) {
      this.updateUIState(FindStates.FIND_NOTFOUND)
      return;
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
    this.renderMatches()
    this.updateUIState(FindStates.FIND_FOUND)
  }

  // render 高亮
  renderMatches() {
    const { caseSensitive } = this.state
    const query = this.normalize(this.state.query)
    let regex = new RegExp(query, 'gi')
    if (caseSensitive) {
      regex = new RegExp(query, 'g')
    }
    // 匹配rs
    let matchIdx = 0
    // 递归遍历并高亮匹配项
    const highlightMatches = node => {
      if (node.nodeType === 3) {
        // 文本节点
        const originalText = node.textContent
        const matches = originalText.match(regex)
        if (matches) {
          const parent = node.parentNode
          const fragment = document.createDocumentFragment()
          let lastIndex = 0
          for (const match of matches) {
            const index = originalText.indexOf(match, lastIndex)
            if (index > -1) {
              matchIdx++
              const before = document.createTextNode(
                originalText.slice(lastIndex, index)
              )
              fragment.appendChild(before)
              const highlightedSpan = document.createElement('findmark')
              highlightedSpan.classList.add('find-xml-highlight')
              highlightedSpan.appendChild(document.createTextNode(match))
              fragment.appendChild(highlightedSpan)
              lastIndex = index + match.length
              if (this.queryMatches.length) {
                highlightedSpan.setAttribute(
                  'data-index',
                  this.queryMatches[matchIdx - 1]?.id || ''
                )
              }
            }
          }
          const after = document.createTextNode(originalText.slice(lastIndex))
          fragment.appendChild(after)
          parent.replaceChild(fragment, node)
        }
      } else if (node.nodeType === 1) {
        // 元素节点
        const children = Array.from(node.childNodes)
        for (const child of children) {
          highlightMatches(child)
        }
      }
    }

    highlightMatches(this.root, regex)
  }

  removeMatches() {
    const spans = document.querySelectorAll('findmark')
    console.log(spans)
    spans.forEach(span => {
      span.outerHTML = span.innerHTML
    })
  }

  // 查询状态更新
  updateUIState(state) {
    const notFound = false
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
    this.selected = {
      pageIdx: -1,
      matchIdx: -1
    }
    // 移除监听器
    for (let i = 0, len = this.events.length; i < len; i++) {
      window.removeEventListener(this.events[i],this.handleEvent)
    }
    this.queryMatches = []
  }
}

function useXmlFindBar(options) {
  return new FindBar(options)
}

export default useXmlFindBar
