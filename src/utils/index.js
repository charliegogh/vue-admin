/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 深拷贝
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 生成随机id
 */
export const createUUID = function() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

/**
 * 数组去重
 */
export const unique = function(arr) {
  return Array.from(new Set(arr))
}

/**
 * @param name
 * @param search
 * @returns {string|null}
 * 链接参数
 */
export function getQueryString(name, search) {
  search = search || window.location.search.substr(1) || window.location.hash.split('?')[1]
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  if (search) {
    const r = search.match(reg)
    if (r != null) return unescape(r[2])
    return null
  } else {
    return null
  }
}

// 数组对象去重
export function deWeightThree(arr, tag) {
  const map = new Map()
  for (const item of arr) {
    if (!map.has(item[tag])) {
      map.set(item[tag], item)
    }
  }
  return [...map.values()]
}

// 数据归类
export function dataGroup(objectArray, property) {
  return Object.values(objectArray.reduce(function(acc, obj) {
    const key = obj[property]
    if (!acc[key]) {
      acc[key] = {
        ids: []
      }
    }
    acc[key].ids.push(obj.id)
    acc[key] = { ...(acc[key] || {}), ...obj }
    return acc
  }, {}))
}

// 数组求和
export function sum(arr) {
  return arr.reduce(function(prev, curr, idx, arr) {
    return Number(prev) + Number(curr)
  })
}

// 获取两个数区间之前的数组结合
export function sectionArray(a, b) {
  const arr = []
  for (let d = a; d <= b; d++) {
    arr.push(d)
  }
  return arr
}

/**
 * 将数组对象转换成key value形式，方便值匹配
 */
export function arrayToObject(data, key) {
  return data.reduce((res, v) => {
    res[v[key]] = { ...(res[v[key]] || {}), ...v }
    return res
  }, {})
}
