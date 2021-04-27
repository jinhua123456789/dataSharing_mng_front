<template>
  <div class="app-container">
    <div class="filter-container">
      <!--   搜索选项   -->
      <el-input v-model="listQuery.projectName" placeholder="阶段名" style="width: 100px;" @keyup.enter.native="handleFilter" />
      <!-- <el-select v-model="listQuery.status" placeholder="项目状态" clearable style="width: 110px">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column label="阶段名" prop="stageName" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.stageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款比例"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.paymentRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度要求"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.scheduleTarget }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款要求说明" class-name="status-col" >
        <template slot-scope="{row}">
          <span>{{ row.paymentDemand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="阶段名" prop="stageName">
          <el-input v-model="temp.stageName" />
        </el-form-item>
        <el-form-item label="付款比例" prop="paymentRatio">
          <el-input v-model="temp.paymentRatio" />
        </el-form-item>
        <el-form-item label="进度要求" prop="scheduleTarget">
          <el-input v-model="temp.scheduleTarget" />
        </el-form-item>
        <el-form-item label="付款要求说明" prop="paymentDemand">
          <el-input v-model="temp.paymentDemand" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, createProject, updateProject } from '@/api/project'
import { getDictlist, getDictDetailList } from '@/api/dictionary'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { mockList, explores, supervisors } from './mock'
import areaData from '../../static/json/provinceCity.json'

//const statusList = ['编辑', '提交']
const stageNames = [
  '第一阶段',
  '第二阶段',
  '第三阶段',
  '第四阶段'
]
const paymentRatios = [
  '40%',
  '40%',
  '15%',
  '5%'
]

const List = mockList(stageNames, paymentRatios)

export default {
  name: 'Projects',
  components: { Pagination },
  directives: { waves },
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'info',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        stage: 1,
        page: 1,
        limit: 20,
        projectId: undefined,
        status: undefined,
        projectName: undefined,
        explore: undefined,
        contact: undefined,
        fromDate: undefined,
        toDate: undefined,
        sort: '+id'
      },
      statusOptions: ['编辑', '提交'],
      exploreOptions: explores,
      superviseOptions: supervisors,
      contacts: ['contact1', 'contact2', 'contact3'],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        projectId: undefined,
        stageName: '',
        paymentRatio: '',
        scheduleTarget: '',
        paymentDemand: '',
        projectName: '',
        explore: '',
        contact: '',
        timestamp: new Date(),
        status: '编辑',
        remark: '',
        mineral: undefined,
        type: undefined
      },
      dialogFormVisible: false,
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
      },
      // 字典列表
      dictList: { '机构类型': 1,
        '矿产类型': 3,
        '地域分区': 4,
        '版块类型': 6,
        '矿种': 7,
        '项目类别': 8 },
      // 地区列表
      areaList: [],
      // 矿种列表
      minerals: [],
      // 项目类别
      projectTypes: []
    }
  },
  created() {
    // this.getList()
    this.listLoading = true
    this.list = List
    this.listLoading = false

    this.getDictList()
    console.info(this.dictList)
    console.info(this.dictList.矿种)
    console.info(this.list)
    this.getMinerals()
    this.getAreaList()
    this.getProjectTypes()
  },
  methods: {
    getDictList() {
      getDictlist().then(response => {
        for (const item of response.data) {
          this.dictList[item['name']] = item['id']
        }
      })
    },
    getMinerals() {
      getDictDetailList(this.dictList['矿种']).then(response => {
        for (const item of response.data) {
          this.minerals.push(item['label'])
        }
      })
    },
    getAreaList() {
      this.areaList = areaData['provinces'].map(i => i['name'])
    },
    getProjectTypes() {
      getDictDetailList(this.dictList['项目类别']).then(response => {
        for (const item of response.data) {
          this.projectTypes.push(item['label'])
        }
      })
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
        projectId: undefined,
        projectName: '',
        explore: '',
        contact: '',
        timestamp: new Date(),
        status: '编辑',
        remark: ''
      }
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    // handleDownload() {
    //   this.downloadLoading = true
    //     import('@/vendor/Export2Excel').then(excel => {
    //       const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    //       const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    //       const data = this.formatJson(filterVal, this.list)
    //       excel.export_json_to_excel({
    //         header: tHeader,
    //         data,
    //         filename: 'table-list'
    //       })
    //       this.downloadLoading = false
    //     })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}`
    //     ? 'ascending'
    //     : sort === `-${key}`
    //       ? 'descending'
    //       : ''
    // }
  }
}
</script>

