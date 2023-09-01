<template>
  <div class="xr-find">
    <div
      class="x-form"
      :class="{ 'has-error': ['MAX'].includes(findBar.findStates) }"
    >
      <x-input
        id="findInput"
        :value="findBar.inputValue"
        clearable
        :disabled="findBar.findStates === 'pending'"
        placeholder="请输入关键词"
        @clear="clear"
      >
        <i
          v-show="findBar.findStates === 'pending'"
          slot="suffix"
          class="iconfont icon-jiazai1 x-icon-spin"
        />
        <i
          v-show="
            ['', 'MAX', null, 'notQuery', 'notFound'].includes(
              findBar.findStates,
            )
          "
          id="findInputSearch"
          slot="suffix"
          class="iconfont icon-search1"
        />
      </x-input>
      <div v-if="findBar.findStates === 'MAX'" class="x-form-explain">
        <span>检索词不能超过{{ findBar.findMax }}个字！</span>
      </div>
      <div v-if="findBar.findStates === 'notQuery'" class="x-form-explain">
        <span>请输入检索词！</span>
      </div>
    </div>
    <div class="xr-find__tools">
      <div class="xr-find__tools-prefix">
        共 <span>{{ findBar.queryMatches.length }}</span> 条结果
      </div>
      <div class="xr-find__tools-suffix">
        <a-checkbox
          id="findMatchCurPage"
        >
          仅在当前页
        </a-checkbox>
        <a-checkbox
          id="findMatchCase"
        >
          区分大小写
        </a-checkbox>
      </div>
    </div>
    <template v-if="findBar.queryMatches.length === 0">
      <empty
        v-if="findBar.findStates === 'notFound'"
        description="未检索到相关内容!"
      />
      <empty
        v-else-if="findBar.findStates === 'pending'"
        description="检索中，请耐心等待"
      />
      <empty v-else description="请输入搜索关键词!" />
    </template>

    <div class="xr-find__list">
      <div
        v-for="(item, idx) of findBar.queryMatches"
        :key="idx"
        v-highlight
        class="xr-find__item"
      >
        <div class="xr-find__item--target" :data-id="item.id" />
        <div v-html="item.title" />
        <div v-if="item.pageIndex">第{{ item.pageIndex }}页</div>
      </div>
    </div>

  </div>
</template>
<script>
import xInput from './input.vue'
import empty from './empty.vue'
export default {
  components: {
    xInput,
    empty
  },
  directives: {
    highlight: {
      bind(el) {
        el.addEventListener('click', () => {
          const siblings = el.parentNode.children
          for (let i = 0; i < siblings.length; i++) {
            siblings[i].classList.remove('active')
          }
          el.classList.add('active')
        })
      }
    }
  },
  props: {
    findBar: {
      type: Object
    }
  },
  data() {
    return {
      check: false
    }
  },
  methods: {
    clear() {
      document.getElementById('findInput').value = ''
      this.findBar.inputValue = null
      this.findBar.updateUIState(0)
      this.findBar.reset()
    }
  }
}
</script>
<style lang="less">
.xr-find{
  font-size: 14px;
  &__tools{
    display: flex;
    margin: 16px 0 ;
    .row-between-center;
    &-prefix{
      color: #6f7582;
      span{
        color: #F26D00;
      }
    }
    &-suffix{
      .row-start-center;
      color: #6f7582;
    }
    &-suffix > div:nth-child(1){
      margin-right: 24px;
    }
  }
  &__list{
    max-height: 500px;
    overflow-y: auto;
    .xr-find__item{
      display: flex;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 8px;
      background: #ffffff;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid transparent;
      position: relative;
      z-index: 2;
      .xr-find__item--target{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1;
      }
      .query-highlight{
        color: #F26D00;
      }
      div:last-child{
        color: #999da6;
      }
    }
    .active{
      border: 1px solid #1a5eff;
    }

  }
  .icon-search1{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    //outline: 1px solid red;
    font-size: 25px;
    color: #999da6;
  }
}
.x-icon-spin{
  display: inline-block;
  animation: loadingCircle 1s linear infinite;
}
@keyframes loadingCircle {
  to {
    transform: rotate(1turn)
  }
}
.find-highlight{
  margin: -1px;
  padding: 1px;
  background-color: red;
  //color: #F26D00;
  border-radius: 4px;
}
.find-select{
  margin: -1px;
  padding: 1px;
  background-color: #F26D00!important;
  //color: #FFFFFF;
  border-radius: 4px;
}

</style>
