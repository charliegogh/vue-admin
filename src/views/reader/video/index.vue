<template>
  <a-card :bordered="false">
    <div class="video-wrapper">
      <!--      <div class="video-try">-->
      <!--        <div class="video-try__buy">-->
      <!--          <p class="vide-try__title">试看结束</p>-->
      <!--          <div class="cut-line" />-->
      <!--          <p class="video-try__tip">购买课程可学习该课程全部章节</p>-->
      <!--          <div class="video-try-action">立即购买</div>-->
      <!--          <div class="try-again">-->
      <!--            <img src="data:image/png;base64,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">-->
      <!--            重新试看-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="video-try__receive">-->
      <!--          <p class="vide-try__title">试看结束</p>-->
      <!--          <div class="cut-line" />-->
      <!--          <p>免费领取本课程可学习该课程全部章</p>-->
      <!--          <div class="video-try-action receive">免费领取</div>-->
      <!--          <div class="try-again">-->
      <!--            <img src="data:image/png;base64,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">-->
      <!--            重新试看-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="video-box">
        <div class="video" />
      </div>
    </div>
    <a-button @click="videoSeek(0)">重新观看</a-button>
    <a-button @click="buyCallBack">购买后继续观看</a-button>
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
    },
    // 继续观看
    buyCallBack() {
      this.player.removeListener('time', this.timeHandler)
      this.player.removeListener('seekTime', this.seekTimeHandler)
      this.player.removeListener('clickEvent', this.play)
      this.videoSeek(this.duration)
    }
  }
}
</script>
<style lang="less">
@import "style";
</style>
