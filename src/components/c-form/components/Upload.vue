
<!--
  1、使用file-list下，before-upload会出现问题，原因暂时不只
  2、默认展示方式是文件，list-type为picture-card 为图片
  3、limit默认为1
-->
<template>
  <div>
    <a-upload
      name="file"
      :action="uploadAction"
      :remove="remove"
      multiple
      :file-list="fileList"
      :before-upload="beforeUpload"
      v-on="$listeners"
      v-bind="_options"
      :show-upload-list="{
        showRemoveIcon: true,
        showDownloadIcon: true
      }"
      @download="_download"
      @change="handleChange"
    >
      <template v-if="fileList.length < _options.limit">
        <div v-if="_options.listType==='picture-card'">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            上传
          </div>
        </div>
        <div v-else class="col-all-center">
          <a-button icon="upload">上传</a-button>
        </div>
      </template>
    </a-upload>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      :width="900"
      @cancel="previewVisible = false"
    >
      <div style="padding: 15px">
        <img alt="example" style="width: 100%" :src="previewImage">
      </div>
    </a-modal>
  </div>
</template>
<script>
import { createUUID } from '@/utils'
function saveAs(data, name) {
  var urlObject = window.URL || window.webkitURL || window
  var export_blob = new Blob([data])
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
  save_link.href = urlObject.createObjectURL(export_blob)
  save_link.download = name
  save_link.click()
}
export default {
  name: 'Upload',
  props: {
    value: String,
    options: {
      type: Object,
      default: () => {
      }
    },
    prop: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      previewImage: '',
      previewVisible: false,
      maxSize: 10,
      fileList: [],
      uploadAction: this.$config.uploadAction,
      fileContext: this.$config.fileContext
    }
  },
  computed: {
    _options() {
      return Object.assign({
        limit: 1
      }, this.options || {})
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        val ? this.setFileList() : this.fileList = []
        this.$forceUpdate() // 强制重新渲染
      }
    }
  },
  methods: {
    _download(el) {
      el.url = el.url.replace(/\\/g, '/')
      const xhr = new XMLHttpRequest()
      xhr.open('GET', el.url, true)
      xhr.responseType = 'blob'
      // xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
      xhr.onload = () => {
        if (xhr.status === 200) {
          // 获取文件blob数据并保存
          var fileName = '1111'
          saveAs(xhr.response, fileName)
        }
      }

      xhr.send()
    },
    // 预览
    async handlePreview(file) {
      this.previewImage = file.url || this.fileContext + file.response.path
      this.previewVisible = true
    },
    // 文件列表
    setFileList() {
      if ((this.value ?? '') !== '') {
        this.fileList = this.value.split(',').map(item => {
          return {
            uid: createUUID(),
            name: item,
            status: 'done',
            url: this.fileContext + item,
            response: {
              status: 'success',
              path: item
            }
          }
        })
        this.handleSelectChange()
      } else {
        this.fileList = this.value
      }
    },
    // 删除
    remove() {
      this.handleSelectChange()
    },

    // 文件上传校验
    beforeUpload(file) {
      // 文件大小校验
      const maxSize = 1024 * this.maxSize
      const judeSize = file.size / 1024 < maxSize
      return new Promise((resolve, reject) => {
        // const fileName = file.name
        // if (!validName(fileName)) {
        //   this.$message.error('上传的文件名只能是汉字、字母、数字、下划线、短横线、括号、书名号,请修改后重新上传!')
        //   reject()
        // }
        if (!judeSize) {
          this.$message.error(`上传文件大小不能超过${this.maxSize}M!`)
          reject()
        } else {
          resolve() // 必须项
        }
      })
    },
    // 文件上传
    handleChange(info) {
      this.fileList = info.fileList
      if (info.file.status === 'done') {
        const res = info.file.response
        if (res.path) {
          this.handleSelectChange()
        } else {
          this.fileList.pop()
          this.$message.error(`图片上传失败`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
      this.$emit('clearValidate', this.prop)
    },
    // 上传文件处理
    handleSelectChange() {
      setTimeout(() => {
        if (this.fileList.every(i => i.response && i.response.path !== '')) {
          this.$emit('input', this.fileList.map(i => i?.response?.path).toString())
        }
      }, 10)
    }
  }
}
</script>
