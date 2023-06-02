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
    console.log(' -- mixin created -- ')
    // 初始化字典配置 在自己页面定义
    await this.loadDict()
    if (!this.disableMixinCreated) {
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
    async searchReset() {
      this.queryParam = {}
      await this.loadData()
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
    async modalFormOk() {
      await this.loadData()
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
      this.$refs.modalForm.detail(record)
    },
    async handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      const rs = await this.$fetch.deleteAction(this.url.delete, { id: id })
      if (rs.code === 200) {
        this.$message.success('操作成功')
        await this.loadData()
      } else {
        this.$message.warning('操作失败')
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
    // blob 形式导出
    async handleExport(file) {
      const { url, name, type } = file
      try {
        this.exportLoading = true
        const res = await this.$fetch.getAction(url)
        const blob = new Blob([res])
        // 创建下载链接
        const link = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob) // 创建URL
        link.href = objectUrl
        // 执行下载名称
        link.download = name + '.' + type
        link.click() // 下载文件
        // 清理下载链接
        document.body.removeChild(link)
        URL.revokeObjectURL(objectUrl)
        this.exportLoading = false
      } catch (e) {
        this.exportLoading = false
      }
    },
    // 关闭一组页面并打开新的页面
    openAndClose(url, num) {
      // 打开新页面
      window.open(url, '_blank')
      // 获取前两个打开的窗口
      const windows = [window.opener, window]
      // 关闭前两个窗口
      for (let i = 0; i < num; i++) {
        if (windows[i]) {
          windows[i].close()
        }
      }
    }
  }
}
