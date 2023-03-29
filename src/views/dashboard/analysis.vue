<template>
  <a-card :bordered="false">
    <c-search
      v-bind="search"
    >
      <template slot="fl">
        <a-dropdown>
          <a class="ant-dropdown-link">
            <a-button type="primary" icon="import" :loading="importLoading">
              {{ importLoading ? '正在加载' : '导入' }}
            </a-button>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a>模板下载</a>
            </a-menu-item>
            <a-menu-item>
              <Import
                action="~~~~~~~~~~~~~~~~"
                @change="handleImport"
              />
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </c-search>
    <a-row :gutter="24">
      <a-col :span="24">
        <Form
          v-bind="form"
        >
          <a-button
            slot="submit"
            type="primary"
            html-type="submit"
            class="login-button"
            @click="submit"
          >提交
          </a-button>
        </Form>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
import Import from '../../components/c-form/components/Import'
export default {
  components: { Import },
  mixins: [ListMixin],
  data() {
    return {
      disableMixinCreated: true,
      importLoading: false,
      filter: {
        dataForm: {
        }
      },
      url: {
        dict: [
          {
            code: 'user',
            api: '/sys/user/list'
          }
        ]
      },
      search: {
        formFields: [
        ]
      },
      form: {
        ref: 'form',
        dataForm: {
          switch: false,
          'radio-group': '1',
          MultipleSelect: 'charlie',
          cascade: '110000,110100,110102',
          treeSelect: '',
          files: 'efc07c6a-039e-4cbc-84d5-606ec20448d0瑞尺新材料.doc',
          select: null,
          dateRange: [
            '2022-08', '2022-10'
          ]
        },
        rules: {
          input: [
            { required: true, message: '请输入~!' }
          ],
          cascade: [
            { required: true, message: '请选择~!' }
          ],
          treeSelect: [
            { required: true, message: '请选择~!' }
          ]
        },
        formFields: [
          {
            prop: 'richText', label: '富文本', component: 'Tinymce'
          },
          {
            prop: 'dateRange', label: '时间范围', component: 'dateRange'
            // format: 'YYYY-MM',
            // mode: ['month', 'month']
          },
          {
            prop: 'date', label: '时间选择器', component: 'date'
          },
          {
            prop: 'treeSelect', label: '树形选择', component: 'treeSelect',
            placeholder: '请选择',
            replaceFields: {
              label: 'name',
              value: 'name',
              children: 'children',
              rsTreeParams: 'test'
            },
            treeData: [
              {
                name: '1',
                children: [
                  {
                    name: '2'
                  },
                  {
                    name: '2-2'
                  }
                ]
              },
              {
                name: '1-1',
                children: [
                  {
                    name: '1-1-1'
                  }
                ]
              }
            ]
          },
          {
            prop: 'files', label: '文件上传', component: 'upload',
            options: {
              limit: 10
              // listType: 'picture-card'
            }
          },
          {
            prop: 'input', label: '输入框', component: 'input',
            placeholder: '1111'
          },
          {
            prop: 'password', label: '密码输入框', component: 'password'
          },
          {
            prop: 'textarea', label: '大文本', component: 'textarea'
          },
          {
            prop: 'select', label: '下拉框', component: 'select',
            dataSource: [
              {
                name: 'charlie',
                code: 'charlie'
              },
              {
                name: 'roy',
                code: 'roy'
              }
            ],
            event: {
              change: (e) => {
                console.log(e)
              }
            }
          },
          {
            prop: 'MultipleSelect', label: '多选下拉框', component: 'multipleSelect',
            dataSource: [
              {
                name: 'charlie',
                code: 'charlie'
              },
              {
                name: 'roy',
                code: 'roy'
              }
            ]
          },
          {
            prop: 'input-number', label: '数字输入框', component: 'input-number',
            options: {
              mini: 1,
              formatter: (value) => (`${value}%`)
            }
          },
          {
            prop: 'switch', label: '开关', component: 'switch',
            options: {
              'checked-children': '111',
              'un-checked-children': '2222'
            }
          },
          {
            prop: 'radio-group', label: '单选', component: 'radio-group',
            dataSource: [
              {
                name: '是',
                code: '1'
              },
              {
                name: '否',
                code: '2'
              }
            ]
          },
          {
            prop: 'checkbox-group', label: '多选', component: 'checkbox-group',
            dataSource: [
              {
                name: 'charlie',
                code: 'charlie'
              },
              {
                name: 'roy',
                code: 'roy'
              }
            ]
          },
          {
            prop: 'cascade', label: '级联选择器', component: 'cascade',
            dataSource: [],
            options: {
              'field-names': {
                multiple: false, // 是否多选
                label: 'name',
                value: 'code',
                children: 'children'
              }
            }
          }

        ]
      }
    }
  },
  computed: {
  },
  watch: {
    'form.dataForm': {
      deep: true,
      handler(val) {
        console.log(val)
      }
    }
  },
  async mounted() {
  },
  methods: {
    submit() {
      console.log(this.form.dataForm)
      this.$refs.form.validate()
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
    }
  }
}
</script>
