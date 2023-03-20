<template>
  <div class="c-basic-form">
    <div
      :class="layout.layout==='inline'?'form-inline-container':'from-container'"
    >
      <a-form-model
        ref="ruleForm"
        :model="dataForm"
        :rules="rules"
        :layout="layout.layout"
        @keyup.enter.native="$emit('submit')"
      >
        <a-row :gutter="24">
          <a-col
            v-for="formField in formFields.filter(e=>e.show!==false)"
            :key="formField.prop"

            v-bind="layout.layout==='inline' && layout.inlineCol"
          >
            <a-form-model-item
              :key="formField.prop"
              :label="formField.label"
              :prop="formField.prop"
              v-bind="{
                ...layout,
                [formField.labelCol && 'labelCol']:{
                  ...formField.labelCol
                },
                [formField.labelCol && 'wrapperCol']:{
                  ...formField.wrapperCol
                }
              }"
            >
              <!-- 输入框 -->
              <a-input
                v-if="formField.component==='input'"
                v-model="dataForm[formField.prop]"
                :placeholder="formField.placeholder || `请输入${formField.label}`"
                v-bind="formField"
                allow-clear
                onkeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"
              />
              <!-- 密码输入框 -->
              <a-input-password
                v-if="formField.component==='password'"
                v-model="dataForm[formField.prop]"
                :placeholder="formField.placeholder || `请输入${formField.label}`"
                type="password"
                autocomplete="on"
                v-bind="formField"
              />
              <!-- 数字输入框 -->
              <a-input-number
                v-if="formField.component==='input-number'"
                v-model="dataForm[formField.prop]"
                :placeholder="formField.placeholder || `请输入${formField.label}`"
                v-bind="formField"
              />
              <!-- textarea -->
              <a-textarea
                v-if="formField.component==='textarea'"
                v-model="dataForm[formField.prop]"
                :placeholder="formField.placeholder || `请输入${formField.label}`"
                v-bind="formField"
              />
              <!-- 下拉 -->
              <a-select
                v-if="formField.component==='select'"
                v-model="dataForm[formField.prop]"
                :placeholder="`请选择${formField.label}`"
                v-bind="formField.options"
                v-on="formField.event"
              >
                <a-select-option
                  v-for="(item, index) in formField.dataSource"
                  :key="index"
                  :value="item[formField.options && formField.options.value || 'code']"
                >
                  {{ item[formField.options && formField.options.label || 'name'] }}
                </a-select-option>
              </a-select>
              <!-- 多级选择 字符串-->
              <MultipleSelect
                v-if="formField.component==='multipleSelect'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
              />
              <CSwitch
                v-if="formField.component==='switch'"
                v-model="dataForm[formField.prop]"
                v-bind="formField"
              />
              <!--   单选     -->
              <a-radio-group
                v-if="formField.component==='radio-group'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.options"
                v-on="formField.event"
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
                v-bind="formField"
              />
              <DateRange
                v-if="formField.component==='dateRange'"
                v-model="dataForm[formField.prop]"
                v-bind="formField"
              />
              <Upload
                v-if="formField.component==='upload'"
                v-model="dataForm[formField.prop]"
                :prop="formField.prop"
                :options="formField.options"
                @clearValidate="clearValidate"
              />
              <RichText
                v-if="formField.component==='RichText'"
                v-model="dataForm[formField.prop]"
                v-bind="formField.options"
                :prop="formField.prop"
                @clearValidate="clearValidate"
              />
              <!--   区域级联选择     -->
              <Cascade
                v-if="formField.component==='cascade'"
                v-model="dataForm[formField.prop]"
                :form-field="formField"
                @clearValidate="clearValidate"
              />
              <!--   树形选择器     -->
              <CTreeSelect
                v-if="formField.component==='treeSelect'"
                v-model="dataForm[formField.prop]"
                :data-form="dataForm"
                v-bind="formField"
              />
              <!--   兹定于i     -->
              <slot
                v-if="formField.component==='slot'"
                :name="formField.prop"
                :prop="formField.prop"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :xxl="24"
          >
            <a-form-model-item
              style="margin-bottom: 0"
            >
              <slot name="submit" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </div>
</template>
<script>
import mixins from '_com/Form/mixins'
export default {
  name: 'Form',
  mixins: [mixins],
  data() {
    return {
    }
  },
  methods: {
    validate(status = false) {
      this.$refs.ruleForm.validate(vaild => (status = vaild))
      return status
    },
    clearValidate(props) {
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate(props || '')
      })
    }
  }
}
</script>
<style lang="less">
.c-basic-form{
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
  .ant-form-item{
    margin-bottom: 20px;
  }
}
</style>
