<template>
  <a-card :bordered="false">
    <div class="video-box">
      <div class="video" />
    </div>
    <a-button @click="reWatch">重新观看</a-button>
  </a-card>
</template>
<script>
let timeHandlerCalls = 0
export default {
  data() {
    return {
      player: null,
      allowDuration: 5,
      trialPaused: false,
      duration: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const videoObject = {
        container: '.video-box', // “#”代表容器的ID，“.”或“”代表容器的class
        variable: 'player', // 播放函数名称，该属性必需设置，值等于下面的new ckplayer()的对象
        crossorigin: 'anonymous', // 设置html5视频的crossOrigin属性
        html5m3u8: true,
        loaded: 'loadedHandler', // 播放器加载完成后调用该函数
        // forceduration: this.duration,
        video: 'https://kvod.cnki.net/straight/3630/ts/815851cbf5724059a3d6bd01d25c041a/720p/815851cbf5724059a3d6bd01d25c041a_720P.m3u8'
      }
      const player = new ckplayer(videoObject)
      this.player = player
      // 监听播放时间
      player.addListener('time', this.timeHandler)
      // 监听跳转时间
      player.addListener('seekTime', this.seekTimeHandler)
      // 监听 play
      this.player.addListener('clickEvent', this.play)
    },
    // 试看
    timeHandler(e) {
      this.duration = e
      if (e > this.allowDuration) {
        timeHandlerCalls++
        if (timeHandlerCalls === 2) {
          this.player.videoPause()
          console.log('试看结束')
          timeHandlerCalls = 0
        }
      }
    },
    play() {
      if (this.duration > this.allowDuration) {
        this.player.removeListener('time', this.timeHandler)
        this.reWatch()
      }
    },
    // 重新观看
    reWatch() {
      const player = this.player
      player.videoSeek(0)
      setTimeout(() => {
        this.player.addListener('time', this.timeHandler)
      }, 50)
    },
    seekTimeHandler(e) {
      if (e > this.allowDuration) {
        this.player.removeListener('time', this.timeHandler)
        this.reWatch()
      }
    }
  }
}
</script>
<style lang="less">
.video-box {
  height: 500px;
}
</style>
