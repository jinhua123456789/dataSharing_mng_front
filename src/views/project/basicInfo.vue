<template>
  <div class="app-container">
    <div class="filter-container">
      <!--   搜索选项   -->
      <el-input v-model="listQuery.projectName" placeholder="项目名称" style="width: 100px;" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="项目状态" clearable style="width: 110px">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-table-column label="项目编号" prop="projectId" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.projectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批复年份" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('2019') }}</span>
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
      <el-table-column label="立项技术资料（A卷）" width="110" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status2 }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="立项技术资料（B卷）" width="110" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status2 }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="立项论证专家意见书（技术）" width="110" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status2 }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="立项论证专家意见书（经济）" width="110" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary">
            <!-- todo          <el-tag :type="row.status | statusFilter">-->
            {{ row.status2 }}
          </el-button>
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
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleModifyStatus(row,'published')">
            提交
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
        <el-form-item label="项目编号" prop="projectId">
          <el-input v-model="temp.projectId" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="temp.projectName" />
        </el-form-item>
        <el-form-item label="项目类别" prop="location">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in projectTypes" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="批复年份" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="year"
            placeholder="选择年"
          />
        </el-form-item>
        <el-form-item label="所在地区" prop="location">
          <el-select v-model="temp.location" class="filter-item" placeholder="Please select">
            <el-option v-for="item in areaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="矿种" prop="location">
          <el-select v-model="temp.mineral" class="filter-item" placeholder="Please select">
            <el-option v-for="item in minerals" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="勘察单位" prop="explore">
          <el-select v-model="temp.explore" class="filter-item" placeholder="Please select">
            <el-option v-for="item in exploreOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="勘察负责人" prop="exploreContact">
          <el-select v-model="temp.exploreContact" class="filter-item" placeholder="Please select">
            <el-option v-for="item in contacts" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="监理单位" prop="supervisor">
          <el-select v-model="temp.supervisor" class="filter-item" placeholder="Please select">
            <el-option v-for="item in superviseOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="监理负责人" prop="supervisorContact">
          <el-select v-model="temp.supervisorContact" class="filter-item" placeholder="Please select">
            <el-option v-for="item in contacts" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="探矿权人" prop="tkqr">
          <el-input v-model="temp.tkqr" />
        </el-form-item>
        <!--        文件上传-->
        <el-form-item label="探矿权证" prop="tkqz">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="项目总预算" prop="budget">
          <el-input v-model="temp.budget" />
        </el-form-item>
        <!--        文件上传-->
        <el-form-item label="立项专家意见（经济）" prop="lxzjyjjj">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <!--        文件上传-->
        <el-form-item label="立项专家意见（技术）" prop="lxzjyjjs">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="项目描述" prop="remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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

const statusList = ['编辑', '提交']
const projectNames = [
  '甘肃省高台县红山地区铀矿普查',
  '甘肃省礼县磨子坝地区铀矿普查',
  '甘肃省礼县吴茶坝地区铀矿普查',
  '甘肃省肃北县红珊瑚铜铁矿普查',
  '青海省都兰县五龙沟西金矿普查'
]
const List = mockList(statusList, projectNames)

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

