<template>
  <div class="table-operator">
    <div class="form-inline-container">
      <a-form layout="inline" @keyup.enter.native="$emit('searchQuery')">
        <a-row
          :gutter="24"
          :class="
            !toggleStatus && formFields.length > maxFieldsShowLength
              ? 'toggleStatus'
              : ''
          "
        >
          <a-col
            v-for="(formField, index) in formFields"
            :key="formField.prop"
            v-bind="layout.inlineCol"
            :class="!toggleStatus && index > maxFieldsShowLength - 1 && 'none'"
          >
            <a-form-model-item
              :key="formField.prop"
              :label="formField.label"
              :prop="formField.prop"
            >
              <!-- 输入框 -->
              <a-input
                v-if="formField.component === 'input'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
                onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              />
              <!-- 密码输入框 -->
              <a-input-password
                v-if="formField.component === 'password'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                type="password"
                :placeholder="`请输入${formField.label}`"
              />
              <!-- textarea -->
              <a-textarea
                v-if="formField.component === 'textarea'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
              />
              <!-- 下拉 -->
              <a-select
                v-if="formField.component === 'select'"
                v-model="dataForm[formField.prop]"
                :placeholder="`请选择${formField.label}`"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              >
                <a-select-option
                  v-for="(item, index) in formField.dataSource"
                  :key="index"
                  :value="
                    item[(formField.config && formField.config.value) || 'code']
                  "
                >
                  {{
                    item[(formField.config && formField.config.label) || "name"]
                  }}
                </a-select-option>
              </a-select>
              <!-- 多级选择 字符串-->
              <MultipleSelect
                v-if="formField.component === 'MultipleSelect'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
              />
              <!-- 数字输入框 -->
              <a-input-number
                v-if="formField.component === 'input-number'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
              />
              <a-switch
                v-if="formField.component === 'switch'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              />
              <!-- 树状 -->
              <a-tree-select
                v-if="formField.component === 'tree-select'"
                v-model="dataForm[formField.prop]"
                :tree-data="formField.dataSource"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              />
              <!--   单选     -->
              <a-radio-group
                v-if="formField.component === 'radio-group'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                v-on="formField.event"
                @change="$emit('searchQuery')"
              >
                <a-radio
                  v-for="item of formField.dataSource"
                  :key="item[formField.radioValue || 'code']"
                  :value="item[formField.radioValue || 'code']"
                >
                  {{ item[formField.radioLabel || "name"] }}
                </a-radio>
              </a-radio-group>
              <!--   多选     -->
              <CheckboxGroup
                v-if="formField.component === 'checkbox-group'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
              />
              <!--   日期选择     -->
              <DatePicker
                v-if="formField.component === 'date'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
                @searchQuery="searchQuery"
              />
              <!--   区域级联选择     -->
              <Cascade
                v-if="formField.component === 'Cascade'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
                @change="searchQuery"
              />
              <!--   兹定于i     -->
              <slot
                v-if="formField.component === 'slot'"
                :prop="formField.prop"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div
      class="table-operator row-between-center"
      style="margin-top: 0;align-items: center"
    >
      <div class="fl row-start-center">
        <template v-if="permission && Object.keys(permission).length !== 0">
          <a-button
            v-permission="[permission.add]"
            type="primary"
            icon="plus"
            @click="$emit('handleAdd')"
          >新增</a-button>
        </template>
        <template v-else>
          <a-button
            type="primary"
            icon="plus"
            @click="$emit('handleAdd')"
          >新增</a-button>
        </template>
        <slot name="fl" />
      </div>
      <div v-show="formFields.length !== 0" class="fr">
        <slot name="fr" />
        <a-button
          type="primary"
          icon="search"
          @click="$emit('searchQuery')"
        >查询</a-button>
        <a-button
          type="primary"
          icon="reload"
          @click="$emit('searchReset')"
        >重置</a-button>
        <a
          v-show="formFields.length > maxFieldsShowLength"
          style="margin-left: 8px"
          @click="toggleStatus = !toggleStatus"
        >
          {{ toggleStatus ? "收起" : "展开" }}
          <a-icon :type="toggleStatus ? 'up' : 'down'" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import permission from '@/directive/permission'
import mixins from '_com/c-form/mixins'
export default {
  name: 'CSearch',
  directives: { permission },
  mixins: [mixins],
  props: {
    // 4元素一行，两行自动折叠，不考虑自适应
    maxFieldsShowLength: {
      type: Number,
      default: 8
    },
    permission: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      toggleStatus: false
    }
  },
  methods: {}
}
</script>
