<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="项目名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.explorationUnit"
        placeholder="勘察单位"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="statusSelected"
        placeholder="项目状态"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="year"
        type="year"
        placeholder="批复时间（年）"
        class="filter-item"
        style="width: 200px">
      </el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="selectExportColumn"
      >导出</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"  @selection-change="selectExportRow">
<!--    <el-table v-loading="listLoading" :data="tableList" border fit highlight-current-row style="width: 100%">-->

      <el-table-column type="selection" align="center" width="55">
      </el-table-column>

      <el-table-column fixed width="100px" align="center" label="项目编号">
        <template slot-scope="scope">
          <span>{{ scope.row.project_code }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed width="300px" align="center" label="项目名称">
        <template slot-scope="scope">
          <span class="link-type" @click="ledgerInfo(scope.row)">{{ scope.row.project_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="批复年份">
        <template slot-scope="scope">
          <span>{{ scope.row.project_date }}</span>
        </template>
      </el-table-column>

      <el-table-column width="130px" align="center" label="所在地区">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="250px" align="center" label="勘察单位">
        <template slot-scope="scope">
          <span>{{ scope.row.exploration_unit }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="勘察负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.exploration_principal }}</span>
          <!--          <span>张三</span>-->
        </template>
      </el-table-column>

      <el-table-column  width="250px" align="center" label="监理单位">
        <template slot-scope="scope">
          <span>{{ scope.row.supervisor_unit }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="监理负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.supervisor_principal }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="250px" align="center" label="探矿权人">
        <template slot-scope="scope">
          <span>{{ scope.row.exploration_right_processor }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="90px" align="center" label="探矿权证">
        <template slot-scope="scope">
          <span v-if="scope.row.exploration_right_certificate == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.exploration_right_certificate == '已提交'}">{{ scope.row.exploration_right_certificate }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="开工时间">
        <template slot-scope="scope">
          <span>{{ scope.row.start_date }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="结项时间">
        <template slot-scope="scope">
          <span>{{ scope.row.finish_date }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="项目预算">
        <template slot-scope="scope">
          <span>{{ scope.row.project_budget }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="实际预算拨付">
        <template slot-scope="scope">
          <span>{{ scope.row.actual_budget }}</span>
        </template>
      </el-table-column>

      <el-table-column  class-name="status-col" label="项目状态" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_status }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="80px" align="center" label="是否含矿">
        <template slot-scope="scope">
          <span>{{ scope.row.has_ore }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="300px" align="center" label="找矿成果">
        <template slot-scope="scope">
          <span>{{ scope.row.ore_result }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="170px" align="center" label="立项专家意见（经济）">
        <template slot-scope="scope">
          <span v-if="scope.row.project_approval_opinion_economy == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="170px" align="center" label="立项专家意见（技术）">
        <template slot-scope="scope">
          <span v-if="scope.row.project_approval_opinion_technology == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="勘查任务书">
        <template slot-scope="scope">
          <span v-if="scope.row.exploration_task_book == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="100px" align="center" label="监理任务书">
        <template slot-scope="scope">
          <span v-if="scope.row.supervisor_task_book == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="90px" align="center" label="项目设计">
        <template slot-scope="scope">
          <span v-if="scope.row.project_design == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="190px" align="center" label="项目设计专家意见（经济）">
        <template slot-scope="scope">
          <span v-if="scope.row.project_design_opinion_economy == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="190px" align="center" label="项目设计专家意见（技术）">
        <template slot-scope="scope">
          <span v-if="scope.row.project_design_opinion_technology == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="项目设计批复">
        <template slot-scope="scope">
          <span v-if="scope.row.project_design_reply == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.project_design_reply == '已提交'}">{{ scope.row.project_design_reply }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="项目设计变更">
        <template slot-scope="scope">
          <span v-if="scope.row.project_design_alter == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.project_design_alter == '已提交'}">{{ scope.row.project_design_alter }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="90px" align="center" label="勘察合同">
        <template slot-scope="scope">
          <span v-if="scope.row.exploration_contract == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.exploration_contract == '已提交'}">{{ scope.row.exploration_contract }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="90px" align="center" label="监理合同">
        <template slot-scope="scope">
          <span v-if="scope.row.supervisor_contract == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.supervisor_contract == '已提交'}">{{ scope.row.supervisor_contract }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="140px" align="center" label="合作勘查投资合同">
        <template slot-scope="scope">
          <span v-if="scope.row.exploration_invest_contract == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.exploration_invest_contract == '已提交'}">{{ scope.row.exploration_invest_contract }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="追加投资合同">
        <template slot-scope="scope">
          <span v-if="scope.row.add_invest_contract == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.add_invest_contract == '已提交'}">{{ scope.row.add_invest_contract }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="野外验收申请">
        <template slot-scope="scope">
          <span v-if="scope.row.check_request == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.check_request == '已提交'}">{{ scope.row.check_reuqest }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="野外验收资料">
        <template slot-scope="scope">
          <span v-if="scope.row.check_information == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.check_information == '已提交'}">{{ scope.row.check_information }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="130px" align="center" label="野外验收意见书">
        <template slot-scope="scope">
          <span v-if="scope.row.check_comment == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.check_comment == '已提交'}">{{ scope.row.check_comment }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="项目成果报告">
        <template slot-scope="scope">
          <span v-if="scope.row.project_result_report == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.project_result_report == '已提交'}">{{ scope.row.project_result_report }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="140px" align="center" label="项目报告评审意见">
        <template slot-scope="scope">
          <span v-if="scope.row.project_report_review_comment == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.project_report_review_comment == '已提交'}">{{ scope.row.project_report_review_comment }}</a>-->
        </template>
      </el-table-column>

      <el-table-column  width="110px" align="center" label="项目汇交证明">
        <template slot-scope="scope">
          <span v-if="scope.row.project_submit_proof == '已提交'">
            <a class="link-type">已提交</a>
          </span>
          <span v-else>
            未提交
          </span>
<!--          <a :class="{'link-type': scope.row.project_submit_proof == '已提交'}">{{ scope.row.project_submit_proof }}</a>-->
        </template>
      </el-table-column>

<!--      <el-table-column align="center" label="进度" width="80px">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.project_schedule }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column align="center" label="操作" width="250">-->
<!--        <template slot-scope="scope">-->
<!--            <el-button type="primary" size="small" icon="el-icon-download" @click="oneDownload(scope.row)">-->
<!--              一键下载-->
<!--            </el-button>-->
<!--            <el-button type="primary" size="small" icon="el-icon-info" @click="ledgerInfo(scope.row)">-->
<!--              台账信息-->
<!--            </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="台账信息" :visible.sync="ledgerInfoDialogVisible">
      <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        border
        :show-header=false
        style="width: 100%">
        <el-table-column
          prop="label1"
          label="名称"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.label1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content1"
          label="内容"
          width="170">
          <template slot-scope="scope">
            <span v-if="scope.row.isLink1">
              <a class="link-type">{{ scope.row.content1 }}</a>
            </span>
            <span v-else>
              {{ scope.row.content1 }}
            </span>
          </template>
<!--          还没想好以后后台传过来的是什么样的数据，是已提交三个字还是已提交的文件名称-->
<!--          <template slot-scope="scope">-->
<!--            <a href="" :class="{'link-type': scope.row.isLink1}">{{ scope.row.content1 }}</a>-->
<!--&lt;!&ndash;            <router-link :to="'/example/edit/'+scope.row.content1" class="link-type">&ndash;&gt;-->
<!--&lt;!&ndash;              <span>{{ scope.row.content1 }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--          </template>-->
        </el-table-column>
        <el-table-column
          prop="label2"
          label="名称"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.label2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content2"
          label="内容">
          <template slot-scope="scope">
            <span v-if="scope.row.isLink2">
              <a class="link-type">{{ scope.row.content2 }}</a>
            </span>
            <span v-else>
              {{ scope.row.content2 }}
            </span>
          </template>
<!--          <template slot-scope="scope">-->
<!--            <a href="" :class="{'link-type': scope.row.isLink2}">{{ scope.row.content2 }}</a>-->
<!--          </template>-->
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
<!--        <el-button type="primary" @click="oneDownload">-->
<!--          一键下载-->
<!--          &lt;!&ndash;          {{ $t('table.confirm') }}&ndash;&gt;-->
<!--        </el-button>-->
        <el-button type="primary" @click="ledgerInfoDialogClose">
          关闭
          <!--          {{ $t('table.confirm') }}-->
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="导出":visible.sync="exportDialogVisible">
      <el-checkbox-group v-model="checkList" @change="getExportColumn">
        <el-table :data="exportData" :show-header=false stripe style="width: 100%">
          <el-table-column prop="content1" label="内容" width="197">
            <template slot-scope="scope">
              <el-checkbox :label=scope.row.id1>{{scope.row.content1}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="content2" label="内容" width="197">
            <template slot-scope="scope">
              <el-checkbox :label=scope.row.id2>{{scope.row.content2}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column  prop="content3" label="内容">
            <template slot-scope="scope">
              <el-checkbox :label=scope.row.id3>{{scope.row.content3}}</el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectAllColumn">
          全选
          <!--          {{ $t('table.confirm') }}-->
        </el-button>
        <el-button type="primary" @click="exportLedgerExcel">
          导出
          <!--          {{ $t('table.confirm') }}-->
        </el-button>
        <el-button type="primary" @click="exportDialogClose">
          关闭
          <!--          {{ $t('table.confirm') }}-->
        </el-button>
      </div>
    </el-dialog>
<!--    <el-dialog title="导出" :visible.sync="exportDialogVisible">-->
<!--      <el-checkbox-group v-model="checkList">-->
<!--      <el-table-->
<!--        :data="exportData"-->
<!--        :span-method="exportDialogSpanMethod"-->
<!--        border-->
<!--        :show-header=false-->
<!--        style="width: 100%">-->
<!--        <el-table-column width="55" align="center">-->
<!--          <template slot-scope="scope">-->
<!--&lt;!&ndash;          <el-checkbox-group v-model="checkList">&ndash;&gt;-->
<!--          <el-checkbox :label=scope.row.content1 @change="aaa"></el-checkbox>-->
<!--&lt;!&ndash;          <input type="checkbox" value="" v-model="checkColumn">&ndash;&gt;-->
<!--&lt;!&ndash;          </el-checkbox-group>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="content1"-->
<!--          label="内容"-->
<!--          width="240">-->
<!--          <template slot-scope="scope">-->
<!--            <a href="" :class="{'link-type': scope.row.isLink1}">{{ scope.row.content1 }}</a>-->
<!--            &lt;!&ndash;            <router-link :to="'/example/edit/'+scope.row.content1" class="link-type">&ndash;&gt;-->
<!--            &lt;!&ndash;              <span>{{ scope.row.content1 }}</span>&ndash;&gt;-->
<!--            &lt;!&ndash;            </router-link>&ndash;&gt;-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column width="55" align="center">-->
<!--          <el-checkbox v-model="checked" @change="aaa"></el-checkbox>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="content2"-->
<!--          label="内容"-->
<!--          width="240">-->
<!--          <template slot-scope="scope">-->
<!--            <a href="" :class="{'link-type': scope.row.isLink2}">{{ scope.row.content2 }}</a>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="oneDownload">-->
<!--          一键下载-->
<!--          &lt;!&ndash;          {{ $t('table.confirm') }}&ndash;&gt;-->
<!--        </el-button>-->
<!--        <el-button type="primary" @click="ledgerInfoDialogClose">-->
<!--          关闭-->
<!--          &lt;!&ndash;          {{ $t('table.confirm') }}&ndash;&gt;-->
<!--        </el-button>-->
<!--      </div>-->
<!--      </el-checkbox-group>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      checkList: [],
      tableList: [{
        project_code: '2007611003',
        project_name: '陕西省太白县东沟铅锌（铜）矿普查',
        project_date: '2006',
        location: '陕西省',
        exploration_unit: '西北有色地质勘查局717总队',
        exploration_principal: '张建',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '朱政霖',
        exploration_right_processor: '西北有色地质勘查局地质勘查院',
        exploration_right_certificate: '已提交',
        start_date: '2007.1.2',
        finish_date: '2009.5.9',
        project_budget: 650,
        actual_budget: 600,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '小，金1380kg，2.23g/t；锌892.1吨，2.76%；铅591.56吨，1.83%；铜1605.41吨',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007621009',
        project_name: '甘肃省迭部县加勒克一带金矿普查',
        project_date: '2006',
        location: '甘肃省',
        exploration_unit: '甘肃地矿局第三勘查院',
        exploration_principal: '李万春',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '潘远',
        exploration_right_processor: '甘肃地矿局第三勘查院',
        exploration_right_certificate: '已提交',
        start_date: '2006.12.22',
        finish_date: '2007.6.30',
        project_budget: 400,
        actual_budget: 400,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '小，金2007kg',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007621009',
        project_name: '甘肃省肃北蒙古族自治县霍东－扫子山南金矿普查',
        project_date: '2006',
        location: '甘肃省',
        exploration_unit: '甘肃有色局四队',
        exploration_principal: '梁振京',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '朱振兴',
        exploration_right_processor: '甘肃有色局四队',
        exploration_right_certificate: '已提交',
        start_date: '2007.2.22',
        finish_date: '2010.2.20',
        project_budget: 200,
        actual_budget: 230,
        project_status: '执行中',
        has_ore: '否',
        ore_result: '',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007621003',
        project_name: '甘肃省庄浪县蛟龙掌一带铜多金属矿普查',
        project_date: '2006',
        location: '江西省上饶市',
        exploration_unit: '甘肃地矿局一勘院',
        exploration_principal: '徐蒙',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '张伟',
        exploration_right_processor: '甘肃地矿局一勘院',
        exploration_right_certificate: '已提交',
        start_date: '2007.4.2',
        finish_date: '2011.1.24',
        project_budget: 500,
        actual_budget: 500,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '中，前人成果：锌139586吨，铅29555吨，硫铁矿矿石68.43万吨',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007630001',
        project_name: '青海省都兰县五龙沟西金矿普查',
        project_date: '2006',
        location: '青海省都兰县',
        exploration_unit: '青海省地调院',
        exploration_principal: '梁国涛',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '叶汉峰',
        exploration_right_processor: '基金中心',
        exploration_right_certificate: '已提交',
        start_date: '2006.11.2',
        finish_date: '2008.2.20',
        project_budget: 100,
        actual_budget: 90,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '金305kg',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007631003',
        project_name: '青海省格尔木市唐古拉乡开心岭铁矿普查',
        project_date: '2006',
        location: '江西省上饶市',
        exploration_unit: '青海省柴达木综合地质矿产勘查院',
        exploration_principal: '徐宗熙',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '张文远',
        exploration_right_processor: '青海省柴达木综合地质勘查大队',
        exploration_right_certificate: '已提交',
        start_date: '2008.9.2',
        finish_date: '2009.12.20',
        project_budget: 300,
        actual_budget: 300,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '小，铁矿石388.81万吨',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007630002',
        project_name: '青海省同仁县台乌龙地区铅锌多金属矿普查',
        project_date: '2006',
        location: '青海省同仁县',
        exploration_unit: '青海省核工业地质局',
        exploration_principal: '李超',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '郭国翔',
        exploration_right_processor: '基金中心',
        exploration_right_certificate: '未提交',
        start_date: '2006.12.2',
        finish_date: '2009.2.5',
        project_budget: 350,
        actual_budget: 350,
        project_status: '执行中',
        has_ore: '否',
        ore_result: '',
        project_approval_opinion_economy: '未提交',
        project_approval_opinion_technology: '未提交',
        exploration_task_book: '未提交',
        supervisor_task_book: '未提交',
        project_design: '未提交',
        project_design_opinion_economy: '未提交',
        project_design_opinion_technology: '未提交',
        project_design_reply: '未提交',
        project_design_alter: '未提交',
        exploration_contract: '未提交',
        supervisor_contract: '未提交',
        exploration_invest_contract: '未提交',
        add_invest_contract: '未提交',
        check_request: '未提交',
        check_information: '未提交',
        check_comment: '未提交',
        project_result_report: '未提交',
        project_report_review_comment: '未提交',
        project_submit_proof: '未提交',
      },{
        project_code: '2007651012',
        project_name: '新疆哈密市雅满苏371铜矿普查',
        project_date: '2006',
        location: '江西省上饶市',
        exploration_unit: '有色金属矿产地质调查中心 ',
        exploration_principal: '孙志严',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '叶欣',
        exploration_right_processor: '北京中色地科矿产勘查研究院有限公司',
        exploration_right_certificate: '已提交',
        start_date: '2007.6.22',
        finish_date: '2008.3.5',
        project_budget: 300,
        actual_budget: 300,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '铜3884吨',
        project_approval_opinion_economy: '已提交',
        project_approval_opinion_technology: '已提交',
        exploration_task_book: '已提交',
        supervisor_task_book: '已提交',
        project_design: '已提交',
        project_design_opinion_economy: '已提交',
        project_design_opinion_technology: '已提交',
        project_design_reply: '已提交',
        project_design_alter: '已提交',
        exploration_contract: '已提交',
        supervisor_contract: '已提交',
        exploration_invest_contract: '已提交',
        add_invest_contract: '已提交',
        check_request: '已提交',
        check_information: '已提交',
        check_comment: '已提交',
        project_result_report: '已提交',
        project_report_review_comment: '已提交',
        project_submit_proof: '已提交',
      },{
        project_code: '2007651013',
        project_name: '新疆精河县3571铜矿普查',
        project_date: '2006',
        location: '新疆精河县',
        exploration_unit: '新疆地矿局第七地质大队',
        exploration_principal: '孙方石',
        supervisor_unit: '地质勘查监理有限公司',
        supervisor_principal: '郭晓',
        exploration_right_processor: '新疆维吾尔自治区地质矿产勘查开发局',
        exploration_right_certificate: '未提交',
        start_date: '2007.7.2',
        finish_date: '2009.3.20',
        project_budget: 400,
        actual_budget: 370,
        project_status: '执行中',
        has_ore: '是',
        ore_result: '铜2103吨，钼3.58吨，银2吨',
        project_approval_opinion_economy: '未提交',
        project_approval_opinion_technology: '未提交',
        exploration_task_book: '未提交',
        supervisor_task_book: '未提交',
        project_design: '未提交',
        project_design_opinion_economy: '未提交',
        project_design_opinion_technology: '未提交',
        project_design_reply: '未提交',
        project_design_alter: '未提交',
        exploration_contract: '未提交',
        supervisor_contract: '未提交',
        exploration_invest_contract: '未提交',
        add_invest_contract: '未提交',
        check_request: '未提交',
        check_information: '未提交',
        check_comment: '未提交',
        project_result_report: '未提交',
        project_report_review_comment: '未提交',
        project_submit_proof: '未提交',
      }],
      // tableData: [{
      //   label1: '项目编号',
      //   content1: '768865',
      //   isLink1: false,
      //   label2: '项目名称',
      //   content2: '阳曲县郑家梁一带铌、钽、铍矿预查',
      //   isLink2: false,
      // },{
      //   label1: '批复年份',
      //   content1: '2019',
      //   isLink1: false,
      //   label2: '所在地区',
      //   content2: '江西省上饶市',
      //   isLink2: false,
      // },{
      //   label1: '勘查单位',
      //   content1: '214地质队',
      //   isLink1: false,
      //   label2: '勘查负责人',
      //   content2: '张宏',
      //   isLink2: false
      // },{
      //   label1: '监理单位',
      //   content1: '地质勘查监理有限公司',
      //   isLink1: false,
      //   label2: '监理负责人',
      //   content2: '王达',
      //   isLink2: false
      // },{
      //   label1: '探矿权人',
      //   content1: '维达有限公司',
      //   isLink1: false,
      //   label2: '探矿权证',
      //   content2: '探矿权证.jpg',
      //   isLink2: true,
      // },{
      //   label1: '开工时间',
      //   content1: '2018.10.22',
      //   isLink1: false,
      //   label2: '结项时间',
      //   content2: '2019.12.20',
      //   isLink2: false,
      // },{
      //   label1: '项目预算',
      //   content1: 300,
      //   isLink1: false,
      //   label2: '实际预算拨付',
      //   content2: 300,
      //   isLink2: false,
      // },{
      //   label1: '项目状态',
      //   content1: '已结项',
      //   isLink1: false,
      //   label2: '是否含矿',
      //   content2: '是',
      //   isLink2: false,
      // },{
      //   label1: '找矿成果',
      //   content1: '',
      //   isLink1: false,
      //   label2: '',
      //   content2: '',
      //   isLink2: false,
      // },{
      //   label1: '立项专家意见（经济）',
      //   content1: '',
      //   isLink1: false,
      //   label2: '立项专家意见（技术）',
      //   content2: '',
      //   isLink2: false,
      // },{
      //   label1: '勘查任务书',
      //   content1: '勘查任务书.pdf',
      //   isLink1: true,
      //   label2: '监理任务书',
      //   content2: '监理任务书.pdf',
      //   isLink2: true,
      // },{
      //   label1: '项目设计',
      //   content1: '',
      //   isLink1: false,
      //   label2: '',
      //   content2: '',
      //   isLink2: false,
      // },{
      //   label1: '项目设计专家意见（经济）',
      //   content1: '',
      //   isLink1: false,
      //   label2: '项目设计专家意见（技术）',
      //   content2: '',
      //   isLink2: false,
      // },{
      //   label1: '项目设计批复',
      //   content1: '项目设计批复.pdf',
      //   isLink1: true,
      //   label2: '项目设计变更',
      //   content2: '项目设计变更.pdf',
      //   isLink2: true,
      // },{
      //   label1: '勘查合同',
      //   content1: '勘查合同.pdf',
      //   isLink1: true,
      //   label2: '监理合同',
      //   content2: '监理合同.pdf',
      //   isLink2: true,
      // },{
      //   label1: '合作勘查投资合同',
      //   content1: '合作勘查投资合同.pdf',
      //   isLink1: true,
      //   label2: '追加投资合同',
      //   content2: '追加投资合同.pdf',
      //   isLink2: true,
      // },{
      //   label1: '野外验收申请',
      //   content1: '野外验收申请.pdf',
      //   isLink1: true,
      //   label2: '野外验收资料',
      //   content2: '野外验收资料.pdf',
      //   isLink2: true,
      // },{
      //   label1: '野外验收意见书',
      //   content1: '野外验收意见书.pdf',
      //   isLink1: true,
      //   label2: '项目成果报告',
      //   content2: '项目成果报告.pdf',
      //   isLink2: true,
      // },{
      //   label1: '项目报告评审意见',
      //   content1: '项目报告评审意见.pdf',
      //   isLink1: true,
      //   label2: '项目汇交证明',
      //   content2: '项目汇交证明.pdf',
      //   isLink2: true,
      // }],
      tableData: [{
        label1: '项目编号',
        content1: '',
        isLink1: false,
        label2: '项目名称',
        content2: '',
        isLink2: false,
      },{
        label1: '批复年份',
        content1: '',
        isLink1: false,
        label2: '所在地区',
        content2: '',
        isLink2: false,
      },{
        label1: '勘查单位',
        content1: '',
        isLink1: false,
        label2: '勘查负责人',
        content2: '',
        isLink2: false
      },{
        label1: '监理单位',
        content1: '',
        isLink1: false,
        label2: '监理负责人',
        content2: '',
        isLink2: false
      },{
        label1: '探矿权人',
        content1: '',
        isLink1: false,
        label2: '探矿权证',
        content2: '探矿权证.jpg',
        isLink2: true,
      },{
        label1: '开工时间',
        content1: '',
        isLink1: false,
        label2: '结项时间',
        content2: '',
        isLink2: false,
      },{
        label1: '项目预算',
        content1: '',
        isLink1: false,
        label2: '实际预算拨付',
        content2: '',
        isLink2: false,
      },{
        label1: '项目状态',
        content1: '',
        isLink1: false,
        label2: '是否含矿',
        content2: '',
        isLink2: false,
      },{
        label1: '找矿成果',
        content1: '',
        isLink1: false,
        label2: '',
        content2: '',
        isLink2: false,
      },{
        label1: '立项专家意见（经济）',
        content1: '立项专家意见（经济）.pdf',
        isLink1: true,
        label2: '立项专家意见（技术）',
        content2: '立项专家意见（技术）.pdf',
        isLink2: true,
      },{
        label1: '勘查任务书',
        content1: '勘查任务书.pdf',
        isLink1: true,
        label2: '监理任务书',
        content2: '监理任务书.pdf',
        isLink2: true,
      },{
        label1: '项目设计',
        content1: '项目设计.pdf',
        isLink1: true,
        label2: '',
        content2: '',
        isLink2: false,
      },{
        label1: '项目设计专家意见（经济）',
        content1: '项目设计专家意见（经济）.pdf',
        isLink1: true,
        label2: '项目设计专家意见（技术）',
        content2: '项目设计专家意见（技术）.pdf',
        isLink2: true,
      },{
        label1: '项目设计批复',
        content1: '项目设计批复.pdf',
        isLink1: true,
        label2: '项目设计变更',
        content2: '项目设计变更.pdf',
        isLink2: true,
      },{
        label1: '勘查合同',
        content1: '勘查合同.pdf',
        isLink1: true,
        label2: '监理合同',
        content2: '监理合同.pdf',
        isLink2: true,
      },{
        label1: '合作勘查投资合同',
        content1: '合作勘查投资合同.pdf',
        isLink1: true,
        label2: '追加投资合同',
        content2: '追加投资合同.pdf',
        isLink2: true,
      },{
        label1: '野外验收申请',
        content1: '野外验收申请.pdf',
        isLink1: true,
        label2: '野外验收资料',
        content2: '野外验收资料.pdf',
        isLink2: true,
      },{
        label1: '野外验收意见书',
        content1: '野外验收意见书.pdf',
        isLink1: true,
        label2: '项目成果报告',
        content2: '项目成果报告.pdf',
        isLink2: true,
      },{
        label1: '项目报告评审意见',
        content1: '项目报告评审意见.pdf',
        isLink1: true,
        label2: '项目汇交证明',
        content2: '项目汇交证明.pdf',
        isLink2: true,
      }],
      exportData: [{
        id1: 'project_code',
        content1: '项目编号',
        id2: 'project_name',
        content2: '项目名称',
        id3: 'project_date',
        content3: '批复年份'
      },{
        id1: 'location',
        content1: '所在地区',
        id2: 'exploration_unit',
        content2: '勘察单位',
        id3: 'exploration_principal',
        content3: '勘察负责人'
      },{
        id1: 'supervisor_unit',
        content1: '监理单位',
        id2: 'supervisor_principal',
        content2: '监理负责人',
        id3: 'exploration_right_processor',
        content3: '探矿权人'
      },{
        id1: 'exploration_right_certificate',
        content1: '探矿权证',
        id2: 'start_date',
        content2: '开工时间',
        id3: 'finish_date',
        content3: '结项时间'
      },{
        id1: 'project_budget',
        content1: '项目预算',
        id2: 'actual_budget',
        content2: '实际预算拨付',
        id3: 'project_status',
        content3: '项目状态'
      },{
        id1: 'has_ore',
        content1: '是否含矿',
        id2: 'ore_result',
        content2: '找矿成果',
        id3: 'project_approval_opinion_economy',
        content3: '立项专家意见（经济）'
      },{
        id1: 'project_approval_opinion_technology',
        content1: '立项专家意见（技术）',
        id2: 'exploration_task_book',
        content2: '勘查任务书',
        id3: 'supervisor_task_book',
        content3: '监理任务书'
      },{
        id1: 'project_design',
        content1: '项目设计',
        id2: 'project_design_opinion_economy',
        content2: '项目设计专家意见（经济）',
        id3: 'project_design_opinion_technology',
        content3: '项目设计专家意见（技术）'
      },{
        id1: 'project_design_reply',
        content1: '项目设计批复',
        id2: 'project_design_alter',
        content2: '项目设计变更',
        id3: 'exploration_contract',
        content3: '勘察合同'
      },{
        id1: 'supervisor_contract',
        content1: '监理合同',
        id2: 'exploration_invest_contract',
        content2: '合作勘查投资合同',
        id3: 'add_invest_contract',
        content3: '追加投资合同'
      },{
        id1: 'check_request',
        content1: '野外验收申请',
        id2: 'check_information',
        content2: '野外验收资料',
        id3: 'check_comment',
        content3: '野外验收意见书'
      },{
        id1: 'project_result_report',
        content1: '项目成果报告',
        id2: 'project_report_review_comment',
        content2: '项目报告评审意见',
        id3: 'project_submit_proof',
        content3: '项目汇交证明'
      }],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      applyForAcceptanceDialogFormVisible: false,
      submitProofDialogFormVisible: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      statusSelected: '',
      statusOptions: [
        { id: 1, name: '未提交' },
        { id: 2, name: '已提交' },
        { id: 3, name: '待审核' },
        // { id: 4, name: '待确定监理单位' },
        { id: 5, name: '待签合同' },
        { id: 6, name: '执行中' },
        { id: 7, name: '待验收' },
        { id: 8, name: '验收通过' },
        { id: 9, name: '已结束' },
        { id: 10, name: '中止'}
      ],
      provinceSelected: '',
      // provinceOptions: [
      //   { id: 1, name: '北京' },
      //   { id: 2, name: '天津' },
      //   { id: 3, name: '河北' }
      // ],
      year: '',
      ledgerInfoDialogVisible: false,
      exportDialogVisible: false,
      exportRows: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

        this.list = this.tableList
        this.total = this.tableList.length
        this.listLoading = false

      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })

    },
    applyForAcceptance(row) {
      this.applyForAcceptanceDialogFormVisible = true
    },
    submitProof(row) {
      this.submitProofDialogFormVisible = true
    },
    // handleUpdate(row) {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    createData() {
      this.dialogFormVisible = false
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '成功',
      //         message: '创建成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

          this.dialogFormVisible = false

          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    ledgerInfo(row) {
      //点击项目名称获得行信息
      console.log(row);
      //将行信息转为台账信息对话框信息
      this.tableData[0].content1 = row.project_code
      this.tableData[0].content2 = row.project_name
      this.tableData[1].content1 = row.project_date
      this.tableData[1].content2 = row.location
      this.tableData[2].content1 = row.exploration_unit
      this.tableData[2].content2 = row.exploration_principal
      this.tableData[3].content1 = row.supervisor_unit
      this.tableData[3].content2 = row.supervisor_principal
      this.tableData[4].content1 = row.exploration_right_processor
      // this.tableData[4].content2 = row.
      this.tableData[4].isLink2 = row.exploration_right_certificate == '已提交'
      this.tableData[5].content1 = row.start_date
      this.tableData[5].content2 = row.finish_date
      this.tableData[6].content1 = row.project_budget
      this.tableData[6].content2 = row.actual_budget
      this.tableData[7].content1 = row.project_status
      this.tableData[7].content2 = row.has_ore
      this.tableData[8].content1 = row.ore_result
      // this.tableData[8].content2 = row.//空格
      // this.tableData[9].content1 = row.
      // this.tableData[9].content2 = row.
      // this.tableData[10].content1 = row.
      // this.tableData[10].content2 = row.
      // this.tableData[11].content1 = row.
      // this.tableData[11].content2 = row.
      // this.tableData[12].content1 = row.
      // this.tableData[12].content2 = row.
      // this.tableData[13].content1 = row.
      // this.tableData[13].content2 = row.
      // this.tableData[14].content1 = row.
      // this.tableData[14].content2 = row.
      // this.tableData[15].content1 = row.
      // this.tableData[15].content2 = row.
      // this.tableData[16].content1 = row.
      // this.tableData[16].content2 = row.
      // this.tableData[17].content1 = row.
      // this.tableData[17].content2 = row.
      // this.tableData[18].content1 = row.
      // this.tableData[18].content2 = row.
      // this.tableData[19].content1 = row.
      // this.tableData[19].content2 = row.
      this.tableData[9].isLink1 = row.project_approval_opinion_economy == '已提交'
      this.tableData[9].isLink2 = row.project_approval_opinion_technology == '已提交'
      this.tableData[10].isLink1 = row.exploration_task_book == '已提交'
      this.tableData[10].isLink2 = row.supervisor_task_book == '已提交'
      this.tableData[11].isLink1 = row.project_design == '已提交'
      // this.tableData[11].isLink2 = row.
      this.tableData[12].isLink1 = row.project_design_opinion_economy == '已提交'
      this.tableData[12].isLink2 = row.project_design_opinion_technology == '已提交'
      this.tableData[13].isLink1 = row.project_design_reply == '已提交'
      this.tableData[13].isLink2 = row.project_design_alter == '已提交'
      this.tableData[14].isLink1 = row.exploration_contract == '已提交'
      this.tableData[14].isLink2 = row.supervisor_contract == '已提交'
      this.tableData[15].isLink1 = row.exploration_invest_contract == '已提交'
      this.tableData[15].isLink2 = row.add_invest_contract == '已提交'
      this.tableData[16].isLink1 = row.check_request == '已提交'
      this.tableData[16].isLink2 = row.check_information == '已提交'
      this.tableData[17].isLink1 = row.check_comment == '已提交'
      this.tableData[17].isLink2 = row.project_result_report == '已提交'
      this.tableData[18].isLink1 = row.project_report_review_comment == '已提交'
      this.tableData[18].isLink2 = row.project_submit_proof == '已提交'

      this.ledgerInfoDialogVisible = true;
    },
    ledgerInfoDialogClose() {
      this.ledgerInfoDialogVisible = false;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 8 && columnIndex == 1) {
        return [1, 3]
      }
      if (rowIndex == 11 && columnIndex == 1) {
        return [1, 3]
      }
      // if (rowIndex % 2 === 0) {
      //   if (columnIndex === 0) {
      //     return [1, 2];
      //   } else if (columnIndex === 1) {
      //     return [0, 0];
      //   }
      // }
    },
    selectExportColumn() {
      // console.log(this.checkList);
      this.checkList.splice(0)//在选择导出列之前清除以前的选择
      this.exportDialogVisible = true
      // console.log(this.checkList);
    },
    selectAllColumn() {
      this.checkList = ['project_code','project_name','project_date','location','exploration_unit',
        'exploration_principal','supervisor_unit','supervisor_principal','exploration_right_processor', 'exploration_right_certificate',
        'start_date','finish_date','project_budget','actual_budget', 'project_status', 'has_ore',
        'ore_result','project_approval_opinion_economy','project_approval_opinion_technology', 'exploration_task_book', 'supervisor_task_book',
        'project_design','project_design_opinion_economy', 'project_design_opinion_technology','project_design_reply', 'project_design_alter',
        'exploration_contract','supervisor_contract','exploration_invest_contract','add_invest_contract','check_request',
        'check_information','check_comment','project_result_report','project_report_review_comment','project_submit_proof']
    },
    exportLedgerExcel() {
      if (this.checkList.length == 0) {
        this.$message.error('请选择导出字段');
        return
      }
      this.exportDialogVisible = false
      this.$notify({
        title: '成功',
        message: '导出成功',
        type: 'success'
      });
    },
    exportDialogClose() {
      this.exportDialogVisible = false
    },
    getExportColumn() {
      console.log(this.checkList);
    },
    selectExportRow(val) {
      console.log(val);
      this.exportRows = val;
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
