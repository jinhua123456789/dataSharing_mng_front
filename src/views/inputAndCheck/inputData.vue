<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.monitorInfo"
        placeholder="监测业务"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in monitorInfoList"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.recordId"
        placeholder="记录表"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in tableList"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in this.statusList"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="onSearch"
        >查询</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
        >新增</el-button
      >
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="请稍候"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="监测业务" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.monitorInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录表" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.excelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入人" align="center" min-width="60px">
        <template slot-scope="{ row }">
          <span>{{ row.importUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据最新时间" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deadline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" min-width="60px">
        <template slot-scope="{ row }">
          <span>{{ row.checkUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.checkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" min-width="150px">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="文件链接"
        class-name="status-col"
        min-width="80px"
      >
        <template slot-scope="{ row }">
          <el-tag @click.native="handleDownload(row)">
            <i class="el-icon-download"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template slot-scope="{ row }">
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row.importId)"
            >删除</el-button
          >
          <el-button type="success" size="small" @click="handleAutoLog(row)"
            >自动审核日志</el-button
          >
          <el-button type="success" size="small" @click="handleManuLog(row)"
            >人工审核意见</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 翻页功能设置 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 自动审核结果 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogAlogVisible">
      <el-table :data="alogData">
        <el-table-column property="date" label="日期"></el-table-column>
        <el-table-column property="result" label="审核结果"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 人工审核结果 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogMlogVisible">
      <el-table :data="mlogData">
        <el-table-column property="date" label="日期"></el-table-column>
        <el-table-column property="name" label="审核人"></el-table-column>
        <el-table-column property="result" label="审核意见"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增按钮 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :show-close="shClose"
    >
      <el-form :model="createForm">
        <el-form-item label="模版类型" label-width="120px">
          <el-select v-model="createForm.recordId" placeholder="请选择模版">
            <el-option
              v-for="item in tableList"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="120px" label="下载模版">
          <el-button type="success" @click="downloadT">点击下载</el-button>
        </el-form-item>
        <el-form-item label="上传文件" label-width="120px">
          <el-upload
            ref="upload"
            accept=".xlsx,.xls"
            :file-list="fileList"
            :on-change="handleChange"
            :action="uploadUrl"
            :show-file-list="true"
            :on-success="onSuccess"
            :on-error="onError"
            :auto-upload="false"
            :on-remove="onRemove"
            :data="userInfo"
            :headers="headers"
          >
            <el-button type="primary" slot="trigger"
              >点击上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="数据最新时间" label-width="120px">
          <el-date-picker
            type="date"
            placeholder="请选择数据最新时间"
            v-model="createForm.latestTime"
            value-format="yyyy/MM/dd hh:mm:ss"
          />
        </el-form-item>
        <el-form-item label="解析文件" label-width="120px" v-if="createForm.recordId===4">
          <el-upload
            accept=".xlsx,.xls"
            :action="analysisUrl"
            :http-request="handleDownloadExcel"
          >
            <el-button type="primary" slot="trigger"
              >点击上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import {
  fetchList,
  deleteExcel,
  getExcel,
  getTemplate,
  getMonitorInfo,
  analysisExcel
} from "@/api/batchInput";
import { getInfo } from "@/api/user";
import { fetchTableList } from "@/api/table";
import {getToken} from '@/utils/auth';
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        人工审核通过: "success",
        自动审核通过: "info",
        自动审核未通过: "danger",
        人工审核未通过: "danger",
      };
      return statusMap[status];
    },
  },

  data() {
    return {
      headers:{Authorization: 'bearer '+ getToken()},
      tableList: [],
      monitorInfoList: [],
      userId: null,
      list: null,
      shClose: false,
      userInfo: {
        import_user_id: null,
        record_id: null,
      },
      statusList: [
        {
          label: "自动审核通过",
          value: 2,
        },
        {
          label: "自动审核未通过",
          value: 3,
        },
        {
          label: "人工审核通过",
          value: 4,
        },
        {
          label: "人工审核未通过",
          value: 5,
        },
      ],
      total: 0,
      listLoading: true,
      alogData: [
        {
          date: null,
          result: null,
        },
      ],
      mlogData: [
        {
          date: null,
          name: null,
          result: null,
        },
      ],
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        checkUserName: null,
        recordId: null,
        importUserName: null,
        status: null,
      },
      dialogFormVisible: false,
      dialogAlogVisible: false,
      dialogMlogVisible: false,
      dialogStatus: "",
      textMap: {
        create: "录入数据",
        autolog: "自动审核日志",
        manulog: "人工审核意见",
      },
      createForm: { recordId: null, stationCode: null, latestTime: null },
      fileList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "bsd-import/inputExcel",
      analysisUrl: process.env.VUE_APP_BASE_API + "bsd-import/analysisExcel"
    };
  },
  created() {
    this.listQuery.pageNum = 1;
    this.getRegList();
    this.getList();
    this.getUserId();
    this.getMonitorInfoList();
  },
  methods: {
    //获取模版数据
    getRegList() {
      fetchTableList().then((response) => {
        for (let i in response.data) {
          let data = {};
          data.label = response.data[i].excelName;
          data.value = response.data[i].recordId;
          this.tableList.push(data);
        }
      });
    },
    //获取列表数据
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.rows;
        for (let i in this.list) {
          if (this.list[i].status == 2) this.list[i].status = "自动审核通过";
          else if (this.list[i].status == 3)
            this.list[i].status = "自动审核未通过";
          else if (this.list[i].status == 4)
            this.list[i].status = "人工审核通过";
          else if (this.list[i].status == 5)
            this.list[i].status = "人工审核未通过";
        }
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getMonitorInfoList() {
      getMonitorInfo().then((response) => {
        for (let i in response.data) {
          let data = {};
          data.label = response.data[i];
          data.value = response.data[i];
          this.monitorInfoList.push(data);
        }
      });
    },
    //改变页面的大小和页数
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    //获取登录用户id
    getUserId() {
      getInfo().then((response) => {
        this.userId = response.data.userId;
      });
    },
    //搜索功能
    onSearch() {
      this.getList();
    },
    //上传文件 新增按钮
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    //下载文件链接
    handleDownload(row) {
      getExcel(row.importId).then((response) => {
        // 创建隐藏的可下载链接
        let content = response;
        let elink = document.createElement("a");
        elink.download = row.excelName + "-" + this.getTimeNow() + ".xlsx";
        elink.style.display = "none";
        // 字符内容转变成blob地址
        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(elink);
        elink.click();
        // 然后移除
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      });
    },
    //下载模版
    downloadT() {
      if (!this.createForm.recordId) {
        this.$message.warning("请选择模版类型");
      } else {
        getTemplate(this.createForm.recordId).then((response) => {
          // 创建隐藏的可下载链接
          console.log(response);
          let content = response;
          let elink = document.createElement("a");
          let name = null;
          for (let i in this.tableList) {
            if (this.tableList[i].value == this.createForm.recordId) {
              name = this.tableList[i].label;
            }
          }
          elink.download = name + "-" + this.getTimeNow() + ".xlsx";
          elink.style.display = "none";
          // 字符内容转变成blob地址
          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(elink);
          elink.click();
          // 然后移除
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
          this.$message({
            type: "success",
            message: "下载成功",
          });
        });
      }
    },
    //删除某条数据
    handleDelete(importId) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteExcel(importId).then((response) => {
          if (response.code == 200) {
            this.$message({
              type: "success",
              message: response.message,
            });
          } else if (response.code == 500) {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
          this.getList();
        });
      });
    },
    //展示自动审核结果
    handleAutoLog(row) {
      this.alogData[0].date = row.autoCheckTime;
      this.alogData[0].result = row.autoCheckLog;
      this.dialogStatus = "autolog";
      this.dialogAlogVisible = true;
    },
    //展示人工审核结果
    handleManuLog(row) {
      this.mlogData[0].date = row.checkTime;
      this.mlogData[0].name = row.checkUserName;
      this.mlogData[0].result = row.checkLog;
      this.dialogStatus = "manulog";
      this.dialogMlogVisible = true;
    },
    //上传成功
    onSuccess(res) {
      this.$alert("上传成功", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          console.log("上传成功");
          this.getList();
        },
      });
    },
    //上传失败
    onError(res) {
      this.$alert("上传失败", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          console.log("上传失败");
        },
      });
    },
    //删除文件时清空文件列表
    onRemove(file, fileList) {
      this.fileList = [];
    },
    //每次只保留最新文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]; // 这一步，是展示最后一次选择的文件
      }
    },
    //提交
    submit() {     
      if (!this.createForm.recordId) {
        this.$message.warning("请选择模版类型");
      } else if (!this.fileList.length) {
        this.$message.warning("请选择文件");
      } else if(!this.createForm.latestTime) {
        this.$message.warning("请选择数据最新时间");
      } else {
        this.userInfo["import_user_id"] = this.userId;
        this.userInfo["record_id"] = this.createForm.recordId;
        this.userInfo["deadline"] = this.createForm.latestTime;
        this.$refs.upload.submit();
      }
    },
    //取消
    dialogCancel() {
      this.fileList = [];
      this.createForm.recordId = null;
      this.createForm.latestTime = null;
      this.dialogFormVisible = false;
    },
    getTimeNow() {
      let aDate = new Date();
      let yy = aDate.getFullYear();
      let mm = aDate.getMonth() + 1;
      let dd = aDate.getDate();
      let hh = aDate.getHours();
      let mf =
        aDate.getMinutes() < 10 ? "0" + aDate.getMinutes() : aDate.getMinutes();
      let ss =
        aDate.getSeconds() < 10 ? "0" + aDate.getSeconds() : aDate.getSeconds();
      return yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },
    handleDownloadExcel(item) {
      const fileObj = item.file;
        // FormData 对象
        const form01 = new FormData()
        // 文件对象
        form01.append('file', fileObj);
        analysisExcel(form01).then(response => {
          let content = response;
          let elink = document.createElement("a");
          elink.download = '[解析] 径流小区径流泥沙采样记录表' + "-" + this.getTimeNow() + ".xlsx";
          elink.style.display = "none";
          // 字符内容转变成blob地址
          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(elink);
          elink.click();
          // 然后移除
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
          this.$message({
            type: "success",
            message: "上传成功",
          });
        })
    }
  },
};
</script>
<style>
.el-table .cell {
  white-space: pre-line;
}
</style>
 