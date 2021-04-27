<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.username"
        :placeholder="$t('sysuser.username')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->
      <!-- <el-select
        v-model="listQuery.specialty"
        placeholder="角色"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in this.roleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select> -->
      <el-input
        v-model="listQuery.specialty"
        placeholder="擅长领域"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.trueName"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
<!--      <el-button-->
<!--        v-waves-->
<!--        :loading="downloadLoading"-->
<!--        class="filter-item"-->
<!--        type="primary"-->
<!--        icon="el-icon-download"-->
<!--        @click="handleDownload"-->
<!--      >-->
<!--&lt;!&ndash;        {{ $t('sysuser.export') }}&ndash;&gt;-->
<!--        导入-->
<!--      </el-button>-->
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
<!--      <el-table-column-->
<!--        :label="$t('sysuser.id')"-->
<!--        prop="id"-->
<!--        sortable="custom"-->
<!--        align="center"-->
<!--        width="150px"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.id }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        :label="$t('sysuser.username')"
        min-width="60px"
      >
        <template slot-scope="{row}">
           <span
             class="link-type"
             @click="handleUpdate(row)"
           >{{ row.counselorEntity.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('sysuser.name')"
        min-width="60px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.counselorEntity.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工作经验"
        min-width="100px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.counselorEntity.workingExperience }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        min-width="60px"
      >
        <template slot-scope="{row}">
            <span>{{ row.counselorEntity.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.counselorEntity.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="450"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.counselorEntity.status!='废除'"
            size="mini"
            type="danger"
            @click="handleDelete(row.counselorEntity.id)"
          >
            废除
          </el-button>
          <el-button
            v-else
            size="mini"
            type="info"
            disabled
          >
            废除
          </el-button>
          <el-button
            v-if="row.counselorEntity.status!='审核通过' && row.counselorEntity.status!='审核不通过'"
            size="small"
            type="success"
            @click="handleEnable(row.counselorEntity.id)"
          >
            审核通过
          </el-button>
          <el-button
            v-else
            size="small"
            type="info"
            disabled
          >
            审核通过
          </el-button>
          <el-button
            v-if="row.counselorEntity.status!='审核通过' && row.counselorEntity.status!='审核不通过'"
            size="small"
            type="success"
            @click="handleDisable(row.counselorEntity.id)"
          >
            审核不通过
          </el-button>
          <el-button
            v-else
            size="small"
            type="info"
            disabled
          >
            审核不通过
          </el-button>
          <!-- <el-button
            v-if="row.status!='删除'"
            size="small"
            type="primary"
            @click="resetPassword(row.id)"
          >
            恢复密码
          </el-button> -->
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:60px;"
      >
        <el-form-item
          :label="$t('sysuser.username')"
          prop="username"
          label-width="80px"
        >
          <el-input
            v-model="temp.username"
            type="text"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="trueName"
          label-width="80px"
        >
          <el-input
            v-model="temp.trueName"
            type="text"
            placeholder="姓名"
          />
        </el-form-item>

        <el-form-item
          label="性别"
          prop="gender"
          label-width="80px"
        >
          <el-select
            v-model="temp.gender"
            placeholder="请选择"
          >
            <el-option
              v-for="item in this.genders"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="部门"
          prop="institution"
          label-width="80px"
        > -->
<!--          <el-select-->
<!--            v-model="temp.deptId"-->
<!--            placeholder="Please select"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in this.orgList"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
          <!-- <el-input
            v-model="temp.dptName"
            type="text"
            placeholder="部门名"/>
        </el-form-item> -->
        <el-form-item
          :label="$t('sysuser.phone')"
          prop="phoneNumber"
          label-width="80px"
        >
          <el-input v-model="temp.phoneNumber" />
        </el-form-item>
        <el-form-item
          :label="$t('sysuser.emil')"
          label-width="80px"
          prop="email"
        >
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item
          label="专长"
          label-width="80px"
          prop="specialty"
        >
          <el-input v-model="temp.specialty" />
        </el-form-item>
        <el-form-item
          label="工作经验"
          label-width="80px"
          prop="workingExperience"
        >
          <el-input v-model="temp.workingExperience" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('sysuser.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('sysuser.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >{{ $t('sysuser.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createConsultTeacher, updateConsultTeacher,fetchSysuser,fetchSysuserByName, abandonSysuser,enable,disable, resetPassword} from '@/api/consult'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Vue from 'vue'
import Validator from 'vue-validator'
import {getRoleList} from "../../api/role";
import {orgList} from "../../api/institution";
import {validatePhone,validUsername2,validateEMail} from "../../utils/validate";


Vue.use(Validator)

const calendarTypeOptions = [
  { id: '2', display_name: 'Admin' },
  { id: '1', display_name: 'SuperAdmin' },
  { id: '3', display_name: 'vistor' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ConsultTeacherManage',
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
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },

  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      genders: [{name: '男',id : '男'},{name: '女',id : '女'}],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      roleList: undefined,
      orgList: undefined,
      listQuery: {
        page: 0,
        // limit: 20,
        size: 10,
        id: undefined,
        username: undefined,
        trueName: undefined,
        password: undefined,
        institution: undefined,
        roleId: undefined,
        specialty: ''
        // sort: '+id'
      },
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['normal'],

      temp: {
        id: undefined,
        username: undefined,
        trueName: undefined,
        // password: undefined,
        // deptId: undefined,
        // dptName: undefined,
        phoneNumber: undefined,
        email: undefined,
        // age: undefined,
        gender: '',
        specialty: '',
        workingExperience: ''
        // roleIds: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' },{validator: validUsername2, trigger: 'blur'}],
        trueName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }, { type: 'string', max: 30, message: '最长30个汉字', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请填写手机号', trigger: 'blur' },
          { type: 'string', min: 11, message: '手机号不允许小于11位', trigger: 'blur' }
          ,{validator: validatePhone, trigger: 'blur'}],
        /* roleIds: [{ required: true, message: '请选择一个角色', trigger: ['blur','change'] }], */
        emil: [{ required: false, trigger: 'blur' },{validator: validateEMail,trigger:['blur','change'] }],
        },



      downloadLoading: false
    }
  },
  created() {
    this.listQuery.page = 0
    this.getList()
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      getRoleList().then(response =>{
        this.roleList = response.data
        //console.log(this.roleList)
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getOrgList() {
      orgList().then(response =>{
        this.orgList = response
      })
    },
    getById(){
      this.listLoading = true
      fetchSysuser(this.listQuery.id).then(response =>{
        this.list = response.data
        //this.total = response.data.data.totalElements
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })
    },
    getByName(){ this.listLoading = true

      fetchSysuserByName(this.listQuery.username).then(response =>{
        this.listLoading = true
        this.list = response.data
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 100)
      })},
    handleFilter() {
      //console.log(this.listQuery.id)
      // if(this.listQuery.id){this.getById()}
      // else if(this.listQuery.username){this.getByName()}
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
        username: undefined,
        trueName: undefined,
        // password: undefined,
        // deptId: undefined,
        // dptName: undefined,
        phoneNumber: undefined,
        email: undefined,
        // age: undefined,
        gender: '',
        specialty: '',
        workingExperience: ''
        // roleIds: undefined
        /* id: undefined,
        timestamp: new Date(),
        phoneNumber: undefined,
        dptId: undefined,
        status: '正常',
        type: '',
        roleIds: [],
        roleList: undefined */
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
      /* let s = []
      for(var i = 0; i < this.temp.roleIds.length; i++) {
        s.push(this.temp.roleIds[i])
      }
      this.temp.roleIds = s */
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createConsultTeacher(this.temp).then(response => {
            // this.list.unshift(response.data)
            if(response.data === "0"){
              this.getList()
              this.getOrgList()
              this.getRoleList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            }else{
              this.dialogFormVisible = false
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'warning',
                duration: 2000
              })

            }
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
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateConsultTeacher(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {
      abandonSysuser(id).then(()=>{
        this.getList()
        this.$notify({
          title: '成功',
          message: '废除成功',
          type: 'success',
          duration: 2000
        })})

      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    handleEnable(id) {
      enable(id).then(()=>{
        this.getList()
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })})

      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    handleDisable(id) {
      disable(id).then(()=>{
        this.getList()
        this.$notify({
          title: '成功',
          message: '启用成功',
          type: 'success',
          duration: 2000
        })})

      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    resetPassword(id) {
      resetPassword(id).then(()=>{
        this.getList()
        this.$notify({
          title: '成功',
          message: '密码已重置，默认为联系方式',
          type: 'success',
          duration: 2000
        })})

      // const index = this.list.indexOf(row)
      // this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'username', 'name', 'institution', 'type', 'phone', 'emil']
          const filterVal = ['id', 'username', 'name', 'institution', 'type', 'phone', 'emil']
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
    },


  }
}
</script>
