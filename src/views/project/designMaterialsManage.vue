<template>
  <div class="app-container">
    <div class="filter-container">
      <!--   搜索选项   -->
      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 100px;" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.explore" placeholder="勘察单位" clearable style="width: 110px">
        <el-option v-for="item in exploreOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 250px"
        :picker-options="pickerOptions"
        @change="dateChange"
      /> -->
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!--  table  -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="项目编号" prop="projectId" align="center" width="100">
        <template slot-scope="{row}">
          <!--    模拟的projectId格式： {number: 103240}      -->
          <!--    todo: 删除number      -->
          <span>{{ row.projectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="150px">
        <template slot-scope="{row}">
          {{ row.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="实物工作量及进度设置" width="170" align="center">
        <template slot-scope="{row}">
          <!-- Table -->
          <el-button type="text" @click="dialogTableVisible = true">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="勘察单位" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.explore">
            {{ row.explore }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="勘察负责人" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.contact">
            {{ row.contact }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目设计方案" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="项目设计专家意见（经济）" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="项目设计专家意见（技术）" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="项目设计批复" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status2 }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="mini"
            @click="dialogFormVisible=true"
          >
            批复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="项目设计批复" :visible.sync="dialogFormVisible" width="1000px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="200px"
        style="width: 600px; margin-left:60px;"
      >
        <el-form-item label="项目设计批复">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
            :action="imageUrl"
            list-type="picture-card"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="实物工作量及进度设置" :visible.sync="dialogTableVisible">
      <!-- <el-button type="primary" @click="addBudgetDialogFormVisible = true">
        添加预算
      </el-button>
      <el-table :data="budgetList">
        <el-table-column property="year" label="年份" />
        <el-table-column property="zuantan" label="钻探(M)" />
        <el-table-column property="shandi" label="山地工程(M^3)" width="120" />
        <el-table-column property="wutan" label="物探" />
        <el-table-column property="huatan" label="化探" />
        <el-table-column property="cost" label="年度经费预算(万元)" width="150" />
      </el-table> -->
      <el-form :inline="true" :model="formInline"  class="demo-form-inline" >
        <el-form-item label="物探总量（平方公里）">
          <el-input v-model="formInline.wutan" placeholder="物探总量（平方公里）"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.wutan_weight" placeholder="权重"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="化探总量（平方公里）">
          <el-input v-model="formInline.huatan" placeholder="化探总量（平方公里）"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.huatan_weight" placeholder="权重"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="钻探总量（米）">
          <el-input v-model="formInline.zuantan" placeholder="钻探总量（米）" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.zuantan_weight" placeholder="权重"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="坑探总量（立方米）">
          <el-input v-model="formInline.kengtan" placeholder="坑探总量（立方米）" style="width:195px;"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.kengtan_weight" placeholder="权重"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="槽探总量（立方米）">
          <el-input v-model="formInline.caokan" placeholder="槽探总量（立方米）" style="width:195px;"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.caotan_weight" placeholder="权重"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="浅井总量（米）">
          <el-input v-model="formInline.qianjing" placeholder="浅井总量（米）" style="width:220px;"></el-input>
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="formInline.qianjing_weight" placeholder="权重" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogTableVisible = false">
          确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加预算Form -->
    <el-dialog title="添加预算" :visible.sync="addBudgetDialogFormVisible">
      <el-form
        :model="budgetForm"
        label-width="150px"
        style="width: 300px; margin-left:60px;"
      >
        <el-form-item label="年份">
          <el-input v-model="budgetForm.year" autocomplete="off" />
        </el-form-item>
        <el-form-item label="钻探(M)">
          <el-input v-model="budgetForm.zuantan" autocomplete="off" />
        </el-form-item>
        <el-form-item label="山地工程(M^3)">
          <el-input v-model="budgetForm.shandi" autocomplete="off" />
        </el-form-item>
        <el-form-item label="物探">
          <el-input v-model="budgetForm.wutan" autocomplete="off" />
        </el-form-item>
        <el-form-item label="化探">
          <el-input v-model="budgetForm.huatan" autocomplete="off" />
        </el-form-item>
        <el-form-item label="年度经费预算(万元)">
          <el-input v-model="budgetForm.cost" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBudgetDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBudget(budgetForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!--提交审核意见-->
    <el-dialog title="设计批复" :visible.sync="dialogCheckVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-radio v-model="radio" label="1" @change="checkIsPass">通过</el-radio>
        <el-radio v-model="radio" label="2" @change="checkNotPass">不通过</el-radio>
        <el-input
          ref="advice"
          v-model="inputAdvice"
          type="textarea"
          :rows="5"
          placeholder="请输入意见"
          style="margin-top: 30px"
          :disabled="isPass"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogCheckVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="审核" :visible.sync="requestCheckDialogFormVisible">
      <el-form
        ref="check"
        :model="scaleCheck"
        :rules="rules"
        label-position="right"
        label-width="200px"
        style="width: 600px; margin-left:60px;"
      >
        <el-form-item label-width="120px">
          <el-switch
            v-model="scaleCheck.flag"
            style="display: block"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="审核通过"
            inactive-text="审核不通过"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="审核人" label-width="120px" prop="type">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="审核人姓名" />
        </el-form-item>
        <el-form-item label="审核意见" label-width="120px" prop="type">
          <el-input v-model="scaleCheck.type" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkConfirm">确 定</el-button>
        <el-button type="info" @click="dialogCheckVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createProject, updateProject } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Mock from 'mockjs'
import { mockList, explores, supervisors } from './mock'

const List = []
// 不可过大，因为1. 不显示分页 2. 会慢
const count = 5
const projectNames = [
  '宁夏贺兰山北段北岔沟－柳葫芦沟金矿普查',
  '新疆精河县3571铜矿普查',
  '新疆青河县托让格库都克一带铁铜金矿普查',
  '新疆哈密市雅满苏371铜矿普查',
  '新疆尉犁县卡乌留克塔格铁磷矿普查'
]
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    // id: '@increment',
    'projectId|1': [2007611003,
      2007611008,
      2007621009,
      2007621008,
      2007621003,
      2011621037,
      2011621035,
      2007630001,
      2007631003,
      2007630002
    ],
    // 项目任务书编号
    assignmentId: Mock.mock({
      'number|10100-10900': 1
    }),
    // 监理任务书编号
    supervisorAssignmentId: Mock.mock({
      'number|10100-10900': 1
    }),
    // 下达任务书时间
    assignmentTime: +Mock.Random.date('T'),
    // 下达监理任务书时间
    supervisorAssignmentTime: +Mock.Random.date('T'),
    // 最新审核时间
    lastCheckTime: +Mock.Random.date('T'),
    // 审核通过时间
    checkTime: +Mock.Random.date('T'),
    // 项目名称
    projectName: projectNames[i],
    // 勘察单位
    'explore|1': explores,
    // explore: Mock.Random.cword(3, 5),
    // 监理单位
    'supervisor|1': supervisors,
    // 联系人
    contact: Mock.Random.cname(),
    // 探矿权人
    exploreContact: Mock.Random.cname(),
    // 批复时间
    timestamp: +Mock.Random.date('T'),
    // 项目状态
    // '编辑', '提交'
    // 未审核，审核已通过，审核未通过
    // 'status|1': ['编辑', '提交', '未审核', '审核已通过', '审核未通过', '已确认', '待确认'],
    'status|1': ['下载', '未上传'],
    'status2|1': ['下载', '未批复'],
    remark: Mock.Random.cparagraph(1, 3)
  }))
}

export default {
  name: 'Projects',
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
      radio: '1',
      // todo delete
      scaleCheck: {
        flag: 0,
        type: null
      },
      tableKey: 0,
      list: null,
      formInline: {
          wutan: '',
          wutan_weight: '',
          huatan: '',
          huatan_weight: '',
          zuantan: '',
          zuantan_weight: '',
          kengtan: '',
          kengtan_weight: '',
          caotan: '',
          caotan_weight: '',
          qianjing: '',
          qianjing_weight: ''
      },
      budgetForm: {
        year: undefined,
        zuantan: undefined,
        shandi: undefined,
        wutan: undefined,
        huatan: undefined,
        cost: undefined
      },
      budgetList: [{
        year: '2016',
        zuantan: 1500,
        shandi: 2500,
        wutan: 5000,
        huatan: 2000,
        cost: 1450
      }, {
        year: '2017',
        zuantan: 3000,
        shandi: 5000,
        wutan: 0,
        huatan: 700,
        cost: 1580
      }],
      total: 0,
      listLoading: true,
      listQuery: {
        stage: 3,
        page: 1,
        limit: 20,
        projectId: undefined,
        status: undefined,
        status2: undefined,
        projectName: undefined,
        explore: undefined,
        contact: undefined,
        fromDate: undefined,
        toDate: undefined,
        sort: '+id'
      },
      statusOptions: ['未审核', '审核未通过'],
      exploreOptions: explores,
      contacts: ['contact1', 'contact2', 'contact3'],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        projectId: undefined,
        projectName: '',
        explore: '',
        contact: '',
        timestamp: new Date(),
        status: '编辑',
        remark: ''
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      addBudgetDialogFormVisible: false,
      dialogCheckVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      pvData: [],
      rules: {
        // el-form-item prop 属性为 key
        projectId: [{ required: true, trigger: 'blur' }],
        projectName: [{ required: true, trigger: 'blur' }],
        explore: [{ required: true, trigger: 'blur' }],
        contact: [{ required: true, trigger: 'blur' }],
        timestamp: [{ type: 'date', required: true, trigger: 'change' }]
      },
      downloadLoading: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    // this.getList()
    this.listLoading = true
    this.list = List
    this.listLoading = false
  },
  methods: {
    addBudget(budgetForm) {
      this.budgetList.push(budgetForm)
      this.budgetForm = {
        year: undefined,
        zuantan: undefined,
        shandi: undefined,
        wutan: undefined,
        huatan: undefined,
        cost: undefined
      }
      this.addBudgetDialogFormVisible = false
    },
    checkPass() {},
    checkNotPass() {},
    // 审核
    check(row) {
      this.checkScaleId = row.scaleId
      console.log(this.checkScaleId)
      this.scaleCheck = {
        flag: '0',
        type: null
      }
      this.dialogCheckVisible = true
    },
    checkConfirm() {
      this.dialogCheckVisible = false
    },
    dateChange(dateRange) {
      // === 失败？ 为undefined进不去判断
      // eslint-disable-next-line eqeqeq
      if (dateRange == undefined) {
        this.listQuery.fromDate = undefined
        this.listQuery.toDate = undefined
      } else {
        this.listQuery.fromDate = dateRange[0]
        this.listQuery.toDate = dateRange[1]
        console.log(this.listQuery.fromDate)
        console.log(this.listQuery.toDate)
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
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
      // todo
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        projectName: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.resetTemp()
      this.dialogStatus = 'download'
      // this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createProject(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateProject(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

