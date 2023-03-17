class Local {
  static saveData(KEY, data) {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  }

  static readData(KEY) {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]')
  }

  static removeData(KEY) {
    if (window.localStorage) {
      localStorage.removeItem(KEY)
    }
  }
}
class Section {
  static saveData(KEY, data) {
    window.sessionStorage.setItem(KEY, JSON.stringify(data))
  }

  static readData(KEY) {
    return JSON.parse(window.sessionStorage.getItem(KEY) || '[]')
  }

  static removeData(KEY) {
    if (window.sessionStorage) {
      sessionStorage.removeItem(KEY)
    }
  }
}

export { Local, Section }
