<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.projectName"
        placeholder="项目名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.supervisor" placeholder="监理单位" clearable style="width: 110px">
        <el-option v-for="item in superviseOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button
        v-waves
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <!-- <el-button
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button> -->
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
      <el-table-column label="项目名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监理单位" width="285px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.supervisor">
            {{ row.supervisor }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="监理负责人" min-width="85px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.contact">
            {{ row.contact }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目监理计划书" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="下达监理计划书时间" min-width="120px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status=='下载'">{{ row.supervisorAssignmentTime| parseTime('2019-{m}-{d}') }}</span>
          <!--          <span>{{ row.supervisorAssignmentTime| parseTime('{y}-{m}-{d}') }}</span>-->
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="200px"
        style="width: 600px; margin-left:60px;"
      >
        <el-form-item label="项目名称" prop="trueName">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目编码" prop="trueName">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="项目编码" />
        </el-form-item>
        <el-form-item label="项目任务书编号" prop="trueName">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="项目任务书编号" />
        </el-form-item>
        <el-form-item label="监理计划书编号" prop="trueName">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="监理计划书编号" />
        </el-form-item>
        <el-form-item label="监理单位" prop="trueName">
          <el-input v-model="temp.trueName" style="width:410px" type="text" placeholder="单位名称" />
        </el-form-item>
        <el-form-item label="项目起止时间">
          <el-date-picker
            v-model="value1"
            style="width:410px"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="监理计划书详细文件">
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

    <!--审核量表-->
    <el-dialog title="申请审核" :visible.sync="dialogCheckVisible">
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
  '甘肃省安西县辉铜山地区金银矿普查',
  '甘肃省张掖市平山湖含煤区煤炭资源普查',
  '甘肃省白银市后长川钨矿普查',
  '甘肃省金塔县穿山驯铅锌矿普查',
  '甘肃省肃北蒙古族自治县小冰沟铅锌矿普查'
]
const List = mockList(statusList, projectNames)

export default {
  name: 'SupervisionPlanManage',
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
      tableKey: 0,
      list: null,
      total: 0,
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

