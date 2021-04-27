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
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="onSearch"
      >查询</el-button>

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
      style="width: 100%;"
    >
      <el-table-column label="监测业务" align="center" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.monitorInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录表" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.excelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入人" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.importUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据最新时间" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deadline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.checkUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.checkTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" min-width="150px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文件链接" class-name="status-col" min-width="80px">
        <template slot-scope="{row}">
            <el-tag @click.native="handleDownload(row)">
              <i class="el-icon-download"></i>
            </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250px"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="small" :disabled=row.disabled @click="handlePassed(row.importId)">通过</el-button>
          <el-button type="danger" size="small" :disabled=row.disabled @click="handleUnpassed(row.importId)">不通过</el-button>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" class-name="status-col" min-width="60px">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" :disabled=!row.disabled @click="handleManuLog(row)">查看</el-button>
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
           :page-sizes="[5,10,15]"
           :total="total">
         </el-pagination>
       </div>
<!-- 填写意见 -->
    <el-dialog title="填写意见" :visible.sync="dialogUnpassedVisible">
    <el-form :model="form">
      <el-form-item label="意见" label-width="80px">
        <el-input type="textarea" v-model="form.checkLog" :autosize="{ minRows: 3}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogUnpassedVisible = false">取 消</el-button>
      <el-button type="primary" @click="unpassed">确 定</el-button>
    </div>
  </el-dialog>
<!-- 查看审核意见 -->
    <el-dialog title="审核意见" :visible.sync="dialogMlogVisible">
      <el-table :data="mlogData">
        <el-table-column property="date" label="日期"></el-table-column>
        <el-table-column property="name" label="审核人"></el-table-column>
        <el-table-column property="result" label="审核意见"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>




<script>

import Vue from "vue";
import {fetchListRemove3, getExcel,passFile, unpassFile,getMonitorInfo} from "@/api/batchInput";
import{getInfo} from "@/api/user";
import {fetchTableList} from "@/api/table";


export default {


  filters: {
  statusFilter(status) {
      const statusMap = {
        已通过: "success",
        待审核: "info",
        未通过: "danger",
      };
      return statusMap[status];
    }
  },

  data() {

    return {
      tableList: [],
      userId:null,
      list: null,
      monitorInfoList: [],
      statusList: [
        {
          label: "待审核",
          value: 2
        },
        {
          label: "已通过",
          value: 4
        },
        {
          label: "未通过",
          value: 5
        }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        checkUserName: null,
        recordId: null,
        importUserName: null,
        status: null
      },
      dialogMlogVisible: false,
      dialogUnpassedVisible:false,
      form:{
        checkLog:null,
        userId:null,
        importTaskId:null
        },
      mlogData: [{
          date: null,
          name: null,
          result: null
        }],
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
    getRegList(){
      fetchTableList().then(response => {
        for (let i in response.data){
          let data={};
          data.label = response.data[i].excelName;
          data.value = response.data[i].recordId;
          this.tableList.push(data);
          }
      });
    },
//获取列表数据
    getList() {
      this.listLoading = true;
      fetchListRemove3(this.listQuery).then(response => {
        this.list = response.data.rows;
        for(var i in this.list){
          if(this.list[i].status==2){
           this.list[i].status = "待审核";
           this.list[i].disabled = false;
          }
          else if(this.list[i].status==4){
            this.list[i].status="已通过";
            this.list[i].disabled = true;
          }
          else if(this.list[i].status==5){
            this.list[i].status="未通过";
            this.list[i].disabled = true;
          }
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
    handleSizeChange(val){
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.listQuery.pageNum = val;
      this.getList();
    },
//获取登录用户id
    getUserId() {
     getInfo().then(response =>{
       this.userId=response.data.userId;
     })
    },
//搜索功能
    onSearch() {
      this.listQuery.pageNum = 1;
      this.getList();
    },

//下载文件链接
    handleDownload(row) {
       getExcel(row.importId).then(response =>{
           // 创建隐藏的可下载链接
          var content = response;
          var elink = document.createElement('a');
          elink.download = row.excelName + "-" + this.getTimeNow() + ".xlsx";
          elink.style.display = 'none';
          // 字符内容转变成blob地址
          var blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          // 触发点击
          document.body.appendChild(elink);
          elink.click();
          // 然后移除
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
       });
    },

//通过
    handlePassed(importId){
      this.$confirm("确定要通过这条记录吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () =>{
          await passFile(importId,this.userId).then(response =>{
            this.$message({
              message: "操作成功！",
              type: "success"
            });
          });
          setTimeout(()=>{
            this.getList();
          },500)
        });

    },

//不通过
    handleUnpassed(importId){
      this.form.checkLog=null;
      this.form.userId=this.userId;
      this.form.importTaskId=importId;
      this.dialogUnpassedVisible = true;
    },
//不通过处理
    async unpassed() {
      await unpassFile(this.form).then(response =>{
        this.$message({
          message: "操作成功！",
          type: "success"
        });
        this.dialogUnpassedVisible = false;
      });
      this.getList();
    },
//展示人工审核结果
    handleManuLog(row) {
      this.mlogData[0].date=row.checkTime;
      this.mlogData[0].name=row.checkUserName;
      this.mlogData[0].result=row.checkLog;
      this.dialogMlogVisible = true;
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
  }
};
</script>
<style>
  .el-table .cell{
           white-space:pre-line;
       }
</style>
