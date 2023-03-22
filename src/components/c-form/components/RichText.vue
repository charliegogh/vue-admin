<!--
toolbars: [
[
'undo', // 撤销
'bold', // 加粗
'indent', // 首行缩进
'italic', // 斜体
'underline', // 下划线
'strikethrough', // 删除线
'subscript', // 下标
'fontborder', // 字符边框
'superscript', // 上标
'formatmatch', // 格式刷
'fontfamily', // 字体
'fontsize', // 字号
'justifyleft', // 居左对齐
'justifycenter', // 居中对齐
'justifyright', // 居右对齐
'justifyjustify', // 两端对齐
'insertorderedlist', // 有序列表
'insertunorderedlist', // 无序列表
'lineheight', // 行间距
'attachment' // 附件
]
]
-->

<template>
  <div class="" style="padding: 5px">
    <vue-ueditor-wrap
      v-model="content"
      :config="{
        ...config,
        initialFrameHeight:initialFrameHeight
      }"
    />
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'RichText',
  components: { VueUeditorWrap },
  props: {
    prop: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    initialFrameHeight: {
      type: Number,
      default: 320
    }
  },
  data() {
    return {
      content: '',
      // 富文本编辑器配置
      config: {
        initialFrameWidth: '100%',
        autoHeightEnabled: false,
        autoFloatEnabled: false, // 开启工具栏悬浮
        maximumWords: 20000, // 最大可输入字符串
        zIndex: 1000,
        // enableAutoSave: false,
        // saveInterval: 0,
        UEDITOR_HOME_URL: './UEditor/',
        toolbars: [
          [
            'undo', // 撤销
            'bold', // 加粗
            'indent', // 首行缩进
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'fontborder', // 字符边框
            'superscript', // 上标
            'formatmatch', // 格式刷
            'fontfamily', // 字体
            'fontsize', // 字号
            'forecolor', // 字体颜色
            'backcolor', // 字体背景色
            'justifyleft', // 居左对齐
            'justifycenter', // 居中对齐
            'justifyright', // 居右对齐
            'justifyjustify', // 两端对齐
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'lineheight', // 行间距
            'attachment', // 附件
            'simpleupload', // 单图上传
            'fullscreen', // 全屏
            'date', // 日期
            'time' // 时间
            // 'source'  // html
          ]
        ]
      }
    }
  },
  watch: {
    content(value) {
      if (value) {
        this.$emit('clearValidate', this.prop)
      }
      this.$emit('input', value)
    },
    value: {
      immediate: true,
      handler(newVal) {
        this.content = newVal
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style>

</style>
