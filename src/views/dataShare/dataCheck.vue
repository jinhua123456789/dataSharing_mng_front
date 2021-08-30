<template>
  <div class="dormitory">
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
            <el-option label="上线" value="up"></el-option>
            <el-option label="下线" value="down"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.auditStatus" clearable placeholder="审核状态">
            <el-option label="待审核" value="undo"></el-option>
            <el-option label="审核通过" value="yes"></el-option>
            <el-option label="审核不通过" value="no"></el-option>
            <el-option label="强制下线" value="admin"></el-option>
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
        <el-table-column label="内容标题" align="center" width="220px">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容状态" align="center" width="100px">
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
        <el-table-column label="审核状态" align="center" width="100px">
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
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusCheck=='admin'"
                    type="danger">
              强制下线
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" width="100px">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="100px">
          <template slot-scope="{row}">
            <span>{{ row.timeApply }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="审核人" align="center" width="70">-->
        <!--          <template slot-scope="{row}">-->
        <!--            <span>{{ row.auditName }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="审核时间" align="center" width="100px">
          <template slot-scope="{row}">
            <span>{{ row.timeCheck }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center">
          <template slot-scope="{row}">
            <span>{{ row.checkReason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " prop="operation" align="center" width="240px">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" class="operationStyle"  @click="getInFetchList(row.aid, row.statusApply, row.statusCheck)"
                       :disabled="((row.statusCheck == 'undo' && row.statusApply == 'up') || (row.statusCheck == 'yes' && row.statusApply == 'up') || (row.statusCheck == 'no' && row.statusApply == 'down') ) ? false : true">预览</el-button>

            <el-button size="small" type="primary" style="width: 110px;margin-left:0" class="operationStyle" @click="auditYesList(row.aid, row.statusApply)"
                       :disabled="(row.statusCheck == 'undo') ? false : true">审核通过
            </el-button>
            <el-button
              :disabled="((row.statusCheck == 'yes' && row.statusApply == 'up') || (row.statusCheck == 'no' && row.statusApply == 'down') ) ? false : true"
              size="small" type="danger"  @click="offLineInModifyList(row.aid)">下线
            </el-button>
            <el-button style="width: 110px;margin-left:0" disabled="row.undo" size="small" type="danger" @click="auditNoList(row.aid, row.statusApply)"
                       :disabled="(row.statusCheck == 'undo') ? false : true">审核不通过
            </el-button>
            <!--            <el-button v-if="row.statusApply=='下线'"-->
            <!--                       size="small"-->
            <!--                       type="success"-->
            <!--                       @click="onLineInModifyList(row.aid)">上线</el-button>-->

          </template>
        </el-table-column>
<!--        <el-table-column label="下载用户详情" align="center" width="80px">-->
<!--          <template slot-scope="{row}">-->
<!--            <el-tag style="width: 60px; height:30px; text-align: center" @click="jumpToDetail(row.aid)">-->
<!--            查看-->
<!--            </el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
      <el-dialog title="下载数据用户详情" style="padding: 1px 20px;" :visible.sync="userDetailVisible" width="50%">
        <el-table :data="userDetailData" stripe style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
                <el-button style="height: 30px; width: 70px" @click="userDetailVisible = false">取 消</el-button>
            </span>
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
  inject:['reload'],
  data() {
    return {
      listLoading:false,
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
      auditTitle: '',
      userDetailVisible: false,
      userDetailData:[]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    jumpToDetail(id){
      console.log(id)
      let that = this
      this.userDetailVisible = true
      this.userDetailData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
      // this.$axios({
      //   method: "post",
      //   url: "/dataShare/download/findDownloadInfo",
      //   contentType: "application/json; charset=UTF-8", // 解决415错误
      //   headers: { "Content-Type": "application/json;charset=UTF-8" },
      //   dataType: "json",
      //   data: {rid: id},
      // }).then((res) => {
      //   // 注意：后端需要返回userID
      //   //console.log(res.data);
      //   var string1 = res.data; //储存数据
      //   var dataNum = string1.length; //储存数据条数
      //   for (var i = 0; i < dataNum; i++) {
      //     var objectToInsert = JSON.parse(string1[i]);
      //     that.blockContents.push(objectToInsert);
      //   }
      //   that.total = parseInt(that.blockContents.pop());
      //   //console.log(that.blockContents);
      // }).catch((error) => {
      //   // alert(error);
      //   console.log(error);
      // });
    },
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
      this.$refs['auditForm']!= undefined && this.$refs['auditForm'].resetFields()
    },
    auditNoList(id, statusApply) {
      this.auditTitle = "审核不通过"
      this.dialogAuditVisible = true
      this.id = id
      this.statusApply = statusApply
      this.statusCheck = 'no'
      this.$refs['auditForm']!= undefined && this.$refs['auditForm'].resetFields()
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
                //this.$message.error('审核失败')
                this.$notify({
                      title: '审核',
                      message: '审核失败',
                      type: 'error',
                      duration: 2000
                    })
              } else {
                this.$notify({
                  title: '审核',
                  message: '审核成功',
                  type: 'success',
                  duration: 2000
                })
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
                this.$notify({
                  title: '审核',
                  message: '审核失败',
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.$notify({
                  title: '审核',
                  message: '审核成功',
                  type: 'success',
                  duration: 2000
                })
              }
            }).catch(error => {
              alert(error)
              console.log(error)
            })
          }
          this.dialogAuditVisible = false
          this.reload()
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
      //this.deleteVisible = false
      // onOffLineContentByContentId(this.id).then(() => {
      //   this.fetchData()
      //   this.$notify({
      //     title: '下线',
      //     message: '下线成功',
      //     type: 'success',
      //     duration: 2000
      //   })
      // })
      this.$axios({
        method: 'post',
        url: '/dataShare//resource/downApplyAdmin',
        contentType: 'application/json; charset=UTF-8', // 解决415错误
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
        dataType: 'json',
        data: JSON.stringify({
          aid: this.id,
        })
      }).then(res => { // 注意：后端需要返回userID
        if (res.data === -1) {
          this.$notify({
            title: '下线',
            message: '下线失败',
            type: 'error',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '下线',
            message: '下线成功',
            type: 'success',
            duration: 2000
          })
        }
        this.deleteVisible = false
      }).catch(error => {
        alert(error)
        console.log(error)
        this.deleteVisible = false
      })
      this.reload()
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
  .dormitory{
    padding: 15px;
  }
.dormitoryData{
  display: grid;
  overflow: hidden;
}
  .operationStyle{
    margin-bottom: 3px;
    margin-left:0;
  }
  .downloadInfo {
    font-weight: normal;
    width: 84px;
    height: 30px;
    font-size: 12px;
    color: #ffffff;
    background: #73a0fa !important;
    border-radius: 13px;
    border: 0px solid #73a0fa;
    text-align: center;
    line-height: 2.5em;
    margin-right: 176px;
  }
</style>
