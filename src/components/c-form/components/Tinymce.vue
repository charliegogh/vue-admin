<template>
  <Editor
    v-model="value"
    :init="setting"
  />
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import 'tinymce/icons/default'
export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    plugins: {
      type: [String, Array],
      default: 'lists image link media table textcolor wordcount contextmenu fullscreen'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link unlink image media table | removeformat | fullscreen',
      branding: false
    }
  },
  data() {
    return {
      setting: {
        skin_url: '/tinymce/skins/lightgray',
        language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', // 语言
        height: 300, // 编辑器高度
        branding: false, // 是否禁用“Powered by TinyMCE”
        menubar: true, // 顶部菜单栏显示,
        toolbar: this.toolbar,
        plugins: this.plugins
      }
    }
  },
  mounted() {
  },
  methods: {
    setup(editor) {
      console.log(editor)
    }
  }
}
</script>
<style>
.tox-notifications-container{
  display: none;
}
</style>
