<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        class="filter-item"
        placeholder="输入计划名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        class="filter-item"
        clearable
        placeholder="选择量表"
        style="width: 150px"
      >
        <el-option
          v-for="item in scaleOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-tree
        class="filter-tree"
        :data="deptTree"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        ref="tree1"
        highlight-current>
      </el-tree>
      <el-button
        v-waves
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        icon="el-icon-edit"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >
        添加群体计划
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        icon="el-icon-download"
        type="primary"
        @click="handleDownload"
      >
        下载测评计划
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      stripe
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        align="center"
        label="计划名称"
        width="200px"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.name }}</span>
          <!--<el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creatTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建人"
        width="110px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creater }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="生效时间"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="失效时间"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="测评对象"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.groupsName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="计划测评人数"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.planPersonNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前完成测评人数"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="status-col"
        label="状态"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.state| statusFilter">
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
        width="230"
      >
        <template slot-scope="{row}">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
          <el-button
            v-if="row.state==='未发布'"
            size="mini"
            type="success"
            @click="handlePublish(row.id)"
          >
            发布
          </el-button>
          <el-button
            v-else
            size="mini"
            type="info"
            disabled
          >
            发布
          </el-button>
          <el-button
            v-if="row.state==='未发布'"
            size="mini"
            type="danger"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
          <el-button
            v-else
            size="mini"
            type="info"
            disabled
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :total="total"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="测评计划名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <span>"选择测评对象："</span>
        <el-tree
          class="filter-tree"
          :data="deptTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          ref="tree"
          highlight-current>
        </el-tree>
        <el-form-item
          label="测评量表"
          prop="scale"
        >
          <el-select
            v-model="temp.scaleId"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in scaleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="生效时间"
          prop="timestamp"
        >
          <el-date-picker
            v-model="temp.startTime"
            placeholder="Please pick a date"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item
          label="失效时间"
          prop="timestamp"
        >
          <el-date-picker
            v-model="temp.finishTime"
            placeholder="Please pick a date"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="Please input"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false;resetTemp()">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, createPlan, updatePlan,deletePlan,publishPlan,getDeptTree,getScaleTree} from '@/api/evaluationplan'
  import waves from '@/directive/waves' // Waves directive
  import axios from 'axios'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  // arr to obj ,such as { CN : "China", US : "USA" }
  export default {
    name: 'EvaluationPlan',
    components: {Pagination},
    directives: {waves},
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
        deptTree: null,
        total: 0,
        listLoading: false,
        leafOnly:true,
        nodelist:null,
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          name: undefined,
          state: undefined,
          scaleId: undefined
        },
        scaleOptions:null,
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id:undefined,
          name: '',
          groupids:[],
          scaleId: undefined,
          startTime: undefined,
          finishTime: undefined,
          description: '',
          createTime: undefined,
          groupName:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        rules: {
          name: [{required: true, message: 'planname is required', trigger: 'change'}]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
      this.getDept()
      this.getScale()
    },
    methods: {

      getList() {
        this.listLoading = true
        console.log("iqagheoi")
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 10)
        }).catch((error=>{
          console.log("qingiushbbai")
        }))
      },

      getDept() {
        getDeptTree().then(response => {
          this.deptTree = response.data.data
          console.log("部门树"+ JSON.stringify(this.deptTree[0].name))
        })
      },

      getScale() {
        getScaleTree(1).then(response => {
          this.scaleOptions= response.data.data.scaleIdAndNameEntityList
          console.log("量表"+ JSON.stringify(this.scaleOptions))
        })
      },

      getKeys() {
        this.temp.groupids=(this.$refs.tree.getCheckedKeys(this.leafOnly));
      },
      getNodeNmaes(){
        this.temp.groupName=""
        this.nodelist=this.$refs.tree.getCheckedNodes(this.listLoading)
        this.nodelist.forEach(item=>{
          this.temp.groupName+=item.name
        })
      },
      handleFilter() {
        this.listQuery.page = 1
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
        const {prop, order} = data
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
          id:undefined,
          name: '',
          groupids:[],
          scaleId: undefined,
          startTime: undefined,
          finishTime: undefined,
          description: '',
          createTime: undefined,
          groupName:''
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
        this.getKeys()
        this.getNodeNmaes()
        console.log(this.temp.groupids)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp)
            createPlan(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.resetTemp()
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
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.getKeys()
        this.getNodeNmaes()
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updatePlan(this.temp).then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.resetTemp()
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
      handleDelete(id) {
        deletePlan(id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      handlePublish(id) {
        publishPlan(id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
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

<style scoped>

</style>
