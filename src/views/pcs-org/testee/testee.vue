<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.trueName"
        placeholder="姓名"
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
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.dptId"
        placeholder="部门"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in this.dptList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.personNumber"
        placeholder="学号/工号"
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

<!--      <el-button  @click="uploadDialogFormVisible = true"-->
<!--                  v-waves-->
<!--                 class="filter-item"-->
<!--                 style="margin-left: 10px;"-->
<!--                 type="primary"-->
<!--                 icon="el-icon-upload">-->
<!--        导入-->
<!--      </el-button>-->
      <span >
        <upload-excel-component v-waves class="filter-item"
                                :on-success="handleSuccess" :before-upload="beforeUpload" />
      </span>
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
        label="学号/工号"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.personNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份证号"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.residentId}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户类型"
        min-width="60px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.sex | statusFilter">
            {{ row.sex }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="紧急联系人手机"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.contactsPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag  :type="row.status | statusFilter">
            {{row.status}}
          </el-tag>
<!--          <el-tag v-if="row.status == 0" :type="row.status | statusFilter">-->
<!--            终止-->
<!--          </el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="400"
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
            v-if="row.status!='终止'"
            size="mini"
            type="danger"
            @click="handleAbandon(row)"
          >
            废弃
          </el-button>
          <el-button
            v-else
            size="mini"
            type="info"
            @click="handleAbandon(row)"
            disabled
          >
            废弃
          </el-button>
          <el-button
            v-if="row.status!='正常'"
            size="mini"
            type="success"
            @click="handleEnable(row)"
          >
            启用
          </el-button>
          <el-button
            v-else
            size="mini"
            type="info"
            @click="handleAbandon(row)"
            disabled
          >
            启用
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="small"
            type="primary"
            @click="resetPassword(row)"
          >
            恢复密码
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
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:60px;"
      >

        <el-form-item
          label="真实姓名"
          prop="name"
          label-width="80px"
        >
          <el-input
            v-model="temp.trueName"
            type="text"
            placeholder="姓名"
          />
        </el-form-item>

        <el-form-item
          label="学号/工号"
          label-width="80px"
        >
          <el-input
            v-model="temp.personNumber"
            type="text"
            placeholder="学号/工号"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-tree ref="tree" check-strictly= true
                   :data="dptList" :props="defaultProps"
                   show-checkbox node-key="id"
                   @check-change="handleClick"  @node-click="nodeClick"/>
        </el-form-item>
        <el-form-item
          label="用户名"
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
          label="身份证号"
          label-width="80px"
        >
          <el-input
            v-model="temp.residentId"
            type="text"
            placeholder="身份证号"
          />
        </el-form-item>
        <el-form-item
          label="类型"
          label-width="80px"
        >
          <el-select v-model="temp.type" clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="出生日期"
          label-width="80px"
          >
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="性别"
          label-width="80px"
        >
          <el-radio v-model="temp.sex" label="男" >男</el-radio>
          <el-radio v-model="temp.sex" label="女" >女</el-radio>
        </el-form-item>
        <el-form-item
          label="籍贯"
          label-width="80px"
        >
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="民族"
          label-width="80px"
        >
          <el-input
            v-model="temp.nation"
            type="text"
            placeholder="民族"
          />
        </el-form-item>
        <el-form-item
          label="紧急联系人手机"
          prop="phone"
          label-width="80px"
        >
          <el-input v-model="temp.contactsPhone"/>
        </el-form-item>
        <el-form-item
          label="qq号"
          label-width="80px"
        >
          <el-input v-model="temp.qq" />
        </el-form-item>
        <el-form-item
          label="微信号"
          label-width="80px"
        >
          <el-input v-model="temp.wechat" />
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          prop="emil"
          label-width="80px"
        >
          <el-input v-model="temp.emil" />
        </el-form-item>
        <el-form-item
          label="入学(入职)时间"
          label-width="80px"
        >
          <el-date-picker
              v-model="temp.admissionDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item
          label="是否城镇"
          label-width="80px"
        >
          <el-radio v-model="temp.isUrban" label="是" >是</el-radio>
          <el-radio v-model="temp.isUrban" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否住宿(学生)"
          label-width="80px"
        >
          <el-radio v-model="temp.isAccommodation" label="是" >是</el-radio>
          <el-radio v-model="temp.isAccommodation" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否单亲"
          label-width="80px"
        >
          <el-radio v-model="temp.isSingleParent" label="是" >是</el-radio>
          <el-radio v-model="temp.isSingleParent" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否孤儿"
          label-width="80px"
        >
          <el-radio v-model="temp.isOrphan" label="是" >是</el-radio>
          <el-radio v-model="temp.isOrphan" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="婚姻状态"
          label-width="80px"
        >
          <el-select v-model="temp.maritalStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in maritalStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否与父母同住"
          label-width="80px"
        >
          <el-radio v-model="temp.isLiveWithParent" label="是" >是</el-radio>
          <el-radio v-model="temp.isLiveWithParent" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="是否独生子女住"
          label-width="80px"
        >
          <el-radio v-model="temp.isOnlyChild" label="是" >是</el-radio>
          <el-radio v-model="temp.isOnlyChild" label="否" >否</el-radio>
        </el-form-item>
        <el-form-item
          label="家庭排行"
          label-width="80px"
        >
          <el-input v-model="temp.familyRanking" />
        </el-form-item>
        <el-form-item
          label="家庭住址"
          label-width="80px"
        >
          <el-input placeholder="最长100个中文汉字" v-model="temp.address" />
        </el-form-item>
        <el-form-item
          label="父亲姓名"
          label-width="80px"
        >
          <el-input v-model="temp.fatherName" />
        </el-form-item>
        <el-form-item
          label="父亲手机号"
          label-width="80px"
        >
          <el-input v-model="temp.fatherPhone" />
        </el-form-item>
        <el-form-item
          label="母亲姓名"
          label-width="80px"
        >
          <el-input v-model="temp.motherNmae" />
        </el-form-item>
        <el-form-item
          label="母亲手机号"
          label-width="80px"
        >
          <el-input v-model="temp.motherPhone" />
        </el-form-item>
        <el-form-item
          label="学习经历或工作奖惩情况"
          label-width="80px"
        >
          <el-input type="textarea"
                    :rows="3"
                    v-model="temp.rewardsAndPunishments"
                    placeholder="最长1000个中文汉字"/>
        </el-form-item>
        <el-form-item
          label="兴趣爱好"
          label-width="80px"
        >
          <el-input type="textarea"
                    :rows="3"
                    v-model="temp.hobby"
                    placeholder="最长1000个中文汉字"/>
        </el-form-item>
        <el-form-item
          label="兄妹情况"
          label-width="80px"
        >
          <el-input type="textarea"
                    :rows="3"
                    v-model="temp.brotherSister"
                    placeholder="最长1000个中文汉字"/>
        </el-form-item>
        <el-form-item
          label="照片"
          label-width="80px"
        >
          <el-input v-model="temp.imgUrl"/>
        </el-form-item>
        <el-form-item
          label="个人简介"
          label-width="80px"
        >
          <el-input type="textarea"
                    :rows="3"
                    v-model="temp.resume"
                    placeholder="最长1000个中文汉字"/>
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
  import {upload, fetchList, fetchByName, fetchTestee, fetchPv, createTestee, updateTestee, abandonTestee,enableTestee,resetPassword} from '@/api/testee'
  import {fetchTree,dptList} from "@/api/OrgDpt";
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Vue from 'vue'
  import Validator from 'vue-validator'
  import { provinceAndCityData, regionData, CodeToText, TextToCode } from 'element-china-area-data'
  import UploadExcelComponent from './upload-excel'


  Vue.use(Validator)

  const calendarTypeOptions = [
    { key: '学生', display_name: '学生' },
    { key: '教师', display_name: '教师' },
  ]
  const calendarTypeOptions2 = [
    { key: '1001', display_name: '北京邮电大学' },
    { key: '1002', display_name: '软件学院' },
    { key: '1004', display_name: '软件工程学硕2018级' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'testee',
    components: { Pagination, UploadExcelComponent },
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

      return {
        uploadDialogFormVisible: false,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        //照片
        doUpload: false,
        //dialogImageUrl
        //addKeyPersonForm
        testee: {
          username: undefined,
          trueName: undefined,
          password: undefined,
          personNumber: undefined,
          residentId: undefined,
          dptName: undefined,
          dptId: undefined,
          type: undefined,
          birthday: undefined,
          sex: undefined,
          province:undefined,
          city: undefined,
          nation: undefined,
          contactsPhone: undefined,
          qq: undefined,
          wechat: undefined,
          emil: undefined,
          admissionDate: undefined,
          isUrban: undefined,
          isAccommodation: undefined,
          isSingleParent: undefined,
          isOrphan: undefined,
          maritalStatus: undefined,
          isLiveWithParent: undefined,
          isOnlyChild: undefined,
          familyRanking: undefined,
          address: undefined,
          fatherName: undefined,
          fatherPhone: undefined,
          motherNmae:  undefined,
          motherPhone: undefined,
          rewardsAndPunishments: undefined,
          hobby: undefined,
          speciality: undefined,
          brotherSister: undefined,
          imgUrl: undefined,
          resume: undefined,
          status: undefined,
          createDate: undefined,
        },
        testeeList: [],
        dptList: undefined,
        checkedId: undefined,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          trueName: undefined,
          type: undefined,
          dptId: undefined,
          personNumber: undefined
          // sort: '+id'
        },
        calendarTypeOptions,
        calendarTypeOptions2,
        typeOptions: [{
          value: '学生',
          label: '学生'
        }, {
          value: '教师',
          label: '教师'
        }, {
          value: '工程师',
          label: '工程师'
        }, {
          value: '管理人员',
          label: '管理人员'
        }, {
          value: '其他',
          label: '其他'
        }],
        maritalStatusOptions: [{
          value: '未婚',
          label: '未婚'
        }, {
          value: '已婚',
          label: '已婚'
        }, {
          value: '离异',
          label: '离异'
        }, {
          value: '丧偶',
          label: '丧偶'
        }],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['normal'],
        //行政区划
        options: provinceAndCityData,
        selectedOptions: [],
        temp: {
          username: undefined,
          trueName: undefined,
          password: undefined,
          personNumber: undefined,
          residentId: undefined,
          dptId: undefined,
          type: undefined,
          birthday: undefined,
          sex: undefined,
          province:undefined,
          city: undefined,
          nation: undefined,
          contactsPhone: undefined,
          qq: undefined,
          wechat: undefined,
          emil: undefined,
          admissionDate: undefined,
          isUrban: undefined,
          isAccommodation: undefined,
          isSingleParent: undefined,
          isOrphan: undefined,
          maritalStatus: undefined,
          isLiveWithParent: undefined,
          isOnlyChild: undefined,
          familyRanking: undefined,
          address: undefined,
          fatherName: undefined,
          fatherPhone: undefined,
          motherNmae:  undefined,
          motherPhone: undefined,
          rewardsAndPunishments: undefined,
          hobby: undefined,
          speciality: undefined,
          brotherSister: undefined,
          imgUrl: undefined,
          resume: undefined,
          status: undefined,
          createDate: undefined,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
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
      this.listQuery.page = 1
      this.getList()
      this.getOrgList()
    },
    methods: {
      //行政区划
      handleChange (value) {
        this.temp.province = CodeToText[value[0]]
        this.temp.city = CodeToText[value[1]]
        this.temp.district = CodeToText[value[2]]
      },

//树形节点单选控制
      handleClick(data, checked, node){
        if(checked == true){
          this.checkedId = data.id;
          this.$refs.tree.setCheckedNodes([data]);
        }
      },
      nodeClick(data,checked,node){
        this.checkedId = data.id
        this.$refs.tree.setCheckedNodes([data]);

      },
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          //console.log(response)
          this.list = response.data.content
          this.total = response.data.totalElements
          //console.log(this.list)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        })
      },
      getOrgList() {
        dptList().then(response =>{
          this.dptList = response.data
        })
      },
      getById(){
        this.listLoading = true
        //console.log(this.listQuery.id)
        fetchTestee(this.listQuery.id).then(response =>{
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
          remark: '',
          timestamp: new Date(),
          title: '',
          status: '正常',
          dptId: undefined,
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
            // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            //this.temp.author = 'vue-element-admin'
            createTestee(this.temp).then(() => {
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
            createTestee(tempData).then(() => {
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
      handleAbandon(row){
        abandonTestee(row.id).then(()=>{
          this.getList()
          this.$notify({
            title: '废弃成功',
            message: '该用户已废弃 ',
            type: 'success',
            duration: 2000
          })
        })
      },
      handleEnable(row){
        enableTestee(row.id).then(()=>{
          this.getList()
          this.$notify({
            title: '启用成功',
            message: '该用户已启用 ',
            type: 'success',
            duration: 2000
          })
        })
      },
      resetPassword(row){
        resetPassword(row.id).then(()=>{
          this.getList()
          this.$notify({
            title: '密码重置成功',
            message: '密码为初始密码(紧急联系人手机号) ',
            type: 'success',
            duration: 4000
          })
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



      //上传EXCEL
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: '上传文件大小不能超过1M',
          type: 'warning'
        })
        return false
      },
      handleSuccess({ results, header }) {
        this.tableData = results;
        this.handleExcelString();
      },
      //处理批量导入的字符串
      handleExcelString() {
        this.testeeList = [];
        let flag = true
        let sexArr = new Array(['男','女'])
        let msg = ""
        for (var i = 0; i < this.tableData.length; i++) {
          this.addTestee()
          //装入被试用户基本信息
          // console.log(this.tableData[i]['用户名'])
          this.testeeList[i].username = this.tableData[i]['用户名'];
          if(this.testeeList[i].username == null){
            flag = false
            msg = "第"+i+"行用户名为空"
            break
          }
          this.testeeList[i].trueName = this.tableData[i]['姓名'];
          if(this.testeeList[i].trueName == null){
            flag = false
            msg = "第"+i+"行姓名为空"
            break
          }
          this.testeeList[i].personNumber = this.tableData[i]['学号/工作证号'];
          if(this.testeeList[i].personNumber == null || isNaN(this.testeeList[i].personNumber)) {
            flag = false
            msg = "第"+i+"行学号/工作证号不合法"
            break
          }
          this.testeeList[i].dptName = this.tableData[i]["部门"]
          this.testeeList[i].residentId = this.tableData[i]['身份证号'];
          if(this.IdentityCodeValid(this.testeeList[i].residentId)) {
            flag = false
            msg = "第"+i+"行身份证号不合法"
            break
          }
          this.testeeList[i].type = this.tableData[i]['用户类型'];
          this.testeeList[i].birthday = this.tableData[i]['出生日期'];
          this.testeeList[i].sex = this.tableData[i]['性别'];
          if(!(this.testeeList[i].sex == "男" || this.testeeList[i].sex == "女")){
            flag = false
            msg = "第"+i+"行性别不是男/女"
            break
          }
          // this.testee = this.tableData[i]['籍贯'];
          this.testeeList[i].nation = this.tableData[i]['民族'];
          this.testeeList[i].contactsPhone = this.tableData[i]['紧急联系人手机'];
          if(!this.isPoneAvailable(this.testeeList[i].contactsPhone)&&!this.isTelAvailable(this.testeeList[i].contactsPhone)){
            flag = false
            msg = "第"+i+"行紧急联系人手机不合法"
            break
          }
          this.testeeList[i].qq = this.tableData[i]['QQ号码'];
          this.testeeList[i].wechat = this.tableData[i]['微信号'];
          this.testeeList[i].emil = this.tableData[i]['电子邮箱'];
          this.testeeList[i].admissionDate = this.tableData[i]['入学（入职）'];
          this.testeeList[i].isUrban = this.tableData[i]['是否城镇'];
          this.testeeList[i].isAccommodation = this.tableData[i]['是否住宿（学生）'];
          this.testeeList[i].isSingleParent = this.tableData[i]['是否单亲'];
          this.testeeList[i].isOrphan = this.tableData[i]['是否孤儿'];
          this.testeeList[i].status = this.tableData[i]['婚姻状态'];
          this.testeeList[i].isLiveWithParent = this.tableData[i]['是否与父母同住'];
          this.testeeList[i].isOnlyChild = this.tableData[i]['是否独生子女'];
          this.testeeList[i].address = this.tableData[i]['家庭住址'];
          this.testeeList[i].fatherName = this.tableData[i]['父亲姓名'];
          this.testeeList[i].fatherPhone = this.tableData[i]['父亲联系方式'];
          this.testeeList[i].motherNmae = this.tableData[i]['母亲姓名'];
          this.testeeList[i].motherPhone = this.tableData[i]['母亲联系方式'];
          this.testeeList[i].rewardsAndPunishments = this.tableData[i]['学习或工作奖惩情况'];
          this.testeeList[i].hobby = this.tableData[i]['兴趣爱好'];
          this.testeeList[i].speciality = this.tableData[i]['特长'];
          this.testeeList[i].resume = this.tableData[i]['个人描述'];
          const address = this.tableData[i]['籍贯'];
          let arr = this.getArea(address)
          if(arr.Province=="")
            this.testeeList[i].province = arr.City
          else
            this.testeeList[i].province = arr.Province
          this.testeeList[i].city = arr.City
        }
        if(flag == false){
          this.$notify({
          title: '失败',
          message: '存在不合法字段，'+msg,
          type: 'warning',
          duration: 2000
        })
          return
        }

        console.log(this.testeeList)
        upload(this.testeeList).then(response=>{
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })

      },
      addTestee(){
        this.testeeList.push({
            username: undefined,
            trueName: undefined,
            password: undefined,
            personNumber: undefined,
            residentId: undefined,
            dptName: undefined,
            dptId: undefined,
            type: undefined,
            birthday: undefined,
            sex: undefined,
            province:undefined,
            city: undefined,
            nation: undefined,
            contactsPhone: undefined,
            qq: undefined,
            wechat: undefined,
            emil: undefined,
            admissionDate: undefined,
            isUrban: undefined,
            isAccommodation: undefined,
            isSingleParent: undefined,
            isOrphan: undefined,
            maritalStatus: undefined,
            isLiveWithParent: undefined,
            isOnlyChild: undefined,
            familyRanking: undefined,
            address: undefined,
            fatherName: undefined,
            fatherPhone: undefined,
            motherNmae:  undefined,
            motherPhone: undefined,
            rewardsAndPunishments: undefined,
            hobby: undefined,
            speciality: undefined,
            brotherSister: undefined,
            imgUrl: undefined,
            resume: undefined,
            status: undefined,
            createDate: undefined,

        })
      },
      /**
       * @return {boolean}验证身份证
       */
      IdentityCodeValid(code) {
        var city = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江 ",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北 ",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏 ",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外 "
        };
        var tip = "";
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
          tip = "身份证号格式错误";
          pass = false;
        } else if (!city[code.substr(0, 2)]) {
          tip = "地址编码错误";
          pass = false;
        } else {
          //18位身份证需要验证最后一位校验位
          if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i ++) {
              ai = code[i];
              wi = factor[i];
              sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
              tip = "校验位错误";
              pass = false;
            }
          }
        }
        //if(!pass) alert(tip);
        return pass;
      },
      // 判断是否为手机号
      isPoneAvailable(pone) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(pone)) {
          return false;
        } else {
          return true;
        }
      },
      // 判断是否为电话号码
      isTelAvailable(tel) {
        var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (!myreg.test(tel)) {
          return false;
        } else {
          return true;
        }
      },
     getArea(str) {
        let area = {}
        let index11 = 0
        let index1 = str.indexOf("省")
        if (index1 == -1) {
          index11 = str.indexOf("自治区")
          if (index11 != -1) {
            area.Province = str.substring(0, index11 + 3)
          } else {
            area.Province = str.substring(0, 0)
          }
        } else {
          area.Province = str.substring(0, index1 + 1)
        }

        let index2 = str.indexOf("市")
        if (index11 == -1) {
          area.City = str.substring(index11 + 1, index2 + 1)
        } else {
          if (index11 == 0) {
            area.City = str.substring(index1 + 1, index2 + 1)
          } else {
            area.City = str.substring(index11 + 3, index2 + 1)
          }
        }

        let index3 = str.lastIndexOf("区")
        if (index3 == -1) {
          index3 = str.indexOf("县")
          area.Country = str.substring(index2 + 1, index3 + 1)
        } else {
          area.Country = str.substring(index2 + 1, index3 + 1)
        }
        return area;
      },
      //处理照片

      handlePictureCardPreview (file) {
        this.temp.imgUrl = file.url
        this.doUpload = true
        this.$refs['dataForm'].validateField('file')
      },

      beforeuploadImg (file) {
        // this.formData.append('file', file)
        this.temp.imgUrl = file.url
        return false

      }

    }
  }
</script>
<style>
  .add-keyperson-dialog .upload-img-form{
    width: 1rem;
    height: 1.35rem;
    position: absolute;
    right:0.2rem;
    top:0rem;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
  }
    .add-keyperson-dialog .upload-img{
    width: 1rem;
    height: 1.35rem;
    overflow:hidden;
  }
    .add-keyperson-dialog .upload-img:hover {
    border-color: #409EFF;
    color: #409EFF;
  }
    .add-keyperson-dialog .avatar-uploader-icon {
    position:relative;
    z-index:100;
    font-size: 0.3rem;
    color: #8c939d;
    width: 0.9rem;
    height: 1.35rem;
    line-height: 1rem;
    text-align: center;
  }
    .add-keyperson-dialog .upload-img:hover .avatar-uploader-icon {
    color: #409EFF
  }
    .add-keyperson-dialog .avatar {
    width: 100%;
    height: auto;
    display: block;
  }
    .add-keyperson-dialog .upload__tip {
    font-size: 0.13rem;
    text-align: center;
    position: relative;
    z-index:10;
    top: -0.7rem;
  }

</style>
