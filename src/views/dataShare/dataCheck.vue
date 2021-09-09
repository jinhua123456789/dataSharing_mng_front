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
        <el-button
          @click="dialogFormVisible = true"
          style="
            margin-right: 60px;
            float:right;
            "
          type="primary"
        >上传数据 <i class="el-icon-upload el-icon--right"></i
        ></el-button>
      </el-form>

      <el-dialog
        :close-on-click-modal="false"
        @close="resetForm"
        title="上传数据"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :model="form"
          :rules="rules2"
          ref="form"
          class="demo-ruleForm"
          size="medium"
        >
          <el-form-item label="题目" prop="title" :label-width="formLabelWidth">
            <el-input
              v-model="form.title"
              autocomplete="off"
              placeholder="请输入数据集题目"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="作者"
            prop="authors"
            :label-width="formLabelWidth"
            style="margin-top: 25px"
          >
            <el-input
              v-model="form.authors"
              autocomplete="off"
              placeholder="请输入数据集作者"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="关键词"
            prop="keyword"
            :label-width="formLabelWidth"
            style="margin-top: 25px"
          >
            <el-input
              v-model="form.keyword"
              autocomplete="off"
              placeholder="请输入数据集关键词"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="摘要"
            prop="abstracts"
            :label-width="formLabelWidth"
            style="margin-top: 25px"
          >
            <el-input
              type="textarea"
              v-model="form.abstracts"
              autocomplete="off"
              :rows="3"
              placeholder="请输入数据集摘要"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="上传理由"
            prop="reason"
            :label-width="formLabelWidth"
            style="margin-top: 25px"
          >
            <el-input
              type="textarea"
              v-model="form.reason"
              autocomplete="off"
              :rows="3"
              placeholder="请输入数据集上传理由"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="上传文件"
            :label-width="formLabelWidth"
            prop="fileList"
            ref="fileList"
            style="margin-top: 25px"
          >
            <el-upload
              class="upload-demo"
              name="file"
              :auto-upload="false"
              action=""
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-change="fileChange"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="form.fileList"
              accept=".pdf,.xls,.xlsx,.zip,.png,.jpg,.csv"
            >
              <el-button style="height: 30px; width: 100px" type="primary"
              >点击上传</el-button
              >
              <div slot="tip" class="el-upload__tip">
                支持格式：.pdf .xls .xlsx .zip .png .jpg .csv
                .zip，一次只能上传一个文件且大小不能超过300MB
              </div>
            </el-upload>
          </el-form-item>
          <el-progress
            v-if="show"
            style="width: 680px; margin-left: 60px; margin-top: 20px"
            :text-inside="true"
            :stroke-width="15"
            :percentage="percent"
          ></el-progress>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            style="height: 30px; width: 70px"
            @click="dialogFormVisible = false"
          >取 消</el-button
          >
          <el-button
            style="height: 30px; width: 70px"
            type="primary"
            @click="submitForm('form')"
          >确 定</el-button
          >
        </div>
      </el-dialog>

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
              管理员待审
            </el-tag>
            <el-tag style="width: 80px; height:30px; text-align: center" v-if="row.statusCheck=='sys'"
                    type="primary">
              系统审核中
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
        <el-table-column label="申请人" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.timeApply }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="审核人" align="center" width="70">-->
        <!--          <template slot-scope="{row}">-->
        <!--            <span>{{ row.auditName }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="审核时间" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.timeCheck }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="100">
          <template slot-scope="{row}">
            <!--<span>{{ row.checkReason }}</span>-->
<!--
            <el-button @click="showComment(row.checkReason)" type="text" size="small" :disabled="(row.statusCheck == 'undo') ? true : false">查看</el-button>
