<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    :width="1000"
    @ok="handleOk"
    @cancel="visible=false"
  >
    <a-tree
      :tree-data="[dataTree]"
      :selectable="false"
      :expanded-keys="expandedKey"
      :default-expand-all="true"
      class="solr-query-tree"
      :replace-fields="defaultProps"
    >
      <template slot="custom" slot-scope="{dataRef}">
        <template v-if="dataRef.logic && !dataRef.field">
          <div class="">
            <a-radio-group v-model="dataRef.logic">
              <a-radio :value="'And'">并且</a-radio>
              <a-radio :value="'Or'">或者</a-radio>
            </a-radio-group>
            <a-button type="link" icon="plus" style="height: auto;padding: 0 5px" @click="onAddGroup(dataRef)">分组
            </a-button>
            <a-button type="link" icon="plus" style="height: auto;padding: 0 5px" @click="onAddCondition(dataRef)">条件
            </a-button>
          </div>
        </template>
        <template v-else>
          <span>
            <a-select
              v-model="dataRef.tableField"
              style="width: 150px"
              size="small"
              @change="(value)=>onChangeTableField(value, dataRef)"
            >
              <a-select-option v-for="(o, index) in tableList" :key="index" :value="o.value">
                {{ o.tableLabel }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="dataRef.field"
              style="width: 150px"
              size="small"
              @change="(value)=>onChangeField(value, dataRef)"
            >
              <a-select-option v-for="(o, index) in fields" :key="index" :value="o.value">
                {{ o.label }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="dataRef.operator"
              style="width:110px;margin-left:5px;"
              size="small"
              @change="(value)=>onChangeOperator(value, dataRef)"
            >
              <a-select-option
                v-for="(op, index) in getOperators(dataRef.type)"
                :key="index"
                :label="op.label"
                :value="op.value"
              >
                {{ op.label }}
              </a-select-option>
            </a-select>

            <template v-if="dataRef.type === 'date'">
              <a-range-picker
                v-if="dataRef.config.type.indexOf('range') >= 0"
                :key="key"
                v-model="dataRef.dateRangeValue"
                size="small"
                :type="dataRef.config.type"
                unlink-panels
                :placeholder="['开始时间', '结束时间']"
                :default-value="dataRef.config.defaultTime"
                :format="dataRef.config.format"
                :value-format="dataRef.config.valueFormat"
                :picker-options="datePickerOptions"
                style="margin-left:5px;"
                @change="dataRangeChange(dataRef)"
              />
              <a-date-picker
                v-else
                :key="key"
                v-model="dataRef.value"
                size="small"
                :type="dataRef.config.type"
                :format="dataRef.config.format"
                :value-format="dataRef.config.valueFormat"
                :picker-options="datePickerOptions"
                style="margin-left:5px;"
              />
            </template>
            <a-input-number
              v-else-if="dataRef.type === 'number'"
              v-model="dataRef.value"
              size="small"
              controls-position="right"
              style="width:120px;margin-left:5px;"
            />
            <a-switch
              v-else-if="dataRef.type === 'bool'"
              v-model="dataRef.value"
              size="small"
              style="margin-left:5px;"
            />
            <a-input
              v-else
              v-model="dataRef.value"
              placeholder="请输入"
              size="small"
              style="width:160px;margin-left:5px;"
            />
          </span>
        </template>
        <a-button
          v-if="dataRef.key!==0"
          type="link"
          icon="minus"
          style="height: auto;padding: 0 5px;"
          @click="onDelete(dataRef)"
        >删除
        </a-button>
      </template>
    </a-tree>
  </a-modal>
</template>
<script>
export default {
  name: 'SolrQuery',
  props: {
    // {field: '', label: '', value: '', type: 'string', config: {type: '', format:'', valueFormat:''}}
    // 默认字段 default: true
    // 字段类型 type: 'string:字符串 | date:日期 | number:数字 | bool:布尔'
    // 日期操作符 operator: 'datetimerange'
    // 日期控件配置 config: {type: 'datetimerange', format:''yyyy-MM-dd HH:mm'', valueFormat:''yyyy-MM-dd HH:mm'', defaultTime : ['00:00:00', '00:00:00']}
    tableList: {
      type: Array,
      default() {
        return []
      }
    },
    columnList: {}
    // fields: {
    //   type: Array,
    //   default() {
    //     return [
    //     ]
    //   }
    // }
  },
  data() {
    const operators = {
      equal: { label: '等于', value: 'Equal' },
      notEqual: { label: '不等于', value: 'NotEqual' },
      contains: { label: '包含', value: 'Contains' },
      notContains: { label: '不包含', value: 'NotContains' },
      startsWith: { label: '开始以', value: 'StartsWith' },
      notStartsWith: { label: '开始不是以', value: 'NotStartsWith' },
      endsWith: { label: '结束以', value: 'EndsWith' },
      notEndsWith: { label: '结束不是以', value: 'NotEndsWith' },
      lessThan: { label: '小于', value: 'LessThan' },
      lessThanOrEqual: { label: '小于等于', value: 'LessThanOrEqual' },
      greaterThan: { label: '大于', value: 'GreaterThan' },
      greaterThanOrEqual: { label: '大于等于', value: 'GreaterThanOrEqual' },
      dateRange: { label: '时间段', value: 'dateRange' },
      any: { label: '在列表', value: 'Any' },
      notAny: { label: '不在列表', value: 'NotAny' }
    }

    const operatorGroups = {
      string: [
        operators.equal,
        operators.notEqual,
        operators.contains,
        operators.notContains,
        operators.startsWith,
        operators.notStartsWith,
        operators.endsWith,
        operators.notEndsWith
      ],
      date: [
        operators.equal,
        operators.notEqual,
        operators.lessThan,
        operators.lessThanOrEqual,
        operators.greaterThan,
        operators.greaterThanOrEqual,
        operators.dateRange
      ],
      number: [
        operators.equal,
        operators.notEqual,
        operators.lessThan,
        operators.lessThanOrEqual,
        operators.greaterThan,
        operators.greaterThanOrEqual
      ],
      bool: [
        operators.equal,
        operators.notEqual
      ]
    }

    const firstField = {
      field: '',
      label: ''
    }
    const firstTableField = {
      field: '',
      tableLabel: ''
    }
    // if (this.fields && this.fields.length > 0) {
    //   const field = this.fields.find(a => a.default === true)
    //   if (field) {
    //     firstField = field
    //   } else {
    //     firstField = this.fields[0]
    //   }
    // }
    // if (this.tableList && this.tableList.length > 0) {
    //   firstTableField = this.tableList[0]
    //   this.fields = this.columnList[firstTableField.value]
    //   firstField = this.fields[0]
    // }
    return {
      title: '高级查询',
      confirmLoading: false,
      visible: false,
      key: 1,
      operatorGroups: operatorGroups,
      firstField,
      firstTableField,
      expandedKey: [],
      dataTree: {
        key: 0,
        'logic': 'And',
        'scopedSlots': {
          'title': 'custom'
        },
        'filters': []
      },
      defaultProps: {
        label: '',
        children: 'filters'
      },
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      fields: []
    }
  },
  watch: {
    dataTree: {
      deep: true,
      handler(val) {
        // console.log([val], 'rs')
      }
    }
  },
  methods: {
    dataRangeChange(dataRef) {
      dataRef.value = dataRef.dateRangeValue.join(',')
    },
    onChangeOperator(value, data) {
      if (data.type === 'date') {
        this.key++
        if (value === 'dateRange') {
          data.value = null
          data.config.type = data.config.type + 'range'
        } else {
          if (data.config.type.indexOf('range') >= 0) {
            data.value = ''
            data.config.type = data.config.type.replace(/range$/, '')
          }
        }
      }
    },
    onChangeTableField(value, data) {
      console.log(this.columnList)
      this.fields = this.columnList[value]
      console.log(this.fields)
    },
    onChangeField(value, data) {
      const field = this.fields.find(a => a.value === value)
      data.value = null
      data.label = field.label
      data.type = field.type ? field.type : ''
      const operators = this.getOperators(data.type)
      let defaultOprator = ''
      if (field.operator) {
        const operatorIndex = operators.findIndex(a => a.value === field.operator)
        defaultOprator = operatorIndex >= 0 ? field.operator : ''
      }
      if (!defaultOprator) {
        defaultOprator = operators[0].value
      }
      data.operator = defaultOprator
      data.config = { ...field.config }
      if (data.type === 'date') {
        let dateType = 'date'
        if (data.operator === 'dateRange') {
          dateType = dateType + 'range'
        }
        data.config.type = data.config.type ? data.config.type : dateType
        if (data.config.type.indexOf('range') >= 0) {
          data.operator = 'dateRange'
        }
        data.config.format = data.config.format ? data.config.format : 'YYYY-MM-DD'
        data.config.valueFormat = data.config.valueFormat ? data.config.valueFormat : 'YYYY-MM-DD'
        data.config.defaultTime = data.config.defaultTime ? data.config.defaultTime : []
        console.log(data.config)
      }
    },
    onAddGroup(data) {
      const newFilter = {
        key: Date.now(),
        logic: 'And',
        'scopedSlots': {
          'title': 'custom'
        }
      }
      if (!data.filters) {
        this.$set(data, 'filters', [])
      }
      data.filters.push(newFilter)
      this.expandAll()
    },
    // 展开所有节点
    expandAll() {
      this.expandedKey = this.getTreeKeys([this.dataTree])
    },
    getOperators(type) {
      const ops = this.operatorGroups[type || 'string']
      return ops && ops.length > 0 ? ops : ops['string']
    },
    // 添加条件
    onAddCondition(data) {
      const firstOprator = this.getOperators(data.type)[0]
      const newFilter = {
        tableField: this.firstTableField.value,
        tableLabel: this.firstTableField.tableLabel,
        field: this.firstField.value,
        label: this.firstField.label,
        operator: firstOprator.value,
        value: '',
        key: Date.now(),
        'scopedSlots': {
          'title': 'custom'
        }
      }
      if (!data.filters) {
        this.$set(data, 'filters', [])
      }
      const index = data.filters.findIndex(a => a.logic && !a.field)
      if (index >= 0) {
        data.filters.splice(index, 0, newFilter)
      } else {
        data.filters.push(newFilter)
      }
      this.expandAll()
    },
    // 删除条件或者集合
    onDelete({ key }) {
      this.removeNode([this.dataTree], (node) => (node.key === key))
    },
    // 获取key集合 展开所有
    getTreeKeys(tree) {
      const ids = []

      function deep(tree) {
        for (let i = 0; i < tree.length; i++) {
          ids.push(tree[i].key)
          if (tree[i].filters) {
            deep(tree[i].filters)
          }
        }
      }

      deep(tree)
      return ids
    },
    // 删除树节点
    removeNode(tree, func) {
      const children = 'filters'
      const list = [tree]
      while (list.length) {
        const nodeList = list.shift()
        const delList = nodeList.reduce((r, n, idx) => (func(n) && r.push(idx), r), [])
        delList.reverse()
        delList.forEach(idx => nodeList.splice(idx, 1))
        const childrenList = nodeList.map(n => n[children]).filter(l => l && l.length)
        list.push(...childrenList)
      }
    },
    handleOk() {
      this.$emit('search', this.dataTree)
      this.visible = false
    }
  }
}
</script>
<style lang='less'>
.solr-query-tree {
  .ant-tree-title {
    display: flex;
    align-items: center;
  }
}
</style>
