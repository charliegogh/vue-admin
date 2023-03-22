<template>
  <a-modal
    title="查看"
    :visible="visible"
    @ok="visible=false"
    width="70vw"
    @cancel="visible=false"
  >
    <a-tabs
      v-model="active"
      :default-active-key="0"
      tab-position="top"
      @change="(e)=>{
        active=e
      }"
    >
      <a-tab-pane
        v-for="(item,index) of tabsList"
        :key="item.name"
        :tab="item.name"
      />
    </a-tabs>
    <codemirror
      :options="cmOptions"
      :value="tabsList[active].dataSource"
    />
  </a-modal>
</template>
<script>
import CModal from '@/components/c-modal'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// language js
import 'codemirror/mode/javascript/javascript.js'
// theme css
import 'codemirror/theme/base16-dark.css'
export default {
  components: {
    codemirror,
    CModal
  },
  data() {
    return {
      active: '表单',
      tabsList: {
        列表: {
          name: '列表',
          dataSource: null
        },
        表单: {
          name: '表单',
          dataSource: null
        }
      },
      visible: false,
      cmOptions: {
        tabSize: 2,
        lint: true,
        mode: 'text/javascript',
        theme: 'base16-dark',
        smartIndent: true, // 是否智能缩进
        // 显示行号
        lineNumbers: true,
        line: true,
        // lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        collapseIdentical: false,
        autoCloseBrackets: true, // 输入和退格时成对
        highlightDifferences: true
      },
      dataSource: null
    }
  },
  mounted() {

  },
  methods: {
    show(rs) {
      this.tabsList['列表'].dataSource = rs.view
      this.tabsList['表单'].dataSource = rs.modal
      this.active = '列表'
      this.visible = true
    }
  }
}
</script>
