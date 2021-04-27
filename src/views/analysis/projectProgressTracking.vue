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
            <el-select v-model="listQuery.keyword3" 
              :placeholder="holder" 
              clearable
              @change="selectThirdCategory()"
             >
             
              <el-option
                v-for="item in thirdCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="统计级别：">
            <el-select
              v-model="listQuery.keyword4"
              placeholder="请选择统计级别"
              clearable
              @change="selectFourthCategory()"
            >
              <el-option
                v-for="item in fourthCategoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
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
    
     <el-card v-if="total" shadow="never" style="margin-top:20px">
       <ve-bar :title="totalTitle" :data="chartData2" :settings="chartSettings2"></ve-bar>
       <ve-line :title="totalTitle" :data="chartData2" :settings="chartSettings2"></ve-line>
       <ve-pie :title="pieTitle" :data="chartData3" :settings="chartSettings2"></ve-pie>
     </el-card>
     <el-card v-else  style="margin-top:20px">
         <ve-line :title="individualTitle" :data="chartData" :settings="chartSettings"></ve-line>
     </el-card>
   </div>
</template>

<script>
import "echarts/lib/component/title";
    export default {
        // name: "projectProgressTracking"
      data() {
        this.chartSettings = {
          axisSite: { right: ['土壤流失率'] },
          yAxisType: ['KMB', 'percent'],
          yAxisName: ['数值', '比率'],
         
        }
        // this.chartSettings2 = {
        //   dimension: ['日期'],
        //   metrics: ['访问用户']
        // }
        return {
          pieTitle:{
            show:true,
            text:"各小区径流泥沙占比"
          },
             totalTitle : {
              show:true,
              text: '径流小区统计',
             },
              individualTitle : {
              show:true,
              text: '径流小区统计',
             },
           chartData: {
            columns: ['日期', '径流量', '降雨量', '土壤流失率'],
            rows: [
              { '日期': '1/1', '径流量': 1393, '降雨量': 1093, '土壤流失率': 0.32 },
              { '日期': '1/2', '径流量': 3530, '降雨量': 3230, '土壤流失率': 0.26 },
              { '日期': '1/3', '径流量': 2923, '降雨量': 2623, '土壤流失率': 0.76 },
              { '日期': '1/4', '径流量': 1723, '降雨量': 1423, '土壤流失率': 0.49 },
              { '日期': '1/5', '径流量': 3792, '降雨量': 3492, '土壤流失率': 0.323 },
              { '日期': '1/6', '径流量': 4593, '降雨量': 4293, '土壤流失率': 0.78 }
            ]
          },
           chartData2: {
            columns: ['日期', '降雨量', '径流量', '泥沙量'],
            rows: [
              { '日期': '1/1', '降雨量': 1393, '径流量': 1093, '泥沙量': 3221 },
              { '日期': '1/2', '降雨量': 3530, '径流量': 3230, '泥沙量': 2610 },
              { '日期': '1/3', '降雨量': 2923, '径流量': 2623, '泥沙量': 1876 },
              { '日期': '1/4', '降雨量': 1723, '径流量': 1423, '泥沙量': 1149 },
              { '日期': '1/5', '降雨量': 3792, '径流量': 3492, '泥沙量': 1323 },
              { '日期': '1/6', '降雨量': 4593, '径流量': 4293, '泥沙量': 1178 }
            ]
          },
          chartData3: {
              columns: ['小区号', '泥沙量'],
              rows: [
                { '小区号': '1001', '泥沙量': 1393 },
                { '小区号': '1002', '泥沙量': 3530 },
                { '小区号': '1003', '泥沙量': 2923 },
                { '小区号': '1004', '泥沙量': 1723 },
                { '小区号': '1005', '泥沙量': 3792 },
                { '小区号': '1006', '泥沙量': 4593 }
              ]
            },
          total:true,
          holder:"无需选择",
          listQuery: {
            keyword1: "径流小区",
            keyword2: "总体数据",
            keyword3: null,
            keyword4: "日",
            modelNumber: null,
            pageNum: 1,
            pageSize: 10
          },
          firstCategoryOptions: [{value:"径流小区",label:"径流小区"},{value:"小流域站",label:"小流域站"},{value:"风蚀场",label:"风蚀场"}],
          secondCategoryOptions: [{value:"1",label:"过程数据"},{value:"2",label:"总体数据"}],
          thirdCategoryOptions: [],
          fourthCategoryOptions: [{value:"1",label:"日"},{value:"2",label:"月"},{value:"3",label:"年"}]
        }
      },
      created(){
        this.changeTitle()
      },
      methods:{
        selectFirstCategory(){
          this.changeTitle()
          
        },
        selectSecondCategory(){
          this.changeTitle()
          if(this.listQuery.keyword2 == 2){
              this.holder = "无需选择"
              this.thirdCategoryOptions = []
              this.total = true
              
          }else{
            this.holder = "请选择具体站点"
            this.thirdCategoryOptions = [{value:"1",label:"01小区"},{value:"2",label:"02小区"},{value:"3",label:"03小区"}]
            this.total = false
           
          }
        },
        selectThirdCategory(){
          this.changeTitle()
        },
        selectFourthCategory(){
          this.changeTitle()
        },
        changeTitle(){
            this.totalTitle.text = this.listQuery.keyword1 + "统计"+ this.listQuery.keyword4+"统计"
            this.individualTitle.text = this.listQuery.keyword1+"(" + this.listQuery.keyword3 + ")"+ this.listQuery.keyword4+"统计"
        },
        changeData(){
          
        }
        
      }
      
    }
</script>

<style scoped>

</style>
