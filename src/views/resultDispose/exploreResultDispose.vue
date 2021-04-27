<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.project_code"
        placeholder="项目编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.username"
        placeholder="项目名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="statusSelected"
        placeholder="项目状态"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="year"
        type="year"
        placeholder="批复时间（年）"
        class="filter-item"
        style="width: 200px">
      </el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column fixed width="100px" align="center" label="项目编号">
        <template slot-scope="scope">
          <span>{{ scope.row.project_code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="190px" align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.project_name }}</span>
<!--          <span>{{ scope.row.author }}</span>-->
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="勘察单位">
        <template slot-scope="scope">
          <span>{{ scope.row.exploration_unit }}</span>
<!--          <span>{{ scope.row.author }}</span>-->
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="负责人">
        <template slot-scope="scope">
<!--          <span>张三</span>-->
          <span>{{ scope.row.project_principal }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="批复年度">
        <template slot-scope="scope">
          <span>{{ scope.row.project_date }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="项目状态" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_status }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="找矿成果" width="210px">
        <template slot-scope="scope">
          <span>{{ scope.row.ore_result }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="122px">
        <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="resultDispose(scope.row)">
              成果处置
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--    汇交证明对话框-->
    <el-dialog title="成果处置" :visible.sync="resultDisposeDialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="成果处置说明" label-width="130px">
          <el-input
            type="textarea"
            :rows="4"
            placeholder=""
            v-model="resultDisposeExplain">
          </el-input>
        </el-form-item>
        <el-form-item label="成果处置金额" label-width="130px">
          <el-input v-model="resultDisposeMoney"></el-input>
        </el-form-item>
        <el-form-item label="成果处置文档" label-width="130px">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <!--            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resultDisposeDialogFormVisible = false">
          <!--          {{ $t('table.cancel') }}-->
          取消
        </el-button>
        <el-button type="primary" @click="resultDisposeDialogConfirm">
          确定
          <!--          {{ $t('table.confirm') }}-->
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
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
      tableList: [{
        project_code: '2007611003',
        project_name: '陕西省太白县东沟铅锌（铜）矿普查',
        exploration_unit: '西北有色地质勘查局717总队',
        project_principal: '张建',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '小，金1380kg，2.23g/t；锌892.1吨，2.76%；铅591.56吨，1.83%；铜1605.41吨'
      },{
        project_code: '2007621009',
        project_name: '甘肃省迭部县加勒克一带金矿普查',
        exploration_unit: '甘肃地矿局第三勘查院',
        project_principal: '李万春',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '小，金2007kg',
      },{
        project_code: '2007621003',
        project_name: '甘肃省庄浪县蛟龙掌一带铜多金属矿普查',
        exploration_unit: '甘肃地矿局一勘院',
        project_principal: '徐蒙',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '中，前人成果：锌139586吨，铅29555吨，硫铁矿矿石68.43万吨',
      },{
        project_code: '2007630001',
        project_name: '青海省都兰县五龙沟西金矿普查',
        exploration_unit: '青海省地调院',
        project_principal: '梁国涛',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '金305kg',
      },{
        project_code: '2007631003',
        project_name: '青海省格尔木市唐古拉乡开心岭铁矿普查',
        exploration_unit: '青海省柴达木综合地质矿产勘查院',
        project_principal: '徐宗熙',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '小，铁矿石388.81万吨',
      },{
        project_code: '2007651012',
        project_name: '新疆哈密市雅满苏371铜矿普查',
        exploration_unit: '有色金属矿产地质调查中心',
        project_principal: '孙志严',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '铜3884吨',
      },{
        project_code: '2007651013',
        project_name: '新疆精河县3571铜矿普查',
        exploration_unit: '新疆地矿局第七地质大队',
        project_principal: '孙方石',
        project_date: '2006',
        project_status: '已结项',
        ore_result: '铜2103吨，钼3.58吨，银2吨',
      }],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      resultDisposeDialogFormVisible: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      statusSelected: '',
      statusOptions: [
        { id: 1, name: '未提交' },
        { id: 2, name: '已提交' },
        { id: 3, name: '待审核' },
        // { id: 4, name: '待确定监理单位' },
        { id: 5, name: '待签合同' },
        { id: 6, name: '执行中' },
        { id: 7, name: '待验收' },
        { id: 8, name: '验收通过' },
        { id: 9, name: '已结束' },
        { id: 10, name: '中止'}
      ],
      provinceSelected: '',
      // provinceOptions: [
      //   { id: 1, name: '北京' },
      //   { id: 2, name: '天津' },
      //   { id: 3, name: '河北' }
      // ],
      year: '',
      check: '1',//是否通过审核
      inputAdvice: '',//输入意见
      hasMine: '1',//是否有矿
      oreResult: '',
      finishMode: '1',//项目结项
      hasOreResult: false,
      resultDisposeExplain: '',
      resultDisposeMoney: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      this.list = this.tableList
      this.total = this.tableList.length
      this.listLoading = false

      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },
    acceptOfData(row) {
      this.applyForAcceptanceDialogFormVisible = true
    },
    // requestCheck(row) {
    //   this.requestCheckDialogFormVisible = true;
    // },
    reviewComment(row) {
      this.reviewCommentDialogFormVisible = true
    },
    submitProof(row) {
      this.submitProofDialogFormVisible = true
    },
    finishProject(row) {
      this.finishProjectDialogFormVisible = true
    },
    resultDispose(row) {
      this.resultDisposeExplain = ""
      this.resultDisposeMoney = ""
      this.resultDisposeDialogFormVisible = true
    },
    // handleUpdate(row) {
    //   this.temp = Object.assign({}, row) // copy obj
    //   this.temp.timestamp = new Date(this.temp.timestamp)
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    createData() {
      this.dialogFormVisible = false
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '成功',
      //         message: '创建成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

          this.dialogFormVisible = false

          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    checkIsPass() {
      this.isPass = true;
    },
    checkNotPass() {
      this.isPass = false;
    },
    hasIsOre() {
      this.hasOreResult = false
    },
    hasNotOre() {
      this.hasOreResult = true
    },
    // requestCheckDialogAffirm() {
    //   console.log(this.inputAdvice.trim()=='')
    //   console.log(this.check=='2' && this.inputAdvice.trim()=='')
    //   console.log(this.check)
    //   if (this.check=='2' && this.inputAdvice.trim()=='') {
    //     this.$message({
    //       showClose: true,
    //       message: '请输入意见',
    //       type: 'error'
    //     });
    //   } else {
    //     this.requestCheckDialogFormVisible = false
    //   }
    // },
    // 对话框确认按钮方法
    reviewCommentDialogConfirm(row) {
      this.reviewCommentDialogFormVisible = false
    },
    submitProofDialogConfirm() {
      this.submitProofDialogFormVisible = false
    },
    finishProjectDialogConfirm() {
      this.finishProjectDialogFormVisible = false
    },
    applyForAcceptanceDialogConfirm() {
      this.applyForAcceptanceDialogFormVisible = false
    },
    resultDisposeDialogConfirm() {
      this.resultDisposeDialogFormVisible = false
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
