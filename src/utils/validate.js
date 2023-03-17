/* eslint-disable */
// 是否为外部链接
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function validName(path) {
  return /^[a-zA-Z0-9_()-（）《》\u4e00-\u9fa5]+$/.test(path.split('.')[0]);
}



// export function validUsername(str) {
//   const valid_map = ["admin", "editor"];
//   return valid_map.indexOf(str.trim()) >= 0;
// }

/* 合法uri */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/* 小写字母 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
/* 验证用户名 */
export function validUsername (value) {
  // 用户名正则，3到16位（字母，数字，下划线，减号）
  const reg = /^([\u4e00-\u9fa5]{3,16})|([A-Za-z0-9_]{3,16})|([a-zA-Z0-9_\u4e00-\u9fa5]{3,16})$/
  if (value === '') {
    return false
  } else {
    return reg.test(value.trim())
  }
}

/* 校验汉字 */
export function validChina (str) {
  const re=/^[\u4e00-\u9fa5]/
  return re.test(str)
}
/* 校验手机号 */
export function validTel (value) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(value)
}


export function validPassword(value){
  const reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{8,16}$/
  return reg.test(value)
}



export function validTelAndFixedLine (value) {
  const reg = /^((0\d{2,3}-\d{7,8})|([1]([3-9])[0-9]{9}))$/;
  return reg.test(value)
}
export function isSpecialSymbol (value) {
// const reg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
  const reg = /[[]/im
  return reg.test(value)
}

