import { register_components } from '../components/index'
export default {
  components: {
    ...register_components
  },
  props: {
    dataForm: {
      type: Object,
      default: () => {
      }
    },
    rules: {
      type: Object,
      default: () => {
      }
    },
    formFields: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Object,
      default: () => {
        return {
          layout: 'horizontal',
          labelCol: {
            xs: 4,
            sm: 4,
            md: 4,
            lg: 4,
            xl: 4,
            xxl: 4
          },
          wrapperCol: {
            xs: 20,
            sm: 20,
            md: 20,
            lg: 20,
            xl: 20,
            xxl: 20
          },
          inlineCol: {
            xxl: 6,
            sm: 8
          }
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    dict() {
      return this.$store.getters.dict
    }
  },
  watch: {
    // 动态字典
    'dict': {
      immediate: true,
      deep: true,
      handler(val) {
        console.log(val, 'dict')
        this.formFields.forEach(f => {
          Object.keys(val).forEach(d => {
            if (f.dict === d) f.dataSource = val[f.dict]
          })
        })
      }
    }
  }
}
