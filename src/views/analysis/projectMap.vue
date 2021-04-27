<template>
  <div class="app-container">
      <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;margin-top:30px;"
          type="primary"
          size="small"
          @click="showData()"
        >查询结果</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="站点类型：">
            <el-select
              v-model="listQuery.keyword1"
              placeholder="请选择类别"
              clearable
              @change="selectFirstCategory()"
            >
              <el-option
                v-for="item in firstCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="数据类型：">
            <el-select
              v-model="listQuery.keyword2"
              placeholder="请选择类别"
              clearable
              @change="selectSecondCategory()"
            >
              <el-option
                v-for="item in secondCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="具体站点：">
            <el-select v-model="listQuery.keyword3" :placeholder="holder" clearable>
              <el-option
                v-for="item in thirdCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据项">
              <el-select v-model="value1" multiple placeholder="请选择">
                <el-option
                  v-for="option in selectOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="选择时间">
            <el-date-picker
              v-model="pickTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      </el-card>
      <el-card class="operate-container" style="margin-top:20px" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>径流小区数据展示</span>
    </el-card>
       <div class="table-container" style="margin-top:20px">
      <el-table
        ref="equipmentTable"
        :data="list"
        style="width: 100%"
        v-loading="listLoading"
        border
        v-show="t1"
      >
          <el-table-column  v-for="(item,key) in mainOptions" :key="key" 
           v-if="value1.indexOf(key) > -1" :label="item.label" align="center" >
          <template slot-scope="scope" >{{scope.row["i"+(item.value+1)]}}</template>
          </el-table-column>
        
        
      </el-table>

       <el-table
        ref="equipmentTable2"
        :data="list2"
        style="width: 100%"
        v-loading="listLoading"
        border
        v-show="t2"
        id = "tabel1"
      >
      <div>
         <el-table-column  v-for="(item,key) in progressOptions" :key="key" 
           v-if="value1.indexOf(key) > -1" :label="item.label" align="center" >
          <template slot-scope="scope" >{{scope.row["i"+(item.value+1)]}}</template>
          </el-table-column>
      </div>
      
        <!-- <el-table-column label="过程号" align="center" >
          <template slot-scope="scope">{{scope.row.i1}}</template>
        </el-table-column>
        <el-table-column label="一次产流" align="center" >
          <template slot-scope="scope">{{scope.row.i2}}</template>
        </el-table-column>
        <el-table-column label="日降雨量" align="center" >
          <template slot-scope="scope">{{scope.row.i3}}</template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">{{scope.row.i4}}</template>
        </el-table-column> -->
    
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    // components: { dashboard },
    data() {
      return {
        // bgi:''
        value1:[],
        pickTime:"",
        // value2:[1,2],
        t1:true,
        t2:false,
        list:[{
          i1:1,
          i2:123.00,
          i3:213,
          i4:213,
          i5:39219,
          i6:219390,
          i7:"2020-11-1"
        },{
          i1:2,
          i2:123.00,
          i3:213,
          i4:213,
          i5:39219,
          i6:219390,
          i7:"2020-11-2"
        },{
          i1:3,
          i2:123.00,
          i3:213,
          i4:213,
          i5:39219,
          i6:219390,
          i7:"2020-11-3"
        }],

        list2:[{
          i1:1,
          i2:20,
          i3:300,
          i4:"2020年11月1日"
        },
        {
          i1:2,
          i2:30,
          i3:300,
          i4:"2020年11月2日"
        },
        {
          i1:3,
          i2:30,
          i3:300,
          i4:"2020年11月3日"
        },
        {
          i1:4,
          i2:301,
          i3:303,
          i4:"2020年11月4日"
        }],
        holder:"请选择站",
        listQuery: {
          keyword1: null,
          keyword2: null,
          keyword3: null,
          modelNumber: null,
          pageNum: 1,
          pageSize: 10
        },
        firstCategoryOptions: [{value:1,label:"径流小区"},{value:2,label:"小流域站"},{value:3,label:"风蚀场"}],
        secondCategoryOptions: [{value:1,label:"个体数据"},{value:2,label:"总体数据"}],
        thirdCategoryOptions: [{value:1,label:"01小区"},{value:2,label:"02小区"},{value:3,label:"03小区"}],
        selectOptions:[],
        mainOptions: [{value:0, label:"编号"},{value:1,label:"降雨量"}, {value:2, label:"径流量"}, {value:3, label:"土壤流失量"},
        {value:4, label:"降雨侵蚀力"},{value:5, label:"径流深"}],

        progressOptions: [{value:0, label:"过程号"}, {value:1, label:"一次产流"}, {value:2, label:"日降雨量"}, {value:3, label:"时间"}]
        
      }
    },
    created() {
      this.selectOptions = this.mainOptions
      // this.bgi = require("@/assets/images/总部.jpg")
    },
  //  watch:{
  //    value1:function(val){
  //      alert(val)
  //    }
  //  },

    methods:{
      showData(){
        
      },
       selectSecondCategory(){
          if(this.listQuery.keyword2 == 2){
              this.holder = "无需选择"
              this.thirdCategoryOptions = []
              this.t1 = true
              this.t2 = false
              this.value1 = []
              this.listQuery.keyword3 = null
              this.selectOptions = this.mainOptions
          }else{
            this.holder = "请选择具体站点"
            this.thirdCategoryOptions = [{value:"1",label:"01小区"},{value:"2",label:"02小区"},{value:"3",label:"03小区"}]
            this.t1 = false
            this.t2 = true
            this.value1 = []
            this.selectOptions = this.progressOptions
            
          }
        }
    }
  }
   
  
</script>

<style scoped>
 
</style>
