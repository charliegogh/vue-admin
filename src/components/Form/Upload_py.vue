<template>
  <div>
    <a-upload
      name="file"
      :remove="remove"
      method="put"
      :custom-request="customRequest"
      :file-list="fileList"
      :before-upload="beforeUpload"
      v-bind="_options"
      :headers="{
        'Content-Type': 'application/octet-stream'
      }"
    >
      <template v-if="fileList.length < _options.limit">
        <div v-if="_options.listType === 'picture-card'">
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
    <a-modal :visible="previewVisible" :footer="null" :width="900" @cancel="previewVisible = false">
      <div style="padding: 15px">
        <img alt="example" style="width: 100%" :src="previewImage">
      </div>
    </a-modal>
  </div>
</template>
<script>
import { createUUID } from '@/utils'
import axios from 'axios'
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
      uploadAction: null,
      filename: null,
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
    // 预览
    async handlePreview(file) {
      this.previewImage = file.url || this.fileContext + file.response.path
      this.previewVisible = true
    },
    // 文件列表
    setFileList() {
      if ((this.value ?? '') !== '') {
        const list = this.value.split(',')
        Promise.all(list.map(i => this.getFileUrl(i))).then(rs => {
          this.fileList = rs.map((item, index) => {
            return {
              uid: createUUID(),
              name: list[index],
              status: 'done',
              url: item,
              response: {
                path: item
              }
            }
          })
        })
        console.log(this.fileList)
      } else {
        this.fileList = this.value
      }
    },
    // 删除
    remove(info) {
      this.fileList.find(i => i.uid === info.uid).status = 'removed'
      this.handleSelectChange()
    },
    async getFileUrl(filename) {
      const { url } = await this.$fetch.postAction('/enterprise_show/presign_file_get', { filename })
      return Promise.resolve(url)
    },
    // 文件上传校验
    async beforeUpload(file) {
      console.log(file)
      const rs = await this.$fetch.postAction('/enterprise_show/presign_file_upload', {
        'uid': createUUID(),
        'enterprise_id': createUUID(),
        'filename': file.name
      })
      this.uploadAction = rs.url
      this.filename = rs.filename
      return Promise.resolve()
    },
    // 自定义上传
    customRequest({ file, headers }) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = async(event) => {
        axios.put(this.uploadAction, event.target.result, {
          headers
        }).then(async() => {
          this.fileList.push({
            uid: createUUID(),
            name: this.filename,
            status: 'done',
            url: this.filename,
            response: {
              path: this.filename
            }
          })
          this.handleSelectChange()
        })
      }
    },
    // 上传文件处理
    handleSelectChange() {
      this.$emit('input', this.fileList.filter(i => i.status === 'done').map(i => i?.name).toString())
    }
  }
}
</script>
