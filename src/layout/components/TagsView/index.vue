<template>
  <div class="tags-view-container">
    <contextmenu
      :item-list="menuItemList"
      :visible.sync="menuVisible"
      style="z-index: 9999;"
      @select="onMenuSelect"
    />
    <a-tabs
      class="tab-layout-tabs"
      style="height:52px"
      :hide-add="true"
      type="editable-card"
      :active-key="activePage"
      @contextmenu.native="e => onContextmenu(e)"
      @change="changePage"
      @edit="editPage"
    >
      <a-tab-pane v-for="page in pageList" :id="page.fullPath" :key="page.fullPath">
        <span slot="tab" :pagekey="page.fullPath">{{ page.meta.title }}</span>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
const indexKey = '/dashboard/analysis'
import Contextmenu from './Contextmenu'
export default {
  components: {
    Contextmenu
  },
  data() {
    return {
      pageList: [],
      linkList: [],
      activePage: '',
      menuVisible: false,
      menuItemList: [
        { key: '4', icon: 'reload', text: '刷 新' },
        { key: '1', icon: 'arrow-left', text: '关闭左侧' },
        { key: '2', icon: 'arrow-right', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' }
      ],
      reloadFlag: true
    }
  },
  computed: {

  },
  watch: {
    '$route': function(newRoute) {
      // 除了 刷新页
      if (newRoute.name !== 'redirect') {
        this.activePage = newRoute.fullPath
        // 没有就添加
        if (this.linkList.indexOf(newRoute.fullPath) < 0) {
          this.linkList.push(newRoute.fullPath)
          this.pageList.push(Object.assign({}, newRoute))
        }
        // 刷新删除重复路由
        else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
          const oldIndex = this.linkList.indexOf(newRoute.fullPath)
          const oldPositionRoute = this.pageList[oldIndex]
          this.pageList.splice(oldIndex, 1, Object.assign({}, newRoute, { meta: oldPositionRoute.meta }))
        }
      }
    },
    'activePage': function(key) {
      const index = this.linkList.lastIndexOf(key)
      const waitRouter = this.pageList[index]
      if (waitRouter.fullPath !== this.$route.fullPath) {
        this.$router.push(Object.assign({}, waitRouter))
        // this.changeTitle(waitRouter.meta.title)
      }
    }
  },
  mounted() {
    this.initTags()
  },
  methods: {
    initTags() {
      if (this.$route.path !== indexKey) {
        // this.addIndexToFirst()
      }
      // 复制一个route对象出来，不能影响原route
      const currentRoute = Object.assign({}, this.$route)
      currentRoute.meta = Object.assign({}, currentRoute.meta)
      this.pageList.push(currentRoute)
      this.linkList.push(currentRoute.fullPath)
      this.activePage = currentRoute.fullPath
    },
    // 将首页添加到第一位
    addIndexToFirst() {
      this.pageList.splice(0, 0, {
        name: 'Dashboard',
        path: indexKey,
        fullPath: indexKey,
        meta: {
          icon: 'dashboard',
          title: '控制台'
        }
      })
      this.linkList.splice(0, 0, indexKey)
    },
    // 切换tab
    changePage(key) {
      this.activePage = key
    },
    // 删除
    editPage(key, action) {
      this[action](key)
    },
    // 删除tab
    remove(key) {
      if (key === indexKey) {
        this.$message.warning('首页不能关闭!')
        return
      }
      if (this.pageList.length === 1) {
        this.$message.warning('这是最后一页，不能再关闭了啦')
        return
      }
      this.pageList = this.pageList.filter(item => item.fullPath !== key)
      let index = this.linkList.indexOf(key)
      this.linkList = this.linkList.filter(item => item !== key)
      index = index >= this.linkList.length ? this.linkList.length - 1 : index
      this.activePage = this.linkList[index]
    },
    // 删除其他
    closeOthers(pageKey) {
      const index = this.linkList.indexOf(pageKey)
      if (pageKey === indexKey || pageKey.indexOf('?ticke=') >= 0) {
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.activePage = this.linkList[0]
      } else {
        const indexContent = this.pageList.slice(0, 1)[0]
        this.linkList = this.linkList.slice(index, index + 1)
        this.pageList = this.pageList.slice(index, index + 1)
        this.linkList.unshift(indexContent.fullPath)
        this.pageList.unshift(indexContent)
        this.activePage = this.linkList[1]
      }
    },
    closeLeft(pageKey) {
      if (pageKey === indexKey) {
        return
      }
      if (this.pageList.length === 1) {
        return
      }
      const tempList = [...this.pageList]
      const indexContent = tempList.slice(0, 1)[0]
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(index)
      this.pageList = this.pageList.slice(index)
      this.linkList.unshift(indexContent.fullPath)
      this.pageList.unshift(indexContent)
      if (this.linkList.indexOf(this.activePage) < 0) {
        this.activePage = this.linkList[0]
      }
    },
    closeRight(pageKey) {
      const index = this.linkList.indexOf(pageKey)
      this.linkList = this.linkList.slice(0, index + 1)
      this.pageList = this.pageList.slice(0, index + 1)
      if (this.linkList.indexOf(this.activePage < 0)) {
        this.activePage = this.linkList[this.linkList.length - 1]
      }
    },
    onMenuSelect(key, target) {
      const pageKey = this.getPageKey(target)
      switch (key) {
        case '1':
          this.closeLeft(pageKey)
          break
        case '2':
          this.closeRight(pageKey)
          break
        case '3':
          this.closeOthers(pageKey)
          break
        case '4':
          this.routeReload()
          break
        default:
          break
      }
    },
    // 右键打开
    onContextmenu(e) {
      const pagekey = this.getPageKey(e.target)
      if (pagekey !== null) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    getPageKey(target, depth) {
      depth = depth || 0
      if (depth > 2) {
        return null
      }
      let pageKey = target.getAttribute('pagekey')
      pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
      return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
    },
    // 页面刷新
    routeReload() {
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

  }
}
</script>
<style lang="less">
.tags-view-container{
  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-leave-active {
    opacity: 0;
  }

  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  /*美化弹出Tab样式*/
  .ant-tabs-nav-container {
    margin-top: 4px;
  }

  /* 修改 ant-tabs 样式 */
  .tab-layout-tabs.ant-tabs {
    //border-bottom: 1px solid #ccc;
    //border-left: 1px solid #ccc;
    background-color: white;
    padding: 0 20px;

    .ant-tabs-bar {
      margin: 4px 0 0;
      border: none;
    }

  }

  .tab-layout-tabs.ant-tabs {

    &.ant-tabs-card .ant-tabs-tab {

      padding: 0 24px !important;
      background-color: white !important;
      margin-right: 10px !important;

      .ant-tabs-close-x {
        width: 12px !important;
        height: 12px !important;
        opacity: 0 !important;
        cursor: pointer !important;
        font-size: 12px !important;
        margin: 0 !important;
        position: absolute;
        top: 36%;
        right: 6px;
      }

      &:hover .ant-tabs-close-x {
        opacity: 1 !important;
      }

    }

  }

  .tab-layout-tabs.ant-tabs.ant-tabs-card > .ant-tabs-bar {
    .ant-tabs-tab {
      border: none !important;
      border-bottom: 1px solid transparent !important;
    }
    .ant-tabs-tab-active {
      border-color: #1890FF!important;
    }
  }
}

</style>
