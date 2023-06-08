function replaceSpecialCharacters(str) {
  var specialCharRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return str.replace(specialCharRegex, '\u25C6')
}
// 示例使用
var str = '􀆺111111111sss哈哈哈==----####  １９９１ 年ꎮ'
var rs = replaceSpecialCharacters(str)
console.log(rs) // 输出 true

