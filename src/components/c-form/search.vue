<template>
  <div class="table-operator">
    <div class="form-inline-container">
      <a-form
        layout="inline"
        @keyup.enter.native="$emit('searchQuery')"
      >
        <a-row :gutter="24">
          <a-col
            v-for="formField in formFields"
            :key="formField.prop"
            :xxl="6"
            :sm="12"
          >
            <a-form-model-item
              :key="formField.prop"
              :label="formField.label"
              :prop="formField.prop"
            >
              <!-- 输入框 -->
              <a-input
                v-if="formField.component==='input'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
                onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              />
              <!-- 密码输入框 -->
              <a-input-password
                v-if="formField.component==='password'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                type="password"
                :placeholder="`请输入${formField.label}`"
              />
              <!-- textarea -->
              <a-textarea
                v-if="formField.component==='textarea'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
              />
              <!-- 下拉 -->
              <a-select
                v-if="formField.component==='select'"
                v-model="dataForm[formField.prop]"
                :placeholder="`请选择${formField.label}`"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              >
                <a-select-option
                  v-for="(item, index) in formField.dataSource"
                  :key="index"
                  :value="item[formField.config && formField.config.value || 'code']"
                >
                  {{ item[formField.config && formField.config.label || 'name'] }}
                </a-select-option>
              </a-select>
              <!-- 多级选择 字符串-->
              <MultipleSelect
                v-if="formField.component==='MultipleSelect'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
              />
              <!-- 数字输入框 -->
              <a-input-number
                v-if="formField.component==='input-number'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                :placeholder="`请输入${formField.label}`"
              />
              <a-switch
                v-if="formField.component==='switch'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              />
              <!-- 树状 -->
              <a-tree-select
                v-if="formField.component==='tree-select'"
                v-model="dataForm[formField.prop]"
                :tree-data="formField.dataSource"
                v-bind="formField.config"
                @change="$emit('searchQuery')"
              />
              <!--   单选     -->
              <a-radio-group
                v-if="formField.component==='radio-group'"
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
                  {{ item[formField.radioLabel || 'name'] }}
                </a-radio>
              </a-radio-group>
              <!--   多选     -->
              <CheckboxGroup
                v-if="formField.component==='checkbox-group'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
              />
              <!--   日期选择     -->
              <DatePicker
                v-if="formField.component==='date'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
                @searchQuery="searchQuery"
              />
              <!--   区域级联选择     -->
              <Cascade
                v-if="formField.component==='Cascade'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
                @change="searchQuery"
              />
              <!--   兹定于i     -->
              <slot
                v-if="formField.component==='slot'"
                :prop="formField.prop"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator row-between-center" style="margin-top: 0;align-items: center">
      <div class="fl">
        <a-button type="primary" icon="plus" @click="$emit('handleAdd')">新增</a-button>
      </div>
      <div v-show="formFields.length!==0" class="fr">
        <a-button type="primary" icon="search" @click="$emit('searchQuery')">查询</a-button>
        <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
        <a
          v-show="formFields.length>15"
          style="margin-left: 8px"
          @click="handleToggleSearch"
        >
          {{ toggleSearchStatus ? '收起' : '展开' }}
          <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from '_com/c-form/mixins'
export default {
  name: 'CSearch',
  mixins: [mixins],
  data() {
    return {
      toggleSearchStatus: false
    }
  },
  methods: {
    // 展开
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    searchReset() {
      this.$emit('searchReset')
    },
    searchQuery() {
      this.$emit('searchQuery')
    }
  }
}
</script>
<style lang="less">
.form-inline-container {

  .ant-form-inline {

    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }

}
.table-operator{
  button{
    margin-left: 8px;
  }
}
</style>
