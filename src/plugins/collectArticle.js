export default function xCollectLoader() {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = false
    script.src = './collectArticle.js' + '?callback=onCallback'
    script.onerror = reject
    document.body.appendChild(script)
    console.log('~~~~')
  })
}
