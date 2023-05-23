import permission from '@/directive/permission'
export const ListMixin = {
  directives: { permission },
  data() {
    return {
      /* table加载状态 */
      loading: false,
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      importLoading: false,
      exportLoading: false
    }
  },
  async created() {
    // 初始化字典配置 在自己页面定义
    await this.loadDict()
    if (!this.disableMixinCreated) {
      console.log(' -- mixin created -- ')
      await this.loadData()
    }
    // 派发点击事件
    ['handleEdit', 'handleDelete'].forEach(i => {
      this.$on(i, p => this[i](p))
    })
  },
  methods: {
    searchQuery() {
      this.loadData()
    },
    searchReset() {
      this.queryParam = {}
      this.loadData()
    },
    async loadData(arg) {
      if (!this?.url?.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      try {
        const rs = await this.$fetch.getAction(this.url.list, this.queryParam)
        if (rs.success) {
          if (rs.success) {
            this.dataSource = rs.data
          }
          this.loading = false
        }
      } catch (e) {
        this.loading = false
      }
    },
    // 加载字典
    async loadDict() {
      // 本地
      await this.$store.dispatch('app/setDict', this.dict)
      if (this.url.dict) {
        await this.$store.dispatch('app/loadDict', this.url.dict)
        this.dict = {
          ...this.$store.getters.dict,
          ...this.dict
        }
      }
    },
    // 新增/修改 成功时，重载列表
    modalFormOk() {
      this.loadData()
    },
    handleAdd() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleEdit(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    handleDetail(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },
    handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      this.$fetch.deleteAction(this.url.delete, { id: id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.loadData()
        } else {
          this.$message.warning('操作失败')
        }
      })
    },
    // 信息导入
    handleImport(info) {
      if (info.file.status === 'uploading') {
        this.importLoading = true
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this.$message.success(`${info.file.response.message}`)
          this.importLoading = false
          this.loadData()
        } else {
          this.$message.error(`${info.file.response.message}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error('导入失败')
        this.importLoading = false
      }
    },
    // 文件下载 a 链接方式
    downloadFile(href) {
      const link = document.createElement('a')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.href = href
      // link.download = '文件名'
      link.click()
      document.body.removeChild(link)
    },
    async handleExport() {
      const file = {
        name: '',
        url: '',
        type: ''
      }
      try {
        this.exportLoading = true
        const res = await this.$fetch.uploadAction('/xx', {
        }, {
          responseType: 'blob'
        })
        const link = document.createElement('a')
        const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        const objectUrl = URL.createObjectURL(blob) // 创建URL
        link.href = objectUrl
        link.download = 'xx' + '.xlsx'
        link.click() // 下载文件
        URL.revokeObjectURL(objectUrl)
        this.exportLoading = false
      } catch (e) {
        this.exportLoading = false
      }
    }
  }
}
