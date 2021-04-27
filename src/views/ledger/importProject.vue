<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="项目名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.explorationUnit"
        placeholder="勘察单位"
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
<!--    <el-table v-loading="listLoading" :data="tableList" border fit highlight-current-row style="width: 100%">-->

      <el-table-column  width="100px" align="center" label="项目编码">
        <template slot-scope="scope">
          <span>{{ scope.row.project_code }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="140px" align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.project_name }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="150px" align="center" label="勘察单位">
        <template slot-scope="scope">
          <span>{{ scope.row.exploration_unit }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="批复年度">
        <template slot-scope="scope">
          <span>{{ scope.row.project_date }}</span>
        </template>
      </el-table-column>

      <el-table-column  width="80px" align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.project_principal }}</span>
          <!--          <span>张三</span>-->
        </template>
      </el-table-column>

      <el-table-column  class-name="status-col" label="项目状态" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进度" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_schedule }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-download" @click="oneDownload(scope.row)">
              一键下载
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-info" @click="ledgerInfo(scope.row)">
              台账信息
            </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="台账信息" :visible.sync="ledgerInfoDialogVisible" style="width: 100%">
      <el-table
        :data="tableData"
        border
        :show-header=false
        style="width: 100%">
        <el-table-column
          prop="label1"
          label="名称"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.label1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content1"
          label="内容"
          width="170">
          <template slot-scope="scope">
            <a href="" :class="{'link-type': scope.row.isLink1}">{{ scope.row.content1 }}</a>
            <!--            <router-link :to="'/example/edit/'+scope.row.content1" class="link-type">-->
            <!--              <span>{{ scope.row.content1 }}</span>-->
            <!--            </router-link>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="label2"
          label="名称"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.label2 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content2"
          label="内容"
          width="170">
          <template slot-scope="scope">
            <a href="" :class="{'link-type': scope.row.isLink2}">{{ scope.row.content2 }}</a>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ledgerInfoDialogClose">
          关闭
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
        project_name: '名称1',
        project_principal: '张三',
        project_date: '2019',
        project_status: '未提交',
        check_status: '未通过',
        project_code: 'a',
        exploration_unit: '勘察单位',
        project_schedule: '10%'
      },{
        project_name: '名称2',
        project_principal: '张三',
        project_date: '2019',
        project_status: '已提交',
        check_status: '未通过',
        project_code: 'b',
        exploration_unit: '勘察单位',
        project_schedule: '40%'
      },{
        project_name: '名称3',
        project_principal: '张三',
        project_date: '2019',
        project_status: '待审核',
        check_status: '未通过',
        project_code: 'c',
        exploration_unit: '勘察单位',
        project_schedule: '30%'
      },{
        project_name: '名称4',
        project_principal: '张三',
        project_date: '2019',
        project_status: '验收通过',
        check_status: '已通过',
        project_code: 'd',
        exploration_unit: '勘察单位',
        project_schedule: '75%'
      },{
        project_name: '名称5',
        project_principal: '张三',
        project_date: '2019',
        project_status: '已结束',
        check_status: '已通过',
        project_code: 'e',
        exploration_unit: '勘察单位',
        project_schedule: '90%'
      },{
        project_name: '名称6',
        project_principal: '张三',
        project_date: '2019',
        project_status: '未提交',
        check_status: '未通过',
        project_code: 'f',
        exploration_unit: '勘察单位',
        project_schedule: '60%'
      },{
        project_name: '名称7',
        project_principal: '张三',
        project_date: '2019',
        project_status: '执行中',
        check_status: '未通过',
        project_code: 'g',
        exploration_unit: '勘察单位',
        project_schedule: '30%'
      },{
        project_name: '名称8',
        project_principal: '张三',
        project_date: '2019',
        project_status: '验收通过',
        check_status: '已通过',
        project_code: 'h',
        exploration_unit: '勘察单位',
        project_schedule: '85%'
      },{
        project_name: '名称9',
        project_principal: '张三',
        project_date: '2019',
        project_status: '未提交',
        check_status: '未通过',
        project_code: 'i',
        exploration_unit: '勘察单位',
        project_schedule: '45%'
      },{
        project_name: '名称10',
        project_principal: '张三',
        project_date: '2019',
        project_status: '待验收',
        check_status: '未通过',
        project_code: 'j',
        exploration_unit: '勘察单位',
        project_schedule: '50%'
      },{
        project_name: '名称11',
        project_principal: '张三',
        project_date: '2019',
        project_status: '待签合同',
        check_status: '未通过',
        project_code: 'k',
        exploration_unit: '勘察单位',
        project_schedule: '70%'
      },],
      tableData: [{
        label1: '项目编号',
        content1: '768865',
        isLink1: false,
        label2: '项目名称',
        content2: '阳曲县郑家梁一带铌、钽、铍矿预查',
        isLink2: false,
      },{
        label1: '批复年份',
        content1: '2019',
        isLink1: false,
        label2: '所在地区',
        content2: '江西省上饶市',
        isLink2: false,
      },{
        label1: '勘查单位',
        content1: '214地质队',
        isLink1: false,
        label2: '勘查负责人',
        content2: '张宏',
        isLink2: false
      },{
        label1: '监理单位',
        content1: '地质勘查监理有限公司',
        isLink1: false,
        label2: '监理负责人',
        content2: '王达',
        isLink2: false
      },{
        label1: '探矿权人',
        content1: '维达有限公司',
        isLink1: false,
        label2: '探矿权证',
        content2: '探矿权证.jpg',
        isLink2: true,
      },{
        label1: '开工时间',
        content1: '2018.10.22',
        isLink1: false,
        label2: '结项时间',
        content2: '2019.12.20',
        isLink2: false,
      },{
        label1: '项目类型',
        content1: '重大项目',
        isLink1: false,
        label2: '是否含矿',
        content2: '是',
        isLink2: false,
      },{
        label1: '项目状态',
        content1: '已结项',
        isLink1: false,
        label2: '',
        content2: '',
        isLink2: false,
      },{
        label1: '勘查任务书',
        content1: '勘查任务书.pdf',
        isLink1: true,
        label2: '监理任务书',
        content2: '监理任务书.pdf',
        isLink2: true,
      },{
        label1: '项目设计批复',
        content1: '项目设计批复.pdf',
        isLink1: true,
        label2: '项目设计变更',
        content2: '项目设计变更.pdf',
        isLink2: true,
      },{
        label1: '勘查合同',
        content1: '勘查合同.pdf',
        isLink1: true,
        label2: '监理合同',
        content2: '监理合同.pdf',
        isLink2: true,
      },{
        label1: '合作勘查投资合同',
        content1: '合作勘查投资合同.pdf',
        isLink1: true,
        label2: '追加投资合同',
        content2: '追加投资合同.pdf',
        isLink2: true,
      },{
        label1: '项目成果报告',
        content1: '项目成果报告.pdf',
        isLink1: true,
        label2: '野外验收申请',
        content2: '野外验收申请.pdf',
        isLink2: true,
      },{
        label1: '野外验收意见书',
        content1: '野外验收意见书.pdf',
        isLink1: true,
        label2: '野外验收资料',
        content2: '野外验收资料.pdf',
        isLink2: true,
      },{
        label1: '项目汇交证明',
        content1: '项目汇交证明.pdf',
        isLink1: true,
        label2: '',
        content2: '',
        isLink2: false,
      }],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      applyForAcceptanceDialogFormVisible: false,
      submitProofDialogFormVisible: false,
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
      ledgerInfoDialogVisible: false
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
    applyForAcceptance(row) {
      this.applyForAcceptanceDialogFormVisible = true
    },
    submitProof(row) {
      this.submitProofDialogFormVisible = true
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
    ledgerInfo() {
      this.ledgerInfoDialogVisible = true;
    },
    ledgerInfoDialogClose() {
      this.ledgerInfoDialogVisible = false;
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
