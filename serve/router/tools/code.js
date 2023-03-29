const router = require('koa-router')()
const base = '/sysCode'
const { sequelize } = require(process.cwd() + '/models')
router.get(base + '/getTableList', async(ctx) => {
  const sql = `select table_name from information_schema.tables where table_schema='vue-admin' and table_type='base table'`
  ctx.body = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
})
router.get(base + '/getColumnList', async(ctx) => {
  const { tableName } = ctx.request.query
  const sql = `select COLUMN_NAME as COLUMN_NAME,column_comment as COLUMN_COMMENT,COLUMN_TYPE as COLUMN_TYPE from Information_schema.columns where table_schema='charlie' and table_name = '${tableName}'`
  ctx.body = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
})

router.post(base + '/preview', async(ctx) => {
  const params = ctx.request.body
  const { moduleCode } = params
  const columnList = JSON.parse(params.columnList)
  // 表单
  const modalFormFields = columnList.filter(i => i.FORM_SHOW_FLAG === '0').map(i => {
    const { COLUMN_NAME, FORM_SHOW_TYPE, COLUMN_COMMENT } = i
    return {
      prop: COLUMN_NAME,
      component: FORM_SHOW_TYPE,
      label: COLUMN_COMMENT
    }
  })
  const modalFormRules = {}
  console.log(columnList)
  columnList.filter(i => i.FORM_RULE_FLAG === '0').forEach(i => {
    const { COLUMN_NAME, FORM_SHOW_TYPE, COLUMN_COMMENT } = i
    modalFormRules[COLUMN_NAME] = [
      { required: true, message: `请${FORM_SHOW_TYPE === 'input' ? '输入' : '选择'}${COLUMN_COMMENT}` }
    ]
  })
  const columns = columnList.filter(i => i.FORM_SHOW_FLAG === '0').map(i => {
    const { COLUMN_NAME, FORM_SHOW_TYPE, COLUMN_COMMENT } = i
    return {
      dataIndex: COLUMN_NAME,
      title: COLUMN_COMMENT,
      align: 'center'
    }
  })
  const queryFormFields = columnList.filter(i => i.LIST_SEARCH === '0').map(i => {
    const { COLUMN_NAME, FORM_SHOW_TYPE, COLUMN_COMMENT } = i
    return {
      prop: COLUMN_NAME,
      component: FORM_SHOW_TYPE,
      label: COLUMN_COMMENT
    }
  })
  const view = `
        <template>
      <a-card :bordered="false">
        <QueryForm
          v-bind="query"
          @searchReset="searchReset"
          @searchQuery="searchQuery"
          @handleAdd="handleAdd"
        />
        <a-table
          :columns="columns"
          size="middle"
          :data-source="dataSource"
          :loading="loading"
          :pagination="ipagination"
          :row-key="record=>record.id"
          :loading="loading"
          @change="handleTableChange"
        >
          <template slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </a-table>
        <Modal
          ref="modalForm"
        />
      </a-card>
    </template>
    <script>
    import { ListMixin } from '@/mixins/ListMixin'
    import ${moduleCode} from './components/${moduleCode}.vue'
    const columns = ${JSON.stringify(columns, null, '  ')}
    export default {
      components: {
        ${moduleCode}
      },
      mixins: [ListMixin],
      data() {
        return {
          columns,
          query: {
            dataForm: {},
            formFields: ${JSON.stringify(queryFormFields, null, '  ')}
          },
          url: {
            list: '/'
          }
        }
      },
      methods: {
      }
    }
    </script>
    `
  const modal = `
        <template>
          <a-modal
            :title="title"
            :visible="visible"
            :confirm-loading="confirmLoading"
            cancel-text="关闭"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <Form
              v-bind="Form"
            />
          </a-modal>
        </template>
        <script>
        export default {
          data() {
            return {
              confirmLoading: false,
              visible: false,
              title: '操作',
              Form: {
                 ref:'Form',
                 dataForm:{},
                 formFields:${JSON.stringify(modalFormFields, null, '  ')},
                 rules:${JSON.stringify(modalFormRules, null, '  ')}
              }
            }
          },
          mounted() {

          },
          methods: {
            // 表单提交
            async handleOk() {
              try {
                const status = this.$refs.Form.validate() // 调用组件的校验
                if (status) {
                    this.confirmLoading = true
                  const res = await this.$fetch.postAction('/', this.Form.dataForm)
                  if (res.success) {
                    this.visible = false
                    this.confirmLoading = false
                    this.$emit('ok')
                  }
                }
              } catch (e) {
                this.confirmLoading = false
              }
            },
            // 取消
            handleCancel() {
              this.visible = false
            },
            // 新增
            add() {
              this.edit({})
            },
            edit(record) {
              this.Form.dataForm = Object.assign({}, record)
              this.visible = true
              this.$nextTick(() => {
                this.$refs.Form.clearValidate()
              })
            }
          }
        }
        </script>
        `
  ctx.body = {
    view,
    modal

  }
})
module.exports = router.routes()
