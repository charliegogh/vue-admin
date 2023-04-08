<template>
  <Editor v-if="load" v-model="content" :init="setting" />
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
// import "tinymce/plugins/contextmenu";
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import 'tinymce/icons/default'
import { postAction } from '@/api'
export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  props: {
    prop: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    plugins: {
      type: [String, Array],
      // contextmenu textcolor
      default: 'lists image link media table  wordcount  fullscreen'
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link unlink image media table | removeformat | fullscreen',
      branding: false
    }
  },
  data() {
    return {
      load: false,
      content: '',
      setting: {
        skin_url: './tinymce/skins/lightgray',
        content_css: './tinymce/skins/lightgray/content.min.css',
        language_url: './tinymce/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', // 语言
        height: 300, // 编辑器高度
        branding: false, // 是否禁用“Powered by TinyMCE”
        menubar: true, // 顶部菜单栏显示,
        toolbar: this.toolbar,
        plugins: this.plugins,
        images_upload_handler: (blobInfo, success) => {
          const formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          formData.append('biz', 'jeditor')
          formData.append('jeditor', '1')
          postAction('/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(rs => {
            success(this.$config.filePrefix + rs.path)
          })
        }
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
      handler(val) {
        this.content = val
      }
    }
  },
  mounted() {
    //  二次加载问题，重新加载
    setTimeout(() => {
      this.load = true
    }, 1000)
  }
}
</script>
