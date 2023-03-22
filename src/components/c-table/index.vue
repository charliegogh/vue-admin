<template>
  <a-table
    size="middle"
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
    <template slot="action" slot-scope="text,record">
      <a @click="dispatch('handleEdit',record)">编辑</a>
      <a-divider type="vertical" />
      <a-popconfirm title="确定删除吗?" @confirm="() => dispatch('handleDelete',record.id)">
        <a>删除</a>
      </a-popconfirm>
      <slot name="action" />
    </template>
  </a-table>
</template>
<script>
import Emitter from './emitter'
export default {
  name: 'CTable',
  mixins: [Emitter]
}
</script>
