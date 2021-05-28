<template>
  <div class="dormitory">
    <br>
    <el-header style=" background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px">数据申请任务管理
    </el-header>
    <br>
    <br>
    <div class="searchWord">
      <!--  1-搜索框             -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
<!--        <el-form-item>-->
<!--          <el-input v-model="listQuery.contentTitle"-->
<!--                    clearable-->
<!--                    placeholder="标题"/>-->
<!--        </el-form-item>-->
        <!--        <el-form-item >-->
        <!--          <el-select v-model="listQuery.blockId" placeholder="版块名称" clearable>-->
        <!--            <el-option v-for="item in blockList" :label="item.blockName" :value="item.id" :key="item.id"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-select v-model="listQuery.contentStatus" clearable placeholder="内容状态">
            <el-option label="申请上线" value="up"></el-option>
            <el-option label="申请下线" value="down"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.auditStatus" clearable placeholder="审核状态">
            <el-option label="待审核" value="undo"></el-option>
            <el-option label="审核通过" value="yes"></el-option>
            <el-option label="审核不通过" value="no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="dormitoryData">
      <el-table
        ref="dormitoryTable"
        :data="tables"
        v-loading="listLoading"
        stripe
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column label="内容标题" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容状态" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusApply=='up'"
                    type="success">
              上线
            </el-tag>
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusApply=='down'"
                    type="danger">
              下线
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" width="120">
          <template slot-scope="{row}">
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusCheck=='undo'"
                    type="primary">
              待审核
            </el-tag>
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusCheck=='yes'"
                    type="success">
              审核通过
            </el-tag>
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusCheck=='no'"
                    type="danger">
              审核不通过
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.timeApply }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="审核人" align="center" width="70">-->
        <!--          <template slot-scope="{row}">-->
        <!--            <span>{{ row.auditName }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="审核时间" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.timeCheck }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.checkReason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " prop="operation" align="center" width="400">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="getInFetchList(row.aid, row.statusApply, row.statusCheck)">预览</el-button>

            <el-button size="small" type="primary" @click="auditYesList(row.aid, row.statusApply)"
                       :disabled="(row.statusCheck == 'undo') ? false : true">审核通过
            </el-button>
            <el-button disabled="row.undo" size="small" type="danger" @click="auditNoList(row.aid, row.statusApply)"
                       :disabled="(row.statusCheck == 'undo') ? false : true">审核不通过
            </el-button>
            <el-button
              :disabled="((row.statusCheck == 'yes' && row.statusApply == 'up') || (row.statusCheck == 'no' && row.statusApply == 'down') ) ? false : true"
              size="small"
              type="danger"
              @click="offLineInModifyList(row.aid)">下线
            </el-button>
            <!--            <el-button v-if="row.statusApply=='下线'"-->
            <!--                       size="small"-->
            <!--                       type="success"-->
            <!--                       @click="onLineInModifyList(row.aid)">上线</el-button>-->

          </template>
        </el-table-column>
      </el-table>

      <!--分页插件-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"/>

      <!--删除回话框               -->
      <el-dialog
        title="下线"
        :visible.sync="deleteVisible"
        width="30%">
        <span>确认下线这条记录吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete">确 认</el-button>
          <el-button @click="deleteVisible = false">取 消</el-button>
        </span>
      </el-dialog>


      <!--新增回话框               -->
      <el-dialog :title="auditTitle" :visible.sync="dialogAuditVisible">
        <el-form :model="auditForm" ref="auditForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="审核意见：" prop="auditAdvise">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="审核意见"
              style="width: 450px"
              v-model="auditForm.auditAdvise">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="auditList('auditForm')">确 认</el-button>
          <el-button @click="dialogAuditVisible = false">取 消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {
  onOffLineContentByContentId,
  fetchMoreConditionConciseAuditList,
  fetchConciseBlockList,
  modifyAuditListByAuditId
} from "@/api/portal";
import Pagination from '@/components/Pagination'

