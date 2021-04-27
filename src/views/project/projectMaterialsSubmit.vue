<template>
  <div class="app-container">
    <div class="filter-container">
      <!--   搜索选项   -->
      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 100px;" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="项目状态" clearable style="width: 110px">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 250px"
        :picker-options="pickerOptions"
        @change="dateChange"
      />
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
      <el-table-column label="批复时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('2019-{m}-{d}') }}</span>
          <!--          <span>{{ row.timestamp | parseTime('{y}-{m}-{d}') }}</span>-->
          <!--          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="勘察单位" class-name="status-col" width="200">
        <template slot-scope="{row}">
          <el-tag :type="row.explore">
            {{ row.explore }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.contact">
            {{ row.contact }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--    v-if="row.status!=='published'"      -->
          <el-button type="success" size="small" @click="handleUpdate(row)">
            提交立项资料
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="width: 400px; margin-left:auto; margin-right:auto;">
        <el-form-item label="立项技术资料（A卷）">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
            :action="imageUrl"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="立项矿权资料（B卷）">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
            :action="imageUrl"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="立项论证专家意见书（技术）">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
            :action="imageUrl"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="立项论证专家意见书（经济）">
          <el-upload
            class="upload-add"
            :on-remove="handleAddRemove"
            :on-success="handleAddSuccess"
            name="file"
            :action="imageUrl"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div></el-dialog>

  </div>
</template>

<script>
import { fetchList, createProject, updateProject } from '@/api/project'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Mock from 'mockjs'

const List = []
// 不可过大，因为1. 不显示分页 2. 会慢
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    // id: '@increment',
    projectId: Mock.mock({
      'number|101000-109000': 1
    }),
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
    projectName: Mock.Random.ctitle(10, 20),
    // 勘察单位
    'explore|1': ['精芯信息有限公司'],
    // explore: Mock.Random.cword(3, 5),
    // 监理单位
    supervisor: Mock.Random.cword(3, 5),
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
    'status|1': ['未审核', '审核已通过', '审核未通过'],
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        stage: 2,
        page: 1,
        limit: 20,
        projectId: undefined,
        status: undefined,
        projectName: undefined,
        explore: '精芯信息有限公司',
        contact: undefined,
        fromDate: undefined,
        toDate: undefined,
        sort: '+id'
      },
      statusOptions: ['未审核', '审核已通过', '审核未通过'],
      exploreOptions: ['精芯信息有限公司',
        '华泰通安网络有限公司',
        '超艺科技有限公司',
        '通际名联信息有限公司',
        '济南亿次元传媒有限公司',
        '开发区世创网络有限公司',
        '立信电子信息有限公司',
        '艾提科信网络有限公司'],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '提交立项资料',
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
        projectId: undefined,
        projectName: '',
        explore: '',
        contact: '',
        timestamp: new Date(),
        status: '编辑',
        remark: ''
      }
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

