<template>
  <div>
    <a-table
      size="middle"
      :pagination="false"
      :row-key="record=>record.id"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="column in $attrs.columns" :slot="column.scopedSlots?column.scopedSlots.customRender:''" slot-scope="text,record">
        <slot
          v-bind="record"
          :name="column.scopedSlots?column.scopedSlots.customRender:''"
        />
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="dispatch('handleEdit',record)">查看</a>
        <a-divider type="vertical" />
        <a @click="dispatch('handleEdit',record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => dispatch('handleDelete',record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import Emitter from './emitter'
export default {
  name: 'CTable',
  mixins: [Emitter]
}
</script>