export default {
  name: "dataCheck",
  components: {Pagination},

  data() {
    return {
      id: 0,
      statusApply: '',
      statusCheck: '',
      blockList: [],
      tables: [],
      total: 0,
      email: '',
      listQuery: {
        contentTitle: '',
        contentStatus: '',
        auditStatus: '',
        page: 1,
        limit: 10
      },
      formInline: {
        user: '',
        region: ''
      },
      auditForm: {
        auditAdvise: undefined
      },
      rules: {
        auditAdvise: [{required: true, message: '请输入审核意见', trigger: 'change'}],
      },
      dialogAuditVisible: false,
      deleteVisible: false,
      auditTitle: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      var that = this;
      this.tables = [];
      this.$axios({
        method: 'post',
        url: '/dataShare/application/showApply',
        contentType: 'application/json; charset=UTF-8', // 解决415错误
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        dataType: 'json',
        data: JSON.stringify({
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          contentTitle: this.listQuery.contentTitle,
          contentStatus: this.listQuery.contentStatus,
          auditStatus: this.listQuery.auditStatus
        })
      }).then(res => { // 注意：后端需要返回userID
        var string1 = res.data //储存数据
        var dataNum = string1.length //储存数据条数
        for (var i = 0; i < dataNum; i++) {
          var objectToInsert = JSON.parse(string1[i]);
          that.tables.push(objectToInsert);

        }
        that.total = parseInt(that.tables.pop())
        console.log(that.tables)
        console.log(res.data)
      }).catch(error => {
        alert(error)
        console.log(error)
      })
    },
    clickSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    getInFetchList(id, status, statusCheck) {
      this.$router.push({
          name: 'dataPreview',
          query: {
            id: id,
            status: status,
            statusCheck: statusCheck
          }
        }
      )
    },
    auditYesList(id, statusApply) {
      this.auditTitle = "审核通过"
      this.dialogAuditVisible = true
      this.id = id
      this.statusApply = statusApply
      this.statusCheck = 'yes'
      this.$refs['auditForm'].resetFields()
    },
    auditNoList(id, statusApply) {
      this.auditTitle = "审核不通过"
      this.dialogAuditVisible = true
      this.id = id
      this.statusApply = statusApply
      this.statusCheck = 'no'
      this.$refs['auditForm'].resetFields()
    },
    auditList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var that = this;
          if (this.statusCheck === 'yes') {
            this.$axios({
              method: 'post',
              url: '/dataShare/application/applyPass',
              contentType: 'application/json; charset=UTF-8', // 解决415错误
              headers: {'Content-Type': 'application/json;charset=UTF-8'},
              dataType: 'json',
              data: JSON.stringify({
                aid: this.id,
                type: this.statusApply,
                reason: this.auditForm.auditAdvise
              })
            }).then(res => { // 注意：后端需要返回userID
              this.$refs['auditForm'].resetFields()
              if (res.data === -1) {
                this.$message.error('审核失败')
              } else {
                this.$message.success('审核成功')
              }
            }).catch(error => {
              this.$refs['auditForm'].resetFields()
              alert(error)
              console.log(error)
            })
          } else {
            this.$axios({
              method: 'post',
              url: '/dataShare/application/applyDeny',
              contentType: 'application/json; charset=UTF-8', // 解决415错误
              headers: {'Content-Type': 'application/json;charset=UTF-8'},
              dataType: 'json',
              data: JSON.stringify({
                aid: this.id,
                type: this.statusApply,
                reason: this.auditForm.auditAdvise
              })
            }).then(res => { // 注意：后端需要返回userID
              this.$refs['auditForm'].resetFields()
              if (res.data === -1) {
                this.$message.error('审核失败')
              } else {
                this.$message.success('审核成功')
              }
            }).catch(error => {
              alert(error)
              console.log(error)
            })
          }
        }
      })
    },
    onLineInModifyList(id) {
      onOffLineContentByContentId(id).then(() => {
        this.fetchData()
        this.$notify({
          title: '上线',
          message: '上线成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    offLineInModifyList(id) {
      this.deleteVisible = true
      this.id = id
    },
    submitDelete() {
      this.deleteVisible = false
      onOffLineContentByContentId(this.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '下线',
          message: '下线成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    /*    onSearch() {
          fetchMoreConditionConciseAuditList(this.listQuery.contentTitle,
            this.listQuery.contentStatus,this.listQuery.auditStatus, this.listQuery.page,this.listQuery.limit).then(response=>{
            this.tables=response.data.conciseAuditInfoDTOList
            this.total=response.data.total
          })
        }*/
  },
}
</script>

<style scoped>

</style>