-->
            <el-button @click="showComment(row.checkReason)" type="text" size="small">查看</el-button>

          </template>
        </el-table-column>
        <el-table-column label="操作 " prop="operation" align="center" width="400">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="getInFetchList(row.aid, row.statusApply, row.statusCheck,row.checkReason)" :disabled="(row.statusCheck != 'sys' ) ? false : true">预览</el-button>

            <el-button size="small" type="primary" @click="auditYesList(row.aid, row.statusApply)"
                       :disabled="(row.statusCheck == 'undo' ) ? false : true">审核通过
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
      dialogFormVisible: false,
      statusCheck: '',
      blockList: [],
      tables: [],
      total: 0,
      show: false,
      email: '',
      formLabelWidth: "120px",
      rules2: {
        title: [
          { required: true, message: "请输入数据集题目", trigger: "change" },
        ],
        authors: [
          { required: true, message: "请输入数据集作者", trigger: "change" },
        ],
        keyword: [
          { required: true, message: "请输入数据集关键词", trigger: "change" },
        ],
        abstracts: [
          { required: true, message: "请输入数据集摘要", trigger: "change" },
        ],
        reason: [
          {
            required: true,
            message: "请输入数据集上传理由",
            trigger: "change",
          },
        ],
        fileList: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
      },
      percent: 0,
      form: {
        title: "",
          authors: "",
          keyword: "",
          abstracts: "",
          reason: "",
          fileList: [],
      },
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
    submitForm: function (formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.form.fileList.length === 0) {
            that.$message.error("您还未上传文件");
          } else {
            this.show = true;
            let list = {
              //email: that.email,
              title: that.form.title,
              abstracts: that.form.abstracts,
              keyword: that.form.keyword,
              authors: that.form.authors,
              reason: that.form.reason,
            };

            let formData = new window.FormData();
            formData.append(
              "formData",
              new Blob([JSON.stringify(list)], { type: "application/json" })
            );
            formData.append("file", that.form.fileList[0]);

            this.$axios({
              method: "post",
              url: "/dataShare/resource/adminUpLoad",
              headers: { "Content-Type": "multipart/form-data;charset=UTF-8" },
              data: formData,
              onUploadProgress: (progressEvent) => {
                if (progressEvent.lengthComputable) {
                  var complete =
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                  this.percent = complete;
                  console.log("percent" + this.percent);
                  if (complete >= 100) {
                    setTimeout(() => {
                      this.$refs["form"].resetFields();
                      this.show = false;
                      this.percent = 0; // 重新置0
                    }, 2000);
                  }
                }
              },
            })
              .then((res) => {
                // 注意：后端需要返回userID
                if (res.data === -1) {
                  this.$message.error("上传失败");
                } else {
                  this.$message.success("上传成功");
                }
              })
              .catch((error) => {
                alert(error);
                console.log(error);
              });
          }
        }
      });
    },
    clickSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    getInFetchList(id, status, statusCheck, reason) {
      var check = 0; // 当check为1时，说明该数据侵权，不可在预览时下载
      if(reason === '数据可能存在侵权行为，不允许上传'){
        check = 1;
      }
      this.$router.push({
          name: 'dataPreview',
          query: {
            id: id,
            status: status,
            statusCheck: statusCheck,
            check: check,
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
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(file, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.fileList = fileList;
    },
    fileChange(file, fileList) {
      let fileName = file.name;
      let pos = fileName.lastIndexOf(".");
      let lastName = fileName.substring(pos, fileName.length);
      if (
        lastName.toLowerCase() !== ".pdf" &&
        lastName.toLowerCase() !== ".xls" &&
        lastName.toLowerCase() !== ".xlsx" &&
        lastName.toLowerCase() !== ".zip" &&
        lastName.toLowerCase() !== ".png" &&
        lastName.toLowerCase() !== ".jpg" &&
        lastName.toLowerCase() !== ".csv"
      ) {
        fileList.pop();
        this.$message.error(
          "文件必须为.pdf .xls .xlsx .zip .png .jpg .csv类型"
        );
        return;
      }
      const isLt2M = file.size / 1024 / 1024 <= 300;
      if (!isLt2M) {
        fileList.pop();
        this.$message.error("上传头像图片大小不能超过 300MB!");
        return;
      }
      this.form.fileList.push(file.raw);
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
    },
    showComment(msg){
      this.$alert(msg, '审核意见', {
        confirmButtonText: '确定',
        callback: action => {

        }
      });
    },
  },
}
</script>

<style scoped>
  .demo-ruleForm {
    margin-top: 0px;
  }
</style>
