<template>
  <a-card :bordered="false">
    <div class="video-wrapper">
      <div class="video-box">
        <div class="video" />
      </div>
    </div>
    <a-button @click="videoSeek(0)">重新观看</a-button>
  </a-card>
</template>
<script>
let timeHandlerCalls = 0
export default {
  data() {
    return {
      player: null,
      allowDuration: 10,
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
        video: 'https://kvod.cnki.net/straight/3824/ts/b34053b01dd147dab5658634abc0cd71/720p/b34053b01dd147dab5658634abc0cd71_720P.m3u8'
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
    // 试看监听
    timeHandler(e) {
      this.duration = e
      if (this.duration > this.allowDuration) {
        timeHandlerCalls++
        if (timeHandlerCalls === 2) {
          this.player.videoPause()
          console.log('试看结束')
          timeHandlerCalls = 0
        }
      }
    },
    //  监听播放按钮
    play(e) {
      if (this.duration > this.allowDuration) {
        this.videoSeek(this.duration - 1)
      }
    },
    // 视频工具栏跳转
    seekTimeHandler(e) {
      if (e > this.allowDuration) {
        this.videoSeek(this.duration - 1)
      }
    },
    // 跳转到视频指定
    videoSeek(e = 0) {
      timeHandlerCalls = 0
      const { player } = this
      player.videoSeek(e)
    }
  }
}
</script>
<style lang="less">
@import "style";
</style>
