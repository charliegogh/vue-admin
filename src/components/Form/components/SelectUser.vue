<template>
  <div>
    <a-input-search
      placeholder="请输入姓名按回车搜索"
      @change="onChange"
    />
    <a-tree
      checkable
      class="copy-to-user-list"
      default-expand-all
      :expanded-keys="expandedKeys"
      :checked-keys="checkedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="treeData"
      :selectable="false"
      :check-strictly="checkStrictly"
      :replace-fields="replaceFields"
      @expand="onExpand"
      @check="onTreeCheck"
    >
      <template slot="title" slot-scope="{ username }">
        <span v-if="username.indexOf(searchValue) > -1">
          {{ username.substr(0, username.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ username.substr(username.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ username }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
// const _dataSource = []
export default {
  name: 'SelectUserVue',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    treeData: {
      type: Array,
      default: () => []
    },
    replaceFields: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '操作',
      expandedKeys: [], // 展开的树节点
      searchValue: '',
      checkedKeys: [], // 选中
      checkStrictly: true, // 父子关联
      autoExpandParent: true, // 自动展开父节点
      isRadio: false // 单选还是复选
    }
  },
  methods: {
    // ref 传值
    toRef(checkedKeys = [], expandedKeys = []) {
      // 数据扁平化
      this.checkedKeys = checkedKeys
      this.expandedKeys = expandedKeys
    },
    onChange(e) {
      const value = e.target.value.replace(/(^\s*)|(\s*$)/g, '')
      // const expandedKeys = dataList
      //   .map(item => {
      //     if (item.username.indexOf(value) > -1) {
      //       return getParentKey(item.id, this.copyTo.userList)
      //     }
      //     return null
      //   })
      //   .filter((item, i, self) => item && self.indexOf(item) === i)
      // Object.assign(this, {
      //   expandedKeys,
      //   searchValue: value,
      //   autoExpandParent: true
      // })
    },
    // 树选择
    onTreeCheck(o, event) {
      this.checkedKeys = this.checkStrictly ? (this.isRadio ? [event.node.dataRef.id] : o.checked) : o
    },
    // 树展开
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    }
  }
}
</script>

<style scoped>

</style>
