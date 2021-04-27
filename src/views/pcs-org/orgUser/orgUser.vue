<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        :placeholder="$t('sysuser.username')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.type"
        :placeholder="$t('sysuser.type')"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-input
        v-model="listQuery.id"
        :placeholder="$t('sysuser.id')"
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
        {{ $t('sysuser.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('sysuser.add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('sysuser.export') }}
      </el-button>
    </div>

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

      <el-table-column
        label="用户名"
        min-width="60px"
      >
        <template slot-scope="{row}">
           <span
             class="link-type"
             @click="handleUpdate(row)"
           >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        min-width="60px"
      >
        <template slot-scope="{row}">
           <span
             class="link-type"
             @click="handleUpdate(row)"
           >{{ row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属部门"
        min-width="60px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.dptName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="角色"
        min-width="60px"
      >
        <template slot-scope="{row}">
          <el-tag
            v-for="role in row.roleList">
            {{role}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.status == 1" :type="row.status | statusFilter">
            正常
          </el-tag>
          <el-tag v-if="row.status == 0" :type="row.status | statusFilter">
            终止
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
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
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
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
          :label="$t('sysuser.type')"
          prop="type"
          label-width="80px"
        >
          <el-select
            v-model="temp.roleList"
            multiple
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('sysuser.name')"
          prop="name"
          label-width="80px"
        >
          <el-input
            v-model="temp.truename"
            type="text"
            placeholder="name"
          />
        </el-form-item>
        <el-form-item
          label="所属部门"
          prop="institution"
          label-width="80px"
        >
          <el-input
            v-model="temp.dptName"
            type="text"
            placeholder="部门"
          />
        </el-form-item>
        <el-form-item
          label="$t('sysuser.username')"
          prop="username"
          label-width="80px"
        >
          <el-input
            v-model="temp.username"
            type="text"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item
          :label="$t('sysuser.password')"
          prop="password"
          label-width="80px"
        >
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          label-width="80px"
        >
          <!--          <el-input v-model="temp.confirmPassword" />-->
        </el-form-item>
        <el-form-item
          :label="$t('sysuser.phone')"
          prop="phone"
          label-width="80px"
        >
          <el-input v-model="temp.phoneNumber" />
        </el-form-item>
        <el-form-item
          :label="$t('sysuser.emil')"
          prop="emil"
          label-width="80px"
        >
          <el-input v-model="temp.emil" />
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
  import { fetchList, fetchByName, fetchUser, fetchPv, createUser, updateUser} from '@/api/OrgUser'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Vue from 'vue'
  import Validator from 'vue-validator'

  Vue.use(Validator)

  const calendarTypeOptions = [
    { key: '2', display_name: 'Admin' },
    { key: '1', display_name: 'SuperAdmin' },
    { key: '3', display_name: 'vistor' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'Sysuser',
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
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 0,
          limit: 20,
          id: undefined,
          name: undefined,
          trueName: undefined,
          password: undefined,
          dptId: undefined,
          dptName: undefined,
          isAdmin: undefined,
          status: undefined,
          createDate: undefined,
          roleList:["超级管理员", "管理员"],
          sort: '+id'
        },
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['normal'],
        // temp: {
        //   id: undefined,
        //   name: undefined,
        //   username: undefined,
        //   password: undefined,
        //   confirmPassword: undefined,
        //   institution: undefined,
        //   birthday: new Date(),
        //   title: '',
        //   type: '',
        //   phone: undefined,
        //   emile: undefined,
        //   status: 'normal'
        // },
        temp: {
          id: undefined,
          name: undefined,
          trueName: undefined,
          password: undefined,
          dptId: undefined,
          dptName: undefined,
          isAdmin: undefined,
          status: undefined,
          createDate: undefined,
          roleList:[]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        // rules: {
        //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
        //   name: [{ required: true, message: 'name is required', trigger: 'change' }],
        //   username: [{ required: true, message: 'username is required', trigger: 'change' }],
        //   password: [{ required: true, message: 'password is required', trigger: 'change' }],
        //   confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        //   institution: [{ required: true, message: 'institution is required', trigger: 'change' }]
        // },
        downloadLoading: false
      }
    },
    created() {
      this.listQuery.page = 0
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.content
          this.list.roleList = ["超级管理员","管理员"]
          this.total = response.data.totalElements
          console.log(this.list)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        })
      },
      getById(){
        this.listLoading = true
        //console.log(this.listQuery.id)
        fetchUser(this.listQuery.id).then(response =>{
          console.log("id"+response)
          this.list = response.data
          //this.total = response.data.data.totalElements
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        })
      },
      getByName(){ this.listLoading = true

        fetchByName(this.listQuery.username).then(response =>{
          this.listLoading = true
          this.list = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        })},
      handleFilter() {
        //console.log(this.listQuery.id)
        if(this.listQuery.id){this.getById()}
        else if(this.listQuery.username){this.getByName()}

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
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'normal',
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
        console.log(this.temp)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            //this.temp.author = 'vue-element-admin'
            createUser(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
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
            updateUser(tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
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
      }
    }
  }
</script>
