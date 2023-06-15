const calcTime = () => {
  const times = {}
  const t = window.performance.timing
  // DNS 查询时间
  times.dnsTime = t.domainLookupEnd = t.domainLookupStart
  // TCP建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart
  // DNS缓存时间
  times.appcacheTime = t.domainLookupStart - t.fetchStart
  // 卸载页面的时间
  times.unloadTime = t.unloadEventEnd - t.unloadEventStart
  // TCP连接耗时
  times.tcpTime = t.connectEnd - t.connectStart
  // request 请求耗时
  times.regTime = t.responseEnd - t.responseStart
  // 白屏时间
  times.blankTime = t.domLoading - t.fetchStart
  // 用户等待页面完全可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart
  return times
}
