<template>
  <div class="app-container">
    <!--  todo  -->
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
          <span>{{ row.projectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="勘察单位" min-width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.contact">
            {{ row.explore }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="勘察负责人" min-width="85px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.contact">
            {{ row.contact }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项目任务书" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="下达任务书时间" min-width="60px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status=='下载'">{{ row.assignmentTime| parseTime('2019-{m}-{d}') }}</span>
          <!--          <span>{{ row.assignmentTime| parseTime('{y}-{m}-{d}') }}</span>-->
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"

        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="mini"
            @click="dialogFormVisible=true"
          >
            上传
          </el-button>

          <!-- <el-button
            size="small"
            type="success"
            @click="dialogCheckVisible=true"
          >
            监理单位委派
          </el-button> -->
          <!-- <el-button type="text">项目任务书下载</el-button> -->

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

    <el-dialog title="项目任务书上传" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:60px;"
      >
        <el-form-item label="项目任务书">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
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

    <!--监理单位委派-->
    <el-dialog title="监理单位委派" :visible.sync="dialogCheckVisible">
      <el-form
        ref="check"
        :model="scaleCheck"
        :rules="rules"
        label-position="right"
        label-width="200px"
        style="width: 600px; margin-left:60px;"
      >
        <el-form-item label="监理单位" label-width="120px" prop="type">
          <el-select v-model="listQuery.explore" placeholder="选择监理单位" clearable style="width: 150px">
            <el-option v-for="item in exploreOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkConfirm">确 定</el-button>
        <el-button type="info" @click="dialogCheckVisible = false">取 消</el-button>
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
const projectNames = ['陕西省太白县东沟铅锌（铜）矿普查',
  '陕西省宁强县汶家坪铜矿普查',
  '甘肃省迭部县加勒克一带金矿普查',
  '甘肃省肃北蒙古族自治县霍东－扫子山南金矿普查',
  '甘肃省庄浪县蛟龙掌一带铜多金属矿普查'
]
const List = mockList(statusList, projectNames)

export default {
  name: 'AssignmentBookManage',
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
      listLoading: true,
      listQuery: {
        stage: 4,
        page: 1,
        limit: 20,
        projectId: undefined,
        assignmentId: undefined,
        status: undefined,
        projectName: undefined,
        explore: undefined,
        contact: undefined,
        fromDate: undefined,
        toDate: undefined,
        sort: '+id'
      },
      statusOptions: ['已确认', '待确认'],
      exploreOptions: explores,
      contacts: ['contact1', 'contact2', 'contact3'],
      temp: {
        // todo: 删除number
        projectId: undefined,
        projectName: '',
        explore: '',
        exploreContact: undefined,
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
    submit(row) {
      row.status = '已提交'
      this.$message({
        message: '操作Success',
        type: 'success'
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

