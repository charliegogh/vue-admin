<template>
  <a-card :bordered="false">
    <!-- 表格-条件筛区域  -->
    <div class="table-operator">
      <a-select ref="select" v-model="tableName" placeholder="请选择模型" style="width: 150px;margin-right: 8px" @change="chooseTableName">
        <a-select-option v-for="(item, index) in tableList" :key="index" :value="item.table_name">
          {{ item.table_name }}
        </a-select-option>
      </a-select>

      <a-input v-model="moduleCode" placeholder="请输入模型描述" style="width: 200px;" class="filter-item" />
      <a-button class="filter-item" type="primary" icon="el-icon-view" @click="preview()">预览</a-button>
    </div>
    <!-- 表格-内容区域 -->
    <a-table
      :columns="columns"
      size="middle"
      :data-source="columnList"
      :loading="loading"
      :row-key="(record,index)=>index"
    >

      <template v-for="item of Object.keys(columnsDict)" :slot="item" slot-scope="text, record, index">
        <template v-if="columnsDict[item].type==='select'">
          <a-select :key="item" v-model="record[item]" style="width: 120px;">
            <a-select-option
              v-for="(item, index2) in columnsDict[item].dataSource"
              :key="index2"
              :value="item.value"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </template>
        <template v-else>
          <CSwitch v-model="record[item]" />
        </template>
      </template>
    </a-table>
    <!--新增编辑界面-->
    <a-modal title="代码预览" width="85%" top="2vh" :visible.sync="dialogFormVisible" @cancel="dialogFormVisible=false">

      <div style="height:500px;overflow-y: scroll;">
        <a-tabs v-model="activeName">
          <a-tab-pane v-for="item in codeTabs" :key="item.title" :tab="item.title">
            <!-- <div v-html="item.content"></div> -->
            <pre style="color: red;" contenteditable="true">{{ item.content }}</pre>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
    <previewModal
      ref="previewModal"
    />
  </a-card>
</template>

<script>
import CSwitch from '@/components/c-form/components/CSwitch'
import previewModal from '@/views/tools/components/previewModal'
export default {
  components: {
    CSwitch,
    previewModal
  },
  data() {
    return {
      tableKey: 0,
      active: 0,
      loading: false,
      tableList: [],
      tableName: undefined,
      moduleCode: '',
      columnList: [],
      dialogFormVisible: false,
      activeName: 'antdv.ftl',
      codeTabs: [],
      columnsDict: {
        'FORM_SHOW_TYPE': {
          type: 'select',
          value: 'input',
          dataSource: [
            { 'value': 'input', 'text': '文本框' },
            { 'value': 'input-number', 'text': '数字输入框' },
            { 'value': 'textarea', 'text': '大文本' },
            { 'value': 'select', 'text': '下拉框' },
            { 'value': 'multipleSelect', 'text': '多选框' },
            { 'value': 'files', 'text': '文件附件' },
            { 'value': 'date', 'text': '日期选择' },
            { 'value': 'cascade', 'text': '级联选择器' },
            { 'value': 'radio-group', 'text': '单选' },
            { 'value': 'checkbox-group', 'text': '多选' }
          ]
        },
        'LIST_SHOW_TYPE': {
          value: '0',
          type: 'select',
          dataSource: [
            { 'value': '0', 'text': '文本框' },
            { 'value': '1', 'text': '图片' },
            { 'value': '2', 'text': '标签' },
            { 'value': '3', 'text': '开关' }
          ]
        },
        'LIST_SHOW_FLAG': {
          type: 'CSwitch',
          value: '0',
          dataSource: []
        },
        'FORM_SHOW_FLAG': {
          type: 'CSwitch',
          value: '0',
          dataSource: []
        },
        'FORM_RULE_FLAG': {
          type: 'CSwitch',
          value: '0',
          dataSource: []
        },
        'LIST_SEARCH': {
          type: 'CSwitch',
          value: '0',
          dataSource: []
        }
      },
      columns: [
        { title: '列名', dataIndex: 'COLUMN_NAME', align: 'center', key: 'COLUMN_NAME' },
        { title: '注释', dataIndex: 'COLUMN_COMMENT', align: 'center', key: 'COLUMN_COMMENT' },
        { title: '列类型', dataIndex: 'COLUMN_TYPE', align: 'center', key: 'COLUMN_TYPE' },
        {
          title: '列表是否显示', dataIndex: 'LIST_SHOW_FLAG', align: 'center', key: 'LIST_SHOW_FLAG',
          scopedSlots: { customRender: 'LIST_SHOW_FLAG' }
        },
        {
          title: '列表查询', dataIndex: 'LIST_SEARCH', align: 'center', key: 'LIST_SEARCH',
          scopedSlots: { customRender: 'LIST_SEARCH' }
        },
        {
          title: '列表展示方式', dataIndex: 'LIST_SHOW_TYPE', align: 'center', key: 'LIST_SHOW_TYPE',
          scopedSlots: { customRender: 'LIST_SHOW_TYPE' }
        },
        {
          title: '表单是否显示', dataIndex: 'FORM_SHOW_FLAG', align: 'center', key: 'FORM_SHOW_FLAG',
          scopedSlots: { customRender: 'FORM_SHOW_FLAG' }
        },
        {
          title: '表单域类型', dataIndex: 'FORM_SHOW_TYPE', align: 'center', key: 'FORM_SHOW_TYPE',
          scopedSlots: { customRender: 'FORM_SHOW_TYPE' }
        },
        {
          title: '表单是否必填', dataIndex: 'FORM_RULE_FLAG', align: 'center', key: 'FORM_RULE_FLAG',
          scopedSlots: { customRender: 'FORM_RULE_FLAG' }
        }
      ],
      dataSource: []
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
    },
    // 获取数据库表列表数据
    async getTableList() {
      this.tableList = await this.$fetch.getAction('/sysCode/getTableList')
    },
    // 选中数据库表
    chooseTableName(tableName) {
      this.tableName = tableName
      this.getColumnList(tableName)
    },
    // 获取字段列表数据
    async getColumnList(tableName) {
      const rs = await this.$fetch.getAction('/sysCode/getColumnList', { tableName: tableName })
      this.columnList = rs.map(item => {
        return {
          ...item,
          ...Object.fromEntries(Object.entries(this.columnsDict).map(i => {
            i[1] = i[1].value
            return i
          }))
        }
      })
    },
    // //点击预览事件
    async preview() {
      if ((this.tableName ?? '') === '') {
        this.$message.error('请选择模型')
        return
      }
      if ((this.moduleCode ?? '') === '') {
        this.$message.error('请输入模型描述')
        return
      }
      const rs = await this.$fetch.postAction('/sysCode/preview',
        {
          moduleCode: this.moduleCode, // 模块名称
          columnList: JSON.stringify(this.columnList)
        }
      )
      this.$refs.previewModal.show(rs)
    }
  }
}
</script>
