<template>
  <a-card :bordered="false">
    <a-table
      :columns="columns"
      size="small"
      :data-source="dataSource"
      :row-key="record=>record.id"
      :loading="loading"
      :pagination="false"
    >
      <template slot="formatLink" slot-scope="text, record">
        <a :href="record.site" target="_blank">{{ record.site }}</a>
      </template>
      <template slot="formatLink2" slot-scope="text, record">
        <a :href="record.school_site" target="_blank">{{ record.school_site }}</a>
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="get(record)">获取</a>
      </template>
    </a-table>
  </a-card>
</template>
<script>
import { ListMixin } from '@/mixins/ListMixin'
const columns = [
  {
    'dataIndex': 'name',
    'title': '学校名称',
    'align': 'center',
    width: 100
  },
  {
    'dataIndex': 'school_id',
    'title': '学校id',
    'align': 'center',
    width: 100
  },
  {
    'dataIndex': 'site',
    'title': '外链1',
    scopedSlots: { customRender: 'formatLink' },
    width: 100
  },
  {
    'dataIndex': 'school_site',
    'title': '外链2',
    scopedSlots: { customRender: 'formatLink2' },
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: 100,
    align: 'center'
  }
]
export default {
  components: {
  },
  mixins: [ListMixin],
  data() {
    return {
      columns,
      query: {
        dataForm: {},
        formFields: [
          {
            'prop': 'id',
            'component': 'input',
            'label': ''
          },
          {
            'prop': 'name',
            'component': 'input',
            'label': ''
          },
          {
            'prop': 'school_id',
            'component': 'input',
            'label': ''
          }
        ]
      },
      url: {
        list: '/school/getList'
      }
    }
  },
  methods: {
    get(item) {
      this.$fetch.getAction(`http://47.93.4.29:88/schoolDetail/${item.school_id}/info.json`).then(rs => {
        item.site = rs.data.site
        item.school_site = rs.data.school_site
        this.$forceUpdate()
        this.save(item)
      })
    },
    async save(item) {
      await this.$fetch.postAction('/school/edit', item)
    }
  }
}
</script>

