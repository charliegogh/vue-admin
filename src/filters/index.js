/**
 * @Description: 全局过滤器
 * @author  charlie
 */
import moment from 'moment'
/**
 * @param value
 * @param dict 字典集合
 * @param compareValue
 * @param getValue
 * @returns {*|string}
 */
export function formatDict(value, dict = [], compareValue = 'code', getValue = 'name') {
  const data = dict.find(item => item[compareValue] === value)
  return data ? data[getValue] : ''
}
/* 时间格式化 */
export function formatDate(date) {
  return date && moment(date).format('YYYY-MM-DD')
}
