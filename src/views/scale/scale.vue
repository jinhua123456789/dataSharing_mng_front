<template>
  <div
    v-loading="listLoading">
<!--    <span>{{list}}</span>-->
    <h2 align="center">量表名称：{{list.name}}</h2>
<!--    <h3 >机构Id：{{list.organizationId}}</h3>-->
    <h3 >量表类型：{{list.type}}</h3>
    <h3 >量表状态：{{list.state | stateFilter}}</h3>
    <h3 >量表介绍：{{list.info}}</h3>
    <h3 >量表指导语：{{list.instruction}}</h3>
    <h3 >量表创建时间：{{list.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</h3>
    <h3 >量表修改时间：{{list.modifyTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</h3>
    <h3 >
      <span v-if="list.suitableAgeStart !== null">适用年龄：{{list.suitableAgeStart}}岁至</span>
      <span v-if="list.suitableAgeEnd !== null">{{list.suitableAgeEnd}}岁</span><br>
      <span v-if="list.suitableGender !== null">适用性别：{{list.suitableGender}}</span>
    </h3>
<!--    <h3 >创建者id：{{list.creatorId}}</h3>-->
<!--    <h3 >创建者：{{list.creator}}</h3>-->
    <h3 >答题时间限制：{{list.timeLimit}}</h3>
    <p>------------------------------------------------------------</p>

    <div v-if="list.ownerFlag === 1 || verify === 1">
      <h2 >题目</h2>
      <h3>选择题</h3>
      <div v-for="item in list.scaleFactorInfoDTOArrayList">
        <div v-if="item.name === '默认因子'">
          <div v-for="stem in item.scaleEvaluationItemStemDTOArrayList">
            <h4 v-if="stem.type === 1">
              {{stem.number}}.{{stem.stem}}<br>
              <h4 v-for="choice in stem.scaleChoiceOptionDTOArrayList">
                  {{choice.number | choiceFilter}}.{{choice.content}}：分数 {{choice.score}}
              </h4>
            </h4>
          </div>
        </div>
      </div>
    </div>
<!--    <div v-if="list.ownerFlag === 0 && verify === 0">-->
<!--      <h3>选择题</h3>-->
<!--      <div v-for="item in list.scaleFactorInfoDTOArrayList">-->
<!--        <div v-if="item.name === '默认因子'">-->
<!--          <div v-for="stem in item.scaleEvaluationItemStemDTOArrayList">-->
<!--            <h4 v-if="stem.type === 1">-->
<!--              {{stem.number}}.{{stem.stem}}<br>-->
<!--              <h4 v-for="choice in stem.scaleChoiceOptionDTOArrayList">-->
<!--                {{choice.number | choiceFilter}}.{{choice.content}}-->
<!--              </h4>-->
<!--            </h4>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <h3>填空题</h3>-->
<!--    <div v-for="item in list.scaleFactorInfoDTOArrayList">-->
<!--      <div v-if="item.defaultFlag === 1">-->
<!--        <div v-for="stem in item.scaleEvaluationItemStemDTOArrayList">-->
<!--          <h4 v-if="stem.type === 2">-->
<!--            {{stem.number}}.{{stem.stem}}<br>-->
<!--            <h4 v-for="choice in stem.scaleChoiceOptionDTOArrayList">-->
<!--              {{choice.number | choiceFilter}}.{{choice.content}}：分数 {{choice.score}}-->
<!--            </h4>-->
<!--          </h4>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <h3>简答题</h3>-->
<!--    <div v-for="item in list.scaleFactorInfoDTOArrayList">-->
<!--      <div v-if="item.defaultFlag === 1">-->
<!--        <div v-for="stem in item.scaleEvaluationItemStemDTOArrayList">-->
<!--          <h4 v-if="stem.type === 3">-->
<!--            {{stem.number}}.{{stem.stem}}<br>-->
<!--            <h4 v-for="choice in stem.scaleChoiceOptionDTOArrayList">-->
<!--              {{choice.number | choiceFilter}}.{{choice.content}}：分数 {{choice.score}}-->
<!--            </h4>-->
<!--          </h4>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div v-if="list.ownerFlag === 1 || verify === 1">
      <p>------------------------------------------------------------</p>
      <h2>因子</h2>
      <div v-for="item in list.scaleFactorInfoDTOArrayList">

      <div v-if="item.scoreDescriptionFlag === 1">
        <p>-----------------------</p>
<!--        因子名称-->
        <h3>因子名称:
          <span v-if="item.defaultFlag === 1">总分因子</span>
          <span v-else>{{item.name}}</span></h3>
        <h3 >因子信息：{{item.info}}</h3>
        <h3 >团队预警百分比：{{item.groupWarningThreshold}}</h3>
        <h3 >对应的题号和选项</h3>
        <span v-for="stem in item.scaleEvaluationItemStemDTOArrayList">
          {{stem.number}} {{stem.option | choiceFilter}}
        </span>

<!--        参考因子-->
        <h3 v-if="item.referenceFactorFlag === 1">参考因子以及权重</h3>
        <div v-for="ref in item.scaleReferenceFactorDTOArrayList">
          <div v-for="item1 in list.scaleFactorInfoDTOArrayList">
            <div v-if="ref.referenceFactor === item1.id">
              参考因子名称：{{item1.name}}     参考权重：{{ref.weight}}
            </div>
          </div>
        </div>

<!--        分数转换-->
        <h3 v-if="item.scoreTransferFlag === 1">分数转换表</h3>
        <div v-for="transfer in item.scaleScoreTransferDTOArrayList">
          原始分：{{transfer.originScore}}  --->   标准分：{{transfer.standardScore}}
        </div>

<!--        得分解释-->
        <h3 >得分解释</h3>
        <div v-for="description in item.scaleFactorScoreDescriptionDTOArrayList">
          <span>得分区间：{{description.startScore}}  —— {{description.endScore}}</span><br>
          <span>得分解释：{{description.description}}</span><br>
          <span v-if="description.personalWarningFlag === 1">开启个人预警</span><br>
        </div>

      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchList, fetchListByScaleId, fetchPv, createArticle, updateArticle } from '@/api/scale'


  //  scaleStateOptions
  const scaleStateOptions = [
    { key: '3', display_name: '公有量表' },
    { key: '2', display_name: '私有量表' },
    { key: '1', display_name: '已提交' },
    { key: '0', display_name: '编辑中' },
    { key: '-1', display_name: '废除' }
  ]
  // choiceOptions
  const choiceOptions = [
    { key: '1', display_name: 'A' },
    { key: '2', display_name: 'B' },
    { key: '3', display_name: 'C' },
    { key: '4', display_name: 'D' },
    { key: '5', display_name: 'E' },
    { key: '6', display_name: 'F' },
    { key: '7', display_name: 'G' },
    { key: '8', display_name: 'H' },
    { key: '9', display_name: 'I' },
    { key: '10', display_name: 'J' },
    { key: '11', display_name: 'K' },
    { key: '12', display_name: 'L' },
    { key: '13', display_name: 'M' },
  ]
  const scaleStateKeyValue = scaleStateOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  const choiceKeyValue = choiceOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})
  export default {
    props: ['scaleId','verify'],
    filters: {
      stateFilter(state) {
        return scaleStateKeyValue[state]
      },
      choiceFilter(number) {
        return choiceKeyValue[number]
      }
    },
    data() {
      return {
        list: null,
        listLoading: true
      }
    },
    watch: {
      scaleId() {
          this.getList()
      }},
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchListByScaleId(this.scaleId).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
