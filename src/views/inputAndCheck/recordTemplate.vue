<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="原始记录表模版名称" align="center" >
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="文件链接"
        class-name="status-col"
      >
        <template slot-scope="{ row }">
          <el-tag @click.native="handleDownload(row)">
            <i class="el-icon-download"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="{ row }">
           <el-button type="danger" size="small" @click="handleDelete(row)" >删除</el-button>
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

    <!-- 新增按钮 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :show-close="shClose"
    >
      <el-form >
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
            :data="info"
            :headers="headers"
          >
            <el-button type="primary" slot="trigger"
              >点击上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label-width="120px" label="模版名称">
          <el-input v-model="name" style="width:300px"></el-input>
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
  deleteTemplate,
  downloadTemplate,
  selectAllTemplate,
} from "@/api/recordTemplate";
import {getToken} from '@/utils/auth';



export default {
  data() {
    return {
      headers:{Authorization: 'bearer '+ getToken()},
      tableList: [],
      userId: null,
      list: null,
      shClose: false,
      info: {
        name: null,
      },
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      name:null,
      dialogFormVisible: false,
      fileList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "bsd-import/uploadTemplate",
    };
  },
  created() {
    this.listQuery.pageNum = 1;
    this.getList();
  },
  methods: {
    
    //获取列表数据
    getList() {
      this.listLoading = true;
      selectAllTemplate(this.listQuery).then((response) => {
        this.list = response.data.rows;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
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
    //上传文件 新增按钮
    handleCreate() {
      this.dialogFormVisible = true;
    },
    //下载文件链接
    handleDownload(row) {
      downloadTemplate(row.id).then((response) => {
        // 创建隐藏的可下载链接
        let content = response;
        let elink = document.createElement("a");
        elink.download = row.name + "-" + this.getTimeNow() + ".xlsx";
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
    //删除某条数据
    handleDelete(row) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteTemplate(row.id).then((response) => {
          if (response.code == 200) {
            this.$message({
              type: "success",
              message: response.message,
            });
          } else  {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
          this.getList();
        });
      });
    },
    //上传成功
    onSuccess(res) {
      if(res==="file exist") {
        this.$alert("上传失败,文件已存在", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          console.log("上传失败,文件已存在");
        },
      });
      }
      else this.$alert("上传成功", "提示", {
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
      if (!this.fileList.length) {
        this.$message.warning("请选择文件");
      } else if(this.name==null) {
        this.$message.warning("请输入模版名称");
      }  else {
        this.info["name"] = this.name;
        this.$refs.upload.submit();
      }
    },
    //取消
    dialogCancel() {
      this.fileList = [];
      this.name = null;
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
  },
};
</script>
<style>
.el-table .cell {
  white-space: pre-line;
}
</style>
 