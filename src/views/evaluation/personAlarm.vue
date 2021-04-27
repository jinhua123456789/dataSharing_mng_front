<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="输入计划名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="选择量表"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in scaleOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-tree
        class="filter-tree"
        :data="deptTree"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        ref="tree"
        highlight-current>
      </el-tree>
      <el-select
        v-model="listQuery.type"
        placeholder="预警等级"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in warningLevelOption"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="计划名称"
        align="center"
        width="200px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
          >{{ row.name }}</span>
          <!--<el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creater }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生效时间"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="失效时间"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="预警人数"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.warnPersonNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="预警等级"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.warningLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="计划测评人数"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.planPersonNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="完成测评人数"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            @click="personAlarmList(row.id)"
          >
            个人预警
          </el-button>
        </template>ist
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
<!--    个人预警详情-->
    <el-dialog
      title="个人预警详情"
      :visible.sync="personAlarmDetailVisible"
      width="30%"
    >
      <div>姓名      ：{{temp.user}}</div>
      <div>所属部门   ：{{temp.user}}</div>
      <div>状态      ：{{temp.state}}</div>
      <div>总分      ：{{temp.totalScore}}</div>
      <div>预警等级  ：{{temp.isWarning}}</div>
      <div>各因子得分详情：</div>
      <span v-for ="item in temp.factorScoreList"> {{item.factorName}}:{{item.scroe}} 是否预警{{item.isWarning}}</span>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="personAlarmDetailVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!--测评结果预警人员列表-->
    <el-dialog
      title="预警人员列表"
      :visible.sync="personDetailVisible"
      width="75%"
    >
      <div class="filter-container">
        <el-input
          v-model="personlistQuery.name"
          placeholder="输入姓名"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-tree
          class="filter-tree"
          :data="deptTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          ref="tree"
          highlight-current>
        </el-tree>
        <el-select
          v-model="personlistQuery.state"
          placeholder="测评状态"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in stateOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-input
          v-model="personlistQuery.startScore"
          placeholder="输入起始分数"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="personlistQuery.endScore"
          placeholder="输入结束分数"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="personlistQuery.iswarning"
          placeholder="是否预警"
          style="width: 140px"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="item in [0,1]"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          查询
        </el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="personDetailList"
        stripe
        fit
        highlight-current-row
        style="width:100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          label="姓名"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属部门"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="测评状态"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="测评得分"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalScore }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否预警"
          align="center"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isWarning }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="280"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button
              type="primary"
              @click="personAlarmDetails(row)"
            >
              预警详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="persontotal>0"
        :total="persontotal"
        :page.sync="personlistQuery.pageNum"
        :limit.sync="personlistQuery.pageSize"
        @pagination="personDetails"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="personDetailVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getPlanList , getPersonAlarmList} from '@/api/personalarm'
  import { getDeptTree,getScaleTree } from '@/api/evaluationplan'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // arr to obj ,such as { CN : "China", US : "USA" }
  export default {
    name: 'personAlarm',
    components: { Pagination },
    directives: { waves },
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
        tableKey: 0,
        list: null,
        deptTree:null,
        personDetailList: null,
        total: 0,
        persontotal:0,
        listLoading: false,
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          name: undefined,
          state: undefined,
          scaleId: undefined
        },
        personlistQuery: {
          pageNum: 1,
          pageSize: 20,
          name: undefined,
          department: undefined,
          state: undefined,
          startScore:undefined,
          endScore:undefined,
          iswarning:undefined
        },
        scaleOptions: null,
        testObjectOptions: [{id:1,name: "一年级"},{id:2,name:"二年级"},{id:3,name:"三年级"},{id:4,name:"四年级"},{id:5,name:"五年级"}],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        warningLevelOption: [1, 2, 3],
        stateOptions:["未开始" , "已完成"],
        showReviewer: false,
        temp: {
          id: undefined,
          user: null,//被测人姓名团体
          state: '',//被测人状态
          totalScore: '',//被测人总分
          isWarning: undefined,//被测人预警等级
          factorScoreList: null,//被测人因子详情
        },
        groupDetailVisible: false,
        personDetailVisible:false,
        personAlarmDetailVisible:false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        pvData: [],
        rules: {
          plan_name: [{ required: true, message: 'planname is required', trigger: 'change' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      this.getDept()
      this.getScale()
    },
    methods: {
      getList() {
        this.listLoading = false
        getPlanList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        })
      },
      getDept() {
        getDeptTree().then(response => {
          this.deptTree = response.data.data
          console.log("部门树"+ JSON.stringify(this.deptTree[0].name))
        })
      },

      getScale() {
        getScaleTree(1).then(response => {
          this.scaleOptions= response.data.data.scaleIdAndNameEntityList
          console.log("量表"+ JSON.stringify(this.scaleOptions))
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',//计划名
          groupName: '',//测评对象
          scaleNmae: '',//量表名
          PlanPersonNum: undefined,//计划参与人数
          realNum: undefined,//实际完成人数
          warnPersonNum: undefined,//预警人数
          warningLevel: undefined//预警等级，是否预警，大于0就是预警
        }
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      personAlarmDetails(row){
        this.temp = Object.assign({}, row) // copy obj
        this.personAlarmDetailVisible = true
      },
      personAlarmList(planid){
        // this.listLoading = true
        getPersonAlarmList(planid).then(response => {
          this.personDetailList = response.data.list
          this.persontotal = response.data.total
          this.personDetailVisible = true
          console.log(this.personDetailList)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        }).catch((error=>{
          console.log("qingiushbbai")
        }))
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style scoped>

</style>
