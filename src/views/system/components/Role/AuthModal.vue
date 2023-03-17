<template>
  <a-drawer
    :title="title"
    :mask-closable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    :visible="visible"
    @close="close"
  >
    <a-form>
      <a-form-item label="所拥有的权限">
        <a-tree
          checkable
          :checked-keys="checkedKeys"
          :tree-data="treeData"
          :expanded-keys="expandedKeysss"
          :check-strictly="checkStrictly"
          :selectable="false"
          :replace-fields="{
            key:'id',
            title:'name'
          }"
          @check="onCheck"
          @expand="onExpand"
        >
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;" />
          </span>
        </a-tree>
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作
          <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="close">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="loading" ghost style="margin-right: 0.8rem" @click="handleSubmit(false)">仅保存
      </a-button>
      <a-button type="primary" :loading="loading" @click="handleSubmit(true)">保存并关闭</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { unique } from '_utils'

function getTreeIds(tree) {
  const ids = []
  function deep(tree) {
    for (let i = 0; i < tree.length; i++) {
      ids.push(tree[i].id)
      if (tree[i].children) {
        deep(tree[i].children)
      }
    }
  }
  deep(tree)
  return ids
}
export default {
  name: 'RoleModal',
  components: {},
  data() {
    return {
      drawerWidth: 700,
      roleId: '',
      treeData: [], // 角色树
      checkedKeys: [],
      expandedKeysss: [],
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: true,
      title: '角色权限配置',
      visible: false,
      loading: false,
      halfCheckedKeys: []
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.loadData()
      }
    }
  },
  methods: {
    // 树选择
    onCheck(o, e) {
      if (this.checkStrictly) {
        this.checkedKeys = o.checked
      } else {
        const { halfCheckedKeys } = e
        unique(this.halfCheckedKeys)
        this.halfCheckedKeys.push(...halfCheckedKeys)
        console.log(this.halfCheckedKeys)
        this.checkedKeys = o
      }
    },
    // 展示
    show(roleId) {
      this.roleId = roleId
      this.visible = true
    },
    // 关闭
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    // 展开收起节点
    onExpand(expandedKeys) {
      this.expandedKeysss = expandedKeys
      this.autoExpandParent = false
    },
    reset() {
      this.expandedKeysss = []
      this.checkedKeys = []
      this.loading = false
    },
    // 展开所有
    expandAll() {
      this.expandedKeysss = this.allTreeKeys
    },
    // 关闭所有
    closeAll() {
      this.expandedKeysss = []
    },
    // 全部勾选
    checkALL() {
      this.checkedKeys = this.allTreeKeys
    },
    // 取消勾选
    cancelCheckALL() {
      this.checkedKeys = []
    },
    // 父子关联
    switchCheckStrictly(v) {
      if (v === 1) {
        this.checkStrictly = false
      } else if (v === 2) {
        this.checkStrictly = true
      }
    },
    async handleSubmit(exit) {
      const params = {
        roleId: this.roleId,
        permissionIds: [...this.checkedKeys, ...this.halfCheckedKeys].join(',')
      }
      this.loading = true
      try {
        const res = await this.$fetch.postAction('/sys/permission/saveRolePermission', params)
        if (res.success) {
          this.loading = false
          if (exit) {
            this.close()
          } else {
            // 仅保存，只更新列表
            this.$emit('ok')
          }
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.message)
          this.loading = false
          if (exit) {
            this.close()
          }
        }
      } catch (e) {
        this.loading = false
        throw e
      }
    },
    // 数据加载
    async loadData() {
      const { data } = await this.$fetch.getAction('/sys/permission/getSystemMenuList')
      this.treeData = data
      this.allTreeKeys = getTreeIds(data)
      const { data: ids } = await this.$fetch.getAction('/sys/permission/queryRolePermission', {
        roleId: this.roleId
      })
      this.checkedKeys = [...ids]
      this.expandedKeysss = this.allTreeKeys
    }
  }
}

</script>
<style lang="less" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

</style>
