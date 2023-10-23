import CryptoJS from 'crypto-js'
const APPID = '444463a5'
const API_KEY = '3ddbf6fd11a5839f6ebae3b8dbcd8b8e'
const API_SECRET = 'MGY4ZGE5MGYxNzIzYWMwY2EyOWY2ZWU1'
const { host } = window.location
const date = new Date().toGMTString()
const algorithm = 'hmac-sha256'
const headers = 'host date request-line'
const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET)
const signature = CryptoJS.enc.Base64.stringify(signatureSha)
const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
const authorization = btoa(authorizationOrigin)
const URL = `wss://spark-api.xf-yun.com/v1.1/chat?authorization=${authorization}&date=${date}&host=${host}`
class WebSocketClient {
  constructor() {
    this.socket = null
  }

  connect() {
    if ('WebSocket' in window) {
      this.socket = new WebSocket(URL)
    } else if ('MozWebSocket' in window) {
      this.socket = new MozWebSocket(URL)
    } else {
      console.error('WebSocket is not supported in this browser.')
      return
    }
    this.socket.onopen = () => {
      this.onOpen()
    }
    this.socket.onmessage = (event) => {
      this.onMessage(event)
    }
    this.socket.onclose = (event) => {
      this.onClose(event)
    }
  }

  onOpen() {
    const params = {
      header: {
        app_id: APPID,
        uid: '1'
      },
      parameter: {
        chat: {
          domain: 'general',
          temperature: 0.5,
          max_tokens: 1024
        }
      },
      payload: {
        message: {
          text: [
            {
              role: 'user',
              content: 'hello'
            }
          ]
        }
      }
    }
    this.socket.send(JSON.stringify(params))
  }

  onMessage() {

  }

  onClose() {
    if (this.socket) {
      this.socket.close()
    }
  }
}

export default WebSocketClient
