<template>
  <div class="app-container">
    <el-select
      v-model="listQuery.recordId"
      placeholder="模板类型"
      clearable
      class="filter-item"
      style="width: 200px"
    >
      <el-option
        v-for="item in this.tableList"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      v-model="listQuery.createAuthorName"
      placeholder="创建人"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="onSearch"
    />
    <el-input
      v-model="listQuery.updateAuthorName"
      placeholder="修改人"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="onSearch"
    />
    <el-select
      v-model="listQuery.excelState"
      placeholder="状态"
      clearable
      class="filter-item"
      style="width: 200px"
    >
      <el-option
        v-for="item in this.statusList"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    <el-button type="primary" @click="handleAddRule" icon="el-icon-plus">新增</el-button>

    <el-table :data="list" stripe style="width: 100%;margin-top:30px;" v-loading="listLoading" border>
      <el-table-column align="center" label="模板名称">
        <template slot-scope="scope">{{ scope.row.excelName }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="创建日期">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="创建人">
        <template slot-scope="scope">{{ scope.row.user.createAuthorName }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="最新更新时间">
        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="修改人">
        <template slot-scope="scope">{{ scope.row.user.updateAuthorName }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="是否可用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.excelState"
            style="display: block"
            active-color="#13ce66"
            @change="handleStatusChange(scope.row.recordId)"
            :active-value="true"
            :inactive-value="false"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row.recordId)">规则设置</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.recordId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 翻页设置 -->
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
<!-- 新增规则 -->
   <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'更新规则':'新增规则'" width="50%" :show-close="shClose" :close-on-click-modal="cModal" :close-on-press-escape="cEscape">
      <el-form  :model="regForm" label-width="100px">
        <el-form-item v-if="dialogType=='new'" label="更新表单"  label-width="100px">
          <el-select v-model="regForm.recordId" placeholder="请选择表"  @change="getTableItem(regForm.recordId)">
            <el-option v-for="item in noRegTableList" :label="item.excelName" :value="item.recordId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="item in regForm.tableList" :label="item.table_field_name_zh">
          <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addReg(item)"></el-button>
          <p v-for="(i, index) in regMap[item.record_detail_id]" :key="i.key">
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="delReg(i.key,item)"></el-button>
              <el-select v-if="regMap[item.record_detail_id]!=null" v-model="i.regulationId" placeholder="请选择规则"  @change="getRegForm(index,item.table_field_type,item.record_detail_id,i.regulationId,item.table_field_name)">
                <el-option v-for="it in regList[item.table_field_type]" :label="it.regulationName" :value="it.regulationId"></el-option>
              </el-select>
              <label v-if="i.regStyle=='enum'">
                <el-radio v-model="i.jsonParamter[i.regMethod]" label="true" @change="radioChange">是</el-radio>
                <el-radio v-model="i.jsonParamter[i.regMethod]" label="false" @change="radioChange">否</el-radio>
              </label>

              <label v-else-if="i.regStyle=='range'">
                最小值：
                <el-input style="width:150px;" type="number" v-model.number="i.jsonParamter['Min']" @input="onInput()" @blur="checkNum(item.record_detail_id,i,index,'Min')"></el-input>
                最大值：
                <el-input style="width:150px;" type="number" v-model.number="i.jsonParamter['Max']" @input="onInput()" @blur="checkNum(item.record_detail_id,i,index,'Max')"></el-input>
              </label>
              <label v-else-if="i.regStyle=='length'">
                最大长度：
                <el-input style="width:150px;" type="number" v-model.number="i.jsonParamter[i.regMethod]" @input="onInput()" @keyup.native="postiveNum($event)" ></el-input>
              </label>
          </p>

        </el-form-item>
      </el-form>
      <div style="text-align:right;">
      <el-button @click="dialogCancel()">取消</el-button>
      <el-button type="primary" @click="confirmRule()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  updateStatus,
  deleteReg,
  fetchNoRegList,
  getTableDetail,
  getRegDetail,
  commit,
  regDetail
} from "@/api/regulation";
import{getInfo} from "@/api/user";
import {fetchTableList} from "@/api/table";
import Vue from "vue";

export default {
  data() {
    return {
      userId:null,
      tableList: [],
      noRegTableList: [],
      total: 0,
      shClose:false,
      cEscape:false,
      cModal:false,
      listLoading: true,
      list: [],
      listQuery:{
        pageNum: 1,
        pageSize: 10,
        excelState:null,
        createAuthorName: null,
        recordId: null,
        updateAuthorName: null
      },
      statusList: [
        {
          label: "可用",
          value: 'true'
        },
        {
          label: "不可用",
          value: 'false'
        }
      ],
      dialogVisible: false,
      dialogType: "",
      regForm:{
        recordId: null,
        tableList:[]
      },
      regMap: {},//存放最后要制定的规则列表
      listSet: new Set(),//存放某项数据是否弹出规则制定 即是否点了添加
      regList: {}//存放每一种数据有哪些规则
    };
  },
  computed: {},
  created() {
    this.listQuery.pageNum = 1;
    this.getList();
    this.getRegList();
    this.getUserId();
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
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
         this.list = response.data.rows;
         this.total = response.data.total;
      });
    },
    getNoRegList(){
      fetchNoRegList().then(response => {
        this.noRegTableList = response.data;
      })
    },
    getUserId() {
     getInfo().then(response =>{
       this.userId=response.data.userId;
     })
    },
    handleSizeChange(val){
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.listQuery.pageNum = val;
      this.getList();
    },
    onSearch(){
      this.getList();
    },
    handleAddRule() {
      this.getNoRegList();
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleDelete(recordId) {
     this.$confirm("确定要删除这条校验模版吗？", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
       }).then(() => {
           deleteReg(recordId).then(response => {
             if(response.code==200){
               this.$message({
                 type: "success",
                 message: response.message
               });
             }
             else if(response.code==500){
               this.$message({
                 type: "error",
                 message: response.message
               });
             }
             this.getList();
           });
          });
     },

    handleStatusChange(id) {
      updateStatus(id).then(response => {
        this.$message({
          message: "状态修改成功",
          type: "success"
        });
      });
    },
    getTableItem(recordId){
      getTableDetail(recordId).then(response =>{
        this.regForm.tableList = response.data;
      })
    },
    getRegForm(index,type,record_detail_id,regulationId,record_detail_field){
      this.regMap[record_detail_id][index].record_detail_id=record_detail_id;
      this.regMap[record_detail_id][index].record_detail_field=record_detail_field;
      for(let item of this.regList[type]){
        if(item.regulationId == regulationId){
          this.regMap[record_detail_id][index].jsonParamter={};
          if(item.regulationStyle == "enum"){
            this.regMap[record_detail_id][index].regStyle = "enum";
            for(let key in item.jsonParameter){
              this.regMap[record_detail_id][index].jsonParamter[key]="false";
              this.regMap[record_detail_id][index].regMethod=key;
            }
          }else if(item.regulationStyle=="range"){
            this.regMap[record_detail_id][index].regStyle = "range";
            this.regMap[record_detail_id][index].jsonParamter["Max"]="";
            this.regMap[record_detail_id][index].jsonParamter["Min"]="";
          }else if(item.regulationStyle=="length"){
            this.regMap[record_detail_id][index].regStyle = "length";
            for(let key in item.jsonParameter){
              this.regMap[record_detail_id][index].jsonParamter[key]="";
              this.regMap[record_detail_id][index].regMethod=key;
            }
        }

      }
    }
      this.$forceUpdate();

    },
    async confirmRule(){
      let resList = [];
      for(let key in this.regMap)
      {
        let set = new Set();
        for(let i=0; i<this.regMap[key].length; i++){
          if(this.regMap[key][i].regulationId!=null){
            if(!set.has(this.regMap[key][i].regulationId)){
              set.add(this.regMap[key][i].regulationId);
              let resItem = {
                record_detail_id:this.regMap[key][i].record_detail_id,
                regulation_id:this.regMap[key][i].regulationId,
                record_detail_field:this.regMap[key][i].record_detail_field,
                rec_reg_paramter:"",
                jsonParamter:this.regMap[key][i].jsonParamter,
                recRegUserId:this.userId
              }
              resList.push(resItem);
            }
            else{
              let name = null;
              for(let i=0; i<this.regForm.tableList.length;i++){
                if(this.regForm.tableList[i].record_detail_id==key){
                  name = this.regForm.tableList[i].table_field_name_zh;
                }
              }
              this.$message.warning(name+"字段存在相同规则，请进行更改");
              return;
            }
          }
          else{
            let name = null;
            for(let i=0; i<this.regForm.tableList.length;i++){
              if(this.regForm.tableList[i].record_detail_id==key){
                name = this.regForm.tableList[i].table_field_name_zh;
              }
            }
            this.$message.warning(name+"字段存在未设置的规则，请进行更改");
            return;
          }
        }
      }
      await commit(resList).then(response =>{
        if(response.code==500){
          this.$message({
            message: response.message,
            type: "error"
          });
        }else if(response.code==200){
          this.$message({
            message: response.message,
            type: "success"
          });
        }

        this.dialogCancel();
      });
      this.getList();
    },

   async handleEdit(recordId) {
     let method="";
      this.dialogType = "edit";
      this.regForm.recordId = recordId;
      this.getTableItem(recordId);
      await regDetail(recordId).then(response =>{
        let dList = response.data;
        for(let item of dList){
          if(!this.listSet.has(item.regulation.regulationType)){
            this.listSet.add(item.regulation.regulationType);
            getRegDetail(item.regulation.regulationType).then(response =>{
              this.$set(this.regList,item.regulation.regulationType,response.data);
            });
          }
          for(let key in item.jsonParamter){
            method=key;
          }
          if(this.regMap[item.record_detail_id]!=null){
            this.regMap[item.record_detail_id].push({
              regulationId:item.regulation_id,
              key:Date.now(),
              record_detail_id:item.record_detail_id,
              record_detail_field:item.record_detail_field,
              jsonParamter:item.jsonParamter,
              regStyle:item.regulation.regulationStyle,
              regMethod:method
            });
          }
          else{
            this.regMap[item.record_detail_id]=[{
              regulationId:item.regulation_id,
              key:Date.now(),
              record_detail_id:item.record_detail_id,
              record_detail_field:item.record_detail_field,
              jsonParamter:item.jsonParamter,
              regStyle:item.regulation.regulationStyle,
              regMethod:method
            }];
          }
        }
      })
      this.dialogVisible = true;
    },

    async addReg(item){
      if(!this.listSet.has(item.table_field_type)){
        this.listSet.add(item.table_field_type);
        await getRegDetail(item.table_field_type).then(response => {
          this.$set(this.regList,item.table_field_type,response.data);
        });
      }

      if(this.regMap[item.record_detail_id]!=null){
         this.regMap[item.record_detail_id].push({
          regulationId:null,
          key:Date.now(),
          record_detail_id:null,
          record_detail_field:null,
          jsonParamter:{},
          regStyle:null,
          regMethod:null

          });
      }
      else{
        this.regMap[item.record_detail_id]=[{
          regulationId:null,
          key:Date.now(),
          record_detail_id:null,
          record_detail_field:null,
          jsonParamter:{},
          regStyle:null,
          regMethod:null
          }];
      }
      this.$forceUpdate();
    },
    delReg(key, item){
      for(let i in this.regMap[item.record_detail_id]){
        if( this.regMap[item.record_detail_id][i].key == key){
          this.regMap[item.record_detail_id].splice(i,1);
          this.$forceUpdate();
        }
      }
    },
    radioChange(value){
      this.$forceUpdate();
    },
    onInput(){
      this.$forceUpdate();
    },
    dialogCancel(){
     this.regForm.recordId=null;
     this.regForm.tableList=[];
     this.regMap={};
     this.regList={};
     this.listSet.clear();
     this.dialogVisible=false;
    },
    checkNum(record_detail_id,item,index,type){
      if((item.jsonParamter["Min"]!="")&&(item.jsonParamter["Max"]!="")){
        if(item.jsonParamter["Min"]>=item.jsonParamter["Max"]){
          this.$message.warning('最小值需小于最大值');
          this.regMap[record_detail_id][index].jsonParamter[type]="";
          this.$forceUpdate();
        }
      }
    },
    postiveNum(e){
      let keyNum = window.events?e.keycode:e.which;
      if(keyNum==189||keyNum==190||keyNum==110||keyNum==109){
        this.$message.warning('禁止输入小数及负数')
        e.target.value=''
      }
    },

  }
};
</script>
