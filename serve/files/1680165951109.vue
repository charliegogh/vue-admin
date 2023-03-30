<template>
  <div class="th-lib-container">
    <BackTop />
    <van-sticky :offset-top="$store.state.app.env==='HW'?0:40">
      <div
        v-if="tabActive"
        class="tab-wrapper row-between-center"
      >
        <van-tabs
          v-model="tabActive"
          :before-change="handleTabClick"
          color="#3c80f2"
          class="flex1"
          :ellipsis="false"
          title-active-color="#3c80f2"
        >
          <van-tab
            v-for="(item,index) in _tabList"
            :key="index"
            :title="item.name"
            :name="item.name"
          >
            <template #title>
              <div class="row-start-center tab-title">
                <span>
                  {{ item.name }}
                </span>
                <div v-if="item.num!==0" class="num" style="margin-top: -2px">
                  <van-badge :content="item.num" color="#ff7d1e" />
                </div>
              </div>

            </template>
          </van-tab>
        </van-tabs>
        <div
          class="filter row-all-center"
          style="white-space: nowrap"
          @click="$refs.FilterModal.show()"
        >
          <img src="~@/assets/img/gov/filter.png" alt="">
          筛选
        </div>
      </div>
      <div
        v-else
        class="clue-search-wrapper row-between-center"
      >
        <div class="row-start-center flex1">
          <input
            v-model="queryParam.projectName"
            type="text"
            placeholder="请输入项目名称"
            @keyup.enter="()=>{
              handlerFilter()
            }"
          >
          <img
            src="~@/assets/img/gov/clue/search.png"
            alt=""
          >
        </div>
        <div
          class="filter row-all-center"
          @click="$refs.FilterModal.show()"
        >
          <img src="~@/assets/img/gov/filter.png" alt="">
          筛选
        </div>
      </div>
    </van-sticky>
    <div class="list-operator row-between-center w706">
      <div class="fl row-start-center">
        <div
          v-if="tabActive &&tabList[tabActive].tableAction.includes('新增')"
          class="add row-all-center"
          @click="handleAdd"
        >
          <img src="~@/assets/img/gov/add.png" alt="">
          新增
        </div>
      </div>
      <div class="fr">
        共{{ ipagination.total }}项
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="loadData"
    >
      <ul v-show="dataSource.length!==0" class="list w706">
        <li
          v-for="(item,index) of dataSource"
          :key="index"
        >
          <div class="row-between-center head">
            <div class="fl row-start-center">
              <p class="ellipsis" style="max-width: 55vw">{{ item.projectName }}</p>
              <!--      改        -->
              <template
                v-if="item.alter==='改'"
              >
                <span
                  class="pro-tag"
                >【改】</span>
              </template>
              <!--      退        -->
              <template
                v-if="item.back==='退'"
              >
                <span
                  class="pro-tag"
                >【退】</span>
                <i
                  style=" color: #3c80f2;"
                  class="iconfont icon-xinxi"
                  @click.stop="handleShowBackReason(item.backReason)"
                />
              </template>
            </div>
            <div class="fr row-start-center test">
              <div
                id="gov-item-action"
                class="action"
                @click="handleAction(item)"
              >
                <img src="~@/assets/img/gov/action.png" alt="" class="action-img">
                <div
                  v-show="item.actionShow"
                  class="gov-action-wrapper"
                >
                  <div
                    v-if="tabActive!=='项目信息变更'"
                    class="row-start-center"
                    @click="handleDetail(item)"
                  >
                    <img src="~@/assets/img/gov/action-view.png" alt="">
                    查看
                  </div>
                  <template v-if="item.district===$store.getters.userInfo.ssqxName">
                    <template v-if="tabActive==='基础信息库'">
                      <!--     未提交、审核未通过可删除       -->
                      <template v-if="['1','3'].includes(item[classParams].status)">
                        <div
                          class="row-start-center"
                          @click="handleDelete(item)"
                        >
                          <img src="~@/assets/img/gov/action-delete.png" alt="">
                          删除
                        </div>
                      </template>
                      <!-- 提交状态下可以撤回 -->
                      <template v-if="['2'].includes(item[classParams].status)">
                        <div
                          class="row-start-center"
                          @click="handleRecall(item)"
                        >
                          <img src="~@/assets/img/gov/action-delete.png" alt="">
                          撤回
                        </div>
                      </template>
                    </template>
                    <template v-if="tabActive==='入库项目'">
                      <!--   入库项目 申转签约和退库   成功失败都能重新提交      -->
                      <template v-if="['4','6','8','12','13'].includes(item[classParams].status)">
                        <template v-if="classParams==='dzbJjProjectClues'">
                          <div
                            v-permission="['sanku_clues:turnSign']"
                            class="row-start-center"
                            @click="()=>{
                              item.dzbJjProjectSign={
                                ...item[item.dzbJjProjectSign?'dzbJjProjectSign':classParams],
                                status: item[classParams].status,
                                intoStorage:item.dzbJjProjectSign?item.dzbJjProjectSign.intoStorage:null,
                                id:item.dzbJjProjectSign?item.dzbJjProjectSign.id:null,
                                dzbJjProjectInfoList: item.dzbJjProjectSign ? item.dzbJjProjectSign.dzbJjProjectInfoList : []
                              }
                              $refs.SignModal.edit(item,'clues','转入签约库')
                            }"
                          >
                            <img src="~@/assets/img/gov/action-push.png" alt="">
                            转入签约库
                          </div>
                        </template>
                        <template v-if="classParams==='dzbJjProjectSign'">
                          <div
                            v-permission="['sanku_sign:turnFall']"
                            class="row-start-center"
                            @click="()=>{
                              item.dzbJjProjectFall={
                                ...item[item.dzbJjProjectFall?'dzbJjProjectFall':classParams],
                                status: item[classParams].status,
                                intoStorage:item.dzbJjProjectFall?item.dzbJjProjectFall.intoStorage:null,
                                id:item.dzbJjProjectFall?item.dzbJjProjectFall.id:null,
                                dzbJjProjectInfoList: item.dzbJjProjectFall ? item.dzbJjProjectFall.dzbJjProjectInfoList : []
                              }
                              $refs.FallModal.edit(item,'sign','转入落地库')
                            }"
                          >
                            <img src="~@/assets/img/gov/action-push.png" alt="">
                            转入落地库
                          </div>
                        </template>
                        <div
                          v-permission="[permission[classParams].returnStorage]"
                          class="row-start-center"
                          @click="()=>{
                            $refs.ReturnStorageModal.edit(item)
                          }"
                        >
                          <img src="~@/assets/img/gov/action-edit.png" alt="">
                          退库
                        </div>
                      </template>
                    </template>
                  </template>
                  <template v-if="tabActive==='项目信息变更'">
                    <div
                      class="row-start-center"
                      @click="()=>{
                        $refs.AuditViewChange.show(item)
                      }"
                    >
                      <img src="~@/assets/img/gov/action-view.png" alt="">
                      查看变更信息
                    </div>
                  </template>
                  <template
                    v-if="
                      classParams==='dzbJjProjectFall'
                        &&
                        $store.getters.isCityManage
                        &&
                        ['4','12','13'].includes(item[classParams].status)
                    "
                  >
                    <div
                      class="row-start-center"
                      @click="$refs.BackUpModal.show(item)"
                    >
                      <img src="~@/assets/img/gov/action-delete.png" alt="">
                      退回上一级
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div
            class="clue-info"
            @click="handleDetail(item)"
          >
            <div v-show="item.investorName">
              <span class="label">投资方：</span>
              <p class="ellipsis" style="width: 250px">{{ item.investorName }}</p>
            </div>
            <div v-show="item.industryClassify">
              <span class="label">产业分类：</span>
              <span>{{ item.industryClassify }}</span>
            </div>
            <div v-show="item.investmentScale">
              <span class="label">{{ item.classParams==='dzbJjProjectClues'?'拟':'' }}投资规模（亿元）：</span>
              <p class="ellipsis">{{ item.investmentScale }}</p>
            </div>
            <div v-show="item.fixedInvestment">
              <span class="label">{{ item.classParams==='dzbJjProjectClues'?'拟':'' }}固定投资（亿元）：</span>
              <p class="ellipsis">{{ item.fixedInvestment }}</p>
            </div>
            <div v-if="tabActive!=='退库项目' && !['search','audit'].includes(classParams)">
              <span class="label">状态：</span>
              <p class="ellipsis">{{ item[item.classParams].status | formatDict(dict.status[item.classParams],'code','name') }}</p>
              <i
                v-if="['3','8','6','13'].includes(item[item.classParams].status)"
                class="iconfont icon-xinxi"
                @click.stop="handleShowBackReason(item[item.classParams].returnReason)"
              />
            </div>
            <!--  退库项目  -->
            <template v-if="tabActive==='退库项目'">
              <div v-show="item[item.classParams].returnStorageType">
                <span class="label">退库类型：</span>
                <p class="ellipsis">{{ item[item.classParams].returnStorageType | formatDict(dict.returnStorageType[item.classParams],'code','name') }}</p>
              </div>
              <div v-show="item.returnTime">
                <span class="label">退库时间：</span>
                <p class="ellipsis">{{ item.returnTime }}</p>
              </div>
              <div v-show="item[item.classParams].returnStorage">
                <span class="label">退库原因：</span>
                <p class="">{{ item[item.classParams].returnStorage }}</p>
              </div>
              <div v-show="classParams==='audit'">
                <span class="label">来源：</span>
                <span>{{ item.storageStatus | formatDict(dict.xmkzt,'code','name') }} {{ item.status==='4'?'(入库项目)':item.status==='9'?'(退库项目)':'(入库项目)' }}</span>
              </div>
            </template>

            <!--  入库审核通过时间  -->
            <template v-if="tabActive==='入库项目'">
              <div
                v-if="!['audit','search'].includes(classParams)"
                class="auditTime"
                style="padding-top: 0"
              >
                <template v-if="isCityManage">
                  <div v-show="item[item.auditTime]">
                    <span class="label">入库审核通过时间：</span>
                    <p class="ellipsis">{{ item[item.auditTime] }}</p>
                    <i
                      class="iconfont icon-edit-outline"
                      @click.stop="handleAuditTime(item)"
                    />
                  </div>
                </template>
                <template v-else>
                  <template v-if="classParams==='dzbJjProjectClues'">
                    <div>
                      <span class="label">线索生成时间：</span>
                      <p class="ellipsis">{{ item.clueTime }}</p>
                    </div>
                  </template>
                  <template v-if="classParams==='dzbJjProjectSign'">
                    <div v-if="item.signTime">
                      <span class="label">签约时间：</span>
                      <p class="ellipsis">{{ item.signTime }}</p>
                    </div>
                  </template>
                  <template v-if="classParams==='dzbJjProjectFall'">
                    <div v-if="item.workTime">
                      <span class="label">开工时间：</span>
                      <p class="ellipsis">{{ item.workTime }}</p>
                    </div>
                  </template>
                </template>
              </div>
            </template>
            <!--  项目信息查询  -->
            <template
              v-if="['search'].includes(classParams)"
            >
              <div>
                <span class="label">来源：</span>
                <span>{{ item.storageStatus | formatDict(dict.xmkzt,'code','name') }} {{ item.status==='4'?'(入库项目)':item.status==='9'?'(退库项目)':'(入库项目)' }}</span>
              </div>
              <div class="">
                <span class="label">审核通过时间：</span>
                <template v-if="item.status==='4'">
                  <div class="col-start-start" style="padding-top: 0">
                    <p v-show="item.clueAuditTime">线索项目库：{{ item.clueAuditTime }}</p>
                    <p v-show="item.signAuditTime">签约项目库：{{ item.signAuditTime }}</p>
                    <p v-show="item.fallAuditTime">落地项目库：{{ item.fallAuditTime }}</p>
                  </div>
                </template>
                <template v-if="item.status==='9'">
                  <p v-show="item.returnTime">{{ item.returnTime }}</p>
                </template>
              </div>
              <div v-show="item[item.classParams].returnStorageType">
                <span class="label">退库类型：</span>
                <p class="ellipsis">{{ item[item.classParams].returnStorageType | formatDict(dict.returnStorageType[item.classParams],'code','name') }}</p>
              </div>
            </template>

            <div v-if="['audit'].includes(classParams)">
              <span class="label">状态：</span>
              <p class="ellipsis">{{ item.auditStatus | formatDict(dict.auditStatus,'code','name') }}</p>
              <i
                v-if="['3','8','6','13'].includes(item[item.classParams].status)"
                class="iconfont icon-xinxi"
                @click.stop="handleShowBackReason(item[item.classParams].returnReason)"
              />
            </div>
          </div>
        </li>
      </ul>
    </van-list>
    <component
      :is="modalForm"
      ref="modalForm"
      :dict="dict"
      @ok="modalOk"
      @replaceProject="replaceProject"
    />
    <!-- 退库 -->
    <ReturnStorageModal
      ref="ReturnStorageModal"
      :dict="dict"
      :class-params="classParams"
      :api="handleApiAction.return"
      @ok="modalOk"
      @replaceProject="replaceProject"
      @loadNum="loadNum"
    />
    <!-- 修改审核通过时间 -->
    <AuditTimeModal
      ref="AuditTimeModal"
      @replaceProject="replaceProject"
    />
    <SignModal
      ref="SignModal"
      :dict="dict"
      :tab-active="tabActive"
      @ok="modalOk"
      @loadNum="loadNum"
      @replaceProject="replaceProject"
    />
    <FallModal
      ref="FallModal"
      :tab-active="tabActive"
      :dict="dict"
      @ok="modalOk"
      @loadNum="loadNum"
      @replaceProject="replaceProject"
    />
    <CluesModal
      ref="CluesModal"
      :tab-active="tabActive"
      :dict="dict"
      @ok="modalOk"
      @loadNum="loadNum"
      @replaceProject="replaceProject"
    />
    <FilterModal
      ref="FilterModal"
      :dict="dict"
      :class-params="classParams"
      @reset="reset"
      @handlerFilter="handlerFilter"
    />
    <!-- 审核：项目信息变更 -->
    <AuditViewChange
      ref="AuditViewChange"
      :tab-active="tabActive"
      @ok="modalOk"
      @loadNum="loadNum"
      @replaceProject="replaceProject"
    />
    <!-- 退回上一级，市级管理员独有 -->
    <BackUpModal
      ref="BackUpModal"
      @ok="modalOk"
    />
  </div>
</template>
<script>

import { ListMixin } from './mixins/app'
import BackTop from '../../components/BackTop'
export default {
  components: { BackTop },
  mixins: [ListMixin],
  data() {
    return {
      classParams: 'dzbJjProjectClues'
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less">
@import "th-lib";
</style>
