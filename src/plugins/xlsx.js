export default function xlsxLoader() {
  return new Promise(function(resolve, reject) {
    if (window.XLSX) {
      resolve(window.XLSX)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = false
      script.src = '//cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/xlsx.full.min.js' + '?callback=init'
      document.head.appendChild(script)
      script.onload = () => {
        resolve()
      }
      script.onerror = reject
    }
    window.init = function() {
      resolve(window.XLSX)
    }
  })
}
