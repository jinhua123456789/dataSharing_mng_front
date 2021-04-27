<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 200px;"
                class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-input v-model="listQuery.personInCharge" placeholder="项目负责人" style="width: 200px;"
                class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData"
              border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column align="center" label="项目名称" min-width="80px">
        <template slot-scope="{row}">
          <el-button type="text" @click="dialogProjectVisible= true">{{row.projectName }}</el-button>

          <el-dialog title="单位详情" :visible.sync="dialogProjectVisible">
            <el-form ref="dataForm" :rules="rules" :model="row" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
              <el-form-item label="项目编号" prop="projectNo">
                <el-input v-model="row.projectNo" />
              </el-form-item>
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="row.projectName" />
              </el-form-item>
              <el-form-item label="项目负责人" prop="personInCharge">
                <el-input v-model="row.personInCharge" />
              </el-form-item>
              <el-form-item label="详细描述" prop="projectDescription">
                <el-input v-model="row.projectDescription" />
              </el-form-item>
            </el-form>
          </el-dialog>
        </template>
      </el-table-column>

      <el-table-column align="center" label="项目负责人" min-width="40px">
        <template slot-scope="{row}">
          <span>{{row.personInCharge }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="批复年度" min-width="40px">
        <template slot-scope="{row}">
          <span>{{row.replyYear }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="已拨付预算/总预算（万元）" min-width="40px">
        <template slot-scope="{row}">
          <span>{{row.issuedBudget }}/{{row.totalBudget}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" icon="el-icon-tickets" @click="dialogBudgetApplyVisible= true">申请预算</el-button>
          <el-dialog title="申请预算" :visible.sync="dialogBudgetApplyVisible">
                <template>
                  <el-table :data="tableData" border style="width: 100%">
                    <el-table-column
                      fixed
                      prop="projectStage"
                      align="center"
                      label="项目阶段"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="personInCharge"
                      label="项目负责人"
                      align="center"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="appliedBudget"
                      label="申请预算（万元）"
                      align="center"
                      width="100">
                    </el-table-column>
                    <el-table-column
                      prop="applicationDate"
                      label="申请时间"
                      align="center"
                      width="120">
                    </el-table-column>
                    <el-table-column
                      prop="right"
                      label="申请资料上传"
                      align="center"
                      width="160">
                      <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
                                 :on-preview="handlePreview" :on-remove="handleRemove" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" icon="el-icon-upload" type="success" @click="submitUpload"></el-button>
                      </el-upload>
                    </el-table-column>
                    <el-table-column fixed="right":label="$t('table.actions')" align="center" width="120" class-name="small-padding fixed-width">
                      <template slot-scope="{row}">
                        <el-button v-if="row.status==='待申请'" size="mini" type="primary">申请</el-button>
                        <el-button v-else-if="row.status==='未申请'" size="mini" disabled>未申请</el-button>
                        <el-button v-else size="mini" type="danger" disabled>已拨付</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination'

  export default {
    name: "investigatorBudgetApply",
    components:{Pagination},
    directives:{waves},
    data(){
      return{
        tableKey:0,
        advice:{
          target:'物探',//意见标题
          supervisorName:'马国强',//监理负责人
          content:'物探指标不合格',//意见内容
          time:'2019-10-01',//意见修改时间
          replyName:'王涛',//回复人
          replyContent:'正在修改中，请耐心等待，最晚后天即可完工',//回复内容
          replyTime:'2019-10-02'//回复修改时间
        },
        form: [
          {
            target:'物探',//意见标题
            supervisorName:'马国强',//监理负责人
            content:'物探指标不合格',//意见内容
            time:'2019-10-01',//意见修改时间
            replyName:'王涛',//回复人
            replyContent:'正在修改中，请耐心等待，最晚后天即可完工',//回复内容

            replyTime:'2019-10-02'//回复修改时间
          },
          {
            target:'化探',//意见标题
            supervisorName:'马国强',//监理负责人
            content:'物探指标不合格',//意见内容
            time:'2019-10-01',//意见修改时间
            replyName:'王涛',//回复人
            replyContent:'正在修改中，请耐心等待，最晚后天即可完工',//回复内容

            replyTime:'2019-10-02'//回复修改时间
          },
          {
            target:'钻探',//意见标题
            supervisorName:'马国强',//监理负责人
            content:'物探指标不合格',//意见内容
            time:'2019-10-01',//意见修改时间
            replyName:'王涛',//回复人
            replyContent:'正在修改中，请耐心等待，最晚后天即可完工',//回复内容

            replyTime:'2019-10-02'//回复修改时间
          }
        ],
        fakeData: [
          {
            projectName:"3113勘探项目",//项目名称
            projectNo:"KD2378",//项目编号
            personInCharge:"李求剑",//项目负责人
            projectDescription:"3113勘探区块位于马达加斯加图利亚省南部，区块面积约8,320平方公里。\n" +
              "\n" +
              "3113区块由延长石油集团，延长石油国际和易高能源三方联合投资勘探，目前已完成的勘探有：非地震物探3537平方公里；二维地震勘探470公里；钻探井4口，总进尺14346米；试油3口，共4层。综合勘探结果反映了油气存在的可能性，但由于近期国际油价波动，和区块地质情况较为复杂，3113联合投资方决定总结之前的勘探资料和研究成果，进行更为详实的地质研究后再做下步打算。",//项目详情
            unitName:"深圳市勘察测绘院",//单位名称
            unitNo:"122",//单位编号
            unitDescription:"深圳市勘察测绘院（集团）有限公司（简称深勘集团）成立于1981年1月，为全国勘察设计百强单位，注册资本金1.8亿元，具有国家甲级测绘；工程勘察综合甲级；地基基础工程专业承包壹级；地质灾害防治施工、勘查、设计、危险性评估甲级；工程勘察劳务类（工程钻探、凿井）；市政公用工程施工总承包壹级；市政设计专业乙级，全过程工程咨询，工程监测与检测等资质。",//单位详情
            replyYear:"2019",//批复时间
            progress:"40%",//项目进度
            supervisorStatus:"通过",//监理意见
            supervisorAdvice:"项目进展良好，可批复所需资金",//监理详情
            issuedBudget:46,//已拨付预算
            appliedBudget:32,//申请预算
            totalBudget:140//总预算
          },
          {
            projectName:"马页岩气钻探工程",//项目名称
            projectNo:"MI8556",//项目编号
            personInCharge:"王旭良",//项目负责人
            projectDescription:"四川凉山州西昌盆地页岩气资源调查评价和区块优选项目系四川省自然资源厅基金项目。2017年我国实施建设长江经济带页岩气勘探开发基地，涵盖整个长江流域。四川省启动了包含西昌盆地在内有可能产气区域进行页岩气资源摸底勘查。",//项目详情
            unitName:"河南油田勘探局",//单位名称
            unitNo:"122",//单位编号
            unitDescription:"中国石油化工集团公司河南石油勘探局(以下简称河南油田),基地位于豫西南的南阳盆地。工矿区主要位于河南南阳、驻马店、周口和新疆巴州、伊犁等地市,下属15个二级单位;2014年10月25日 - 河南油田石油勘探局局长换了孙清德10月9日,市委书记穆为民与新到任的中石化河南石油勘探局局长。",//单位详情
            replyYear:"2019",//批复时间
            progress:"51%",//项目进度
            supervisorStatus:"不通过",//监理意见
            supervisorAdvice:"项目严重未达标，撤回资金请求",//监理详情
            issuedBudget:65,//已拨付预算
            appliedBudget:29,//申请预算
            totalBudget:380//总预算
          },
          {
            projectName:"NOVUS油田项目",//项目名称
            projectNo:"HJ2039",//项目编号
            personInCharge:"张寻舟",//项目负责人
            projectDescription:"Novus在加拿大的萨斯喀彻温省及艾伯塔省从事收购、勘探、发展及生产原油及天然气业务。 Novus的策略为通过水平钻采方式生产高净回值、轻质低硫原油，自2009年开业以来Novus钻入约360个水平油井。 Novus目前拥有16万净英亩土地。2017年8月-10月，整个维京油田产量最高的15口井中，Novus占了3口。\n" +
              "\n" +
              "位于萨斯喀彻温省西南部的Greater Dodsland是Novus最大的核心地区。Novus拥有加拿大具吸引力且有产量的优质油气资产组合，助力公司达成海外拓展及争取长远可持续增长的目标。",//项目详情
            unitName:"延长石油国际有限公司",//单位名称
            unitNo:"342",//单位编号
            unitDescription:"延长石油国际是其最大主要股东—延长石油集团发展海外业务及并购的重要平台，延长石油集团为中国从事勘探及开发石油和天然气的四大国有企业之一。 2017年，延长石油集团位居《财富》世界500强企业第326位。在大股东的支持下，公司积极在政治稳定地区寻求收购计划，锐意成为中型国际能源企业。",//单位详情
            replyYear:"2019",//批复时间
            progress:"60%",//项目进度
            supervisorStatus:"待定",//监理意见
            supervisorAdvice:"项目指标不清，需进一步考查",//监理详情
            issuedBudget:50,//已拨付预算
            appliedBudget:20,//申请预算
            totalBudget:100//总预算
          }
        ],
        tableData: [{
          applicationDate: '2019-05-03',
          personInCharge: '王小虎',
          projectStage: '阶段一',
          appliedBudget: '60',
          status:"已申请"
        }, {
          applicationDate: '2019-05-08',
          personInCharge: '王小虎',
          projectStage: '阶段二',
          appliedBudget:'50',
          status:"待申请"
        }, {
          applicationDate: '2019-06-04',
          personInCharge: '王小虎',
          projectStage: '阶段三',
          appliedBudget: '40',
          status:"未申请"
        }],
        listLoading:true,
        listQuery:{
          page: 1,
          limit: 20,
          projectName:undefined,
          personInCharge:undefined,
          supervisorStatus:undefined
        },
        statusOptions: ["通过", "待定", "不通过"],
        temp:{
          projectName:undefined,
          projectNo:undefined,
          unitName:undefined,
          unitNo:undefined,
          unitDescription:undefined,
          personInCharge:undefined,
          projectDescription:undefined,
          replyYear:undefined,
          supervisorStatus:undefined,
          supervisorAdvice:undefined,
          issuedBudget:undefined,
          appliedBudget:undefined,
          totalBudget:undefined,
        },
        dialogFormVisible: false,
        dialogProjectVisible:false,
        dialogBudgetApplyVisible:false,
        supervisorreplyVisible:false,
        rules:undefined
      }
    },
    methods:{
      handleFilter(){

      },
      sortChange(){

      },
      getList(){

      },
      redirectToCS(){
        window.location.href="http://10.103.244.122:8080/dkcj/index.html#";
      },
      redirectToBA(){
        window.location.href="/projectExecution/budgetApply";
      },
      selectedChanged(index){
        this.advice=this.form[index];
      },
      redirectToSA(){
        window.location.href="/projectExecution/supervisorReply";
      }
    }
  }
</script>

<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }

</style>
