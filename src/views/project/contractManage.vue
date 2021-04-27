<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.projectName"
        placeholder="项目名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.explore" placeholder="勘察单位" clearable style="width: 110px">
        <el-option v-for="item in exploreOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.supervisor" placeholder="监理单位" clearable style="width: 110px">
        <el-option v-for="item in superviseOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button
        v-waves
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
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
      <el-table-column label="项目名称" min-width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="勘察单位" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.explore">
            {{ row.explore }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="监理单位" width="220px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.supervisor">
            {{ row.supervisor }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="预算拨付计划" width="120" align="center">
        <template slot-scope="{row}">
          <!-- Table -->
          <el-button type="text" @click="dialogTableVisible = true">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="勘查合同" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="监理合同" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="合作勘查投资合同" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="追加投资合同" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="项目合同提交时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.supervisorAssignmentTime| parseTime('2019-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="success" size="small" @click="handleUpdate(row)">上传项目合同</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <el-dialog title="项目合同上传" :visible.sync="dialogFormVisible" width="1000px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="200px"
        style="width: 600px; margin-left:60px;"
      >
        <el-form-item label="勘察合同">
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
        <el-form-item label="监理合同">
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
        <el-form-item label="合作勘查投资合同">
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
        <el-form-item label="追加投资合同">
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

    <el-dialog title="预算拨付计划" :visible.sync="dialogTableVisible">
      <span>项目总预算（万）：500</span>
      <el-table :data="budgetList">
        <el-table-column property="stageName" label="阶段名" />
        <el-table-column property="paymentRatio" label="付款比例" />
        <el-table-column property="amount" label="拨付金额" />
        <el-table-column property="scheduleTarget" label="进度要求" />
        <el-table-column width="300" property="paymentDemand" label="付款要求说明" />
      </el-table>
    </el-dialog>

    <!-- 添加一笔预算Form -->
    <el-dialog title="添加预算" :visible.sync="addBudgetDialogFormVisible">
      <el-form
        :model="budgetForm"
        label-width="150px"
        style="width: 300px; margin-left:60px;"
      >
        <!-- <el-form-item label="年份">
          <el-input v-model="budgetForm.year" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="经费预算(万元)">
          <el-input v-model="budgetForm.cost" autocomplete="off" />
        </el-form-item>
        <el-form-item label="拨付原因概述">
          <el-input v-model="budgetForm.reason" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBudgetDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBudget(budgetForm)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createProject, updateProject } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mockList, explores, supervisors } from './mock'

const statusList = ['下载', '未上传']
const projectNames = [
  '青海省格尔木市唐古拉乡开心岭铁矿普查',
  '青海省同仁县台乌龙地区铅锌多金属矿普查',
  '青海省泽库县多隆尕日寨－夏德日岩金矿普查',
  '宁夏回族自治区吴忠市新庄集煤炭资源预查',
  '宁夏彭阳县草庙地区煤炭普查'
]
const List = mockList(statusList, projectNames)

export default {
  name: 'SupervisionBookManage',
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
      total: 0,
      budgetList: [
        { stageName: '第一阶段',
          paymentRatio: '40%',
          amount: 200,
          scheduleTarget: '无',
          paymentDemand: '完成设计批复即可拨付'
        },
        { stageName: '第二阶段',
          paymentRatio: '40%',
          amount: 200,
          scheduleTarget: '80%',
          paymentDemand: '工程进度完成80%即可拨付'
        },
        { stageName: '第三阶段',
          paymentRatio: '15%',
          amount: 75,
          scheduleTarget: '无',
          paymentDemand: '项目通过验收即可拨付'
        },
        { stageName: '第四阶段',
          paymentRatio: '5%',
          amount: 25,
          scheduleTarget: '无',
          paymentDemand: '资料汇交完成后即可拨付'
        }
      ],
      budgetForm: {
        year: undefined,
        cost: undefined,
        reason: undefined
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        size: 20,
        projectId: undefined,
        assignmentId: undefined,
        status: undefined,
        projectName: undefined,
        explore: undefined,
        contact: undefined,
        fromDate: undefined,
        toDate: undefined,
        supervisorAssignmentTime: undefined,
        supervisor: undefined,
        sort: '+id'
      },
      statusOptions: ['编辑', '提交'],
      exploreOptions: explores,
      superviseOptions: supervisors,
      contacts: ['contact1', 'contact2', 'contact3'],
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
      addBudgetDialogFormVisible: false,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPvVisible: false,
      dialogStatus: '',
      fileList: [],
      value1: undefined,
      scaleCheck: {
        flag: 0,
        type: null
      },
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
    submit(row) {
      row.status = '已提交'
      this.$message({
        message: '操作Success',
        type: 'success'
      })
    },
    checkConfirm() {
      this.dialogCheckVisible = false
    },
    handleAddSuccess(response) {
      this.temp.avatar = response.data
    },
    handleAddRemove() {
      this.temp.avatar = ''
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
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    }
  }
}
</script>

