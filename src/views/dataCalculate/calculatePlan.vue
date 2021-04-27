<template>
  <div class="app-container">
      <el-card class="filter-container" shadow="never">
      <el-date-picker
        v-model="time"
        type="daterange"
        format="yyyy-MM-dd HH:mm:ss"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions" style="width: 30%">
      </el-date-picker>
      <el-select  style="width:10%" v-model="listQuery.calculateType" placeholder="计算类型" clearable @change="typeSelectEvent">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select style="width:10%"  v-model="listQuery.calculateStatus" placeholder="计算状态" clearable @change="statusSelectEvent">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input style="width:20%" v-model="listQuery.calculatePlanName" placeholder="计算任务名称" @keyup.enter.native="handleFilter" clearable></el-input>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="width:80px;margin-top: 0.55%;align-content: center"
 	      @click="handleFilter"

      >查询</el-button>
    </el-card>
    <el-card shadow="never" style="margin-top:20px">
    <el-table
      :data="list"
      style="width: 100%">
<!--      <el-table-column-->
<!--        prop="planId"-->
<!--        label="任务编号"-->
<!--        width="90">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="calculatePlanName"
        align="left"
        label="任务名"
        min-width="19%"
        >
<!--        style="width:12%"-->
      </el-table-column>
      <el-table-column
        prop="calculateType"
        align="left"
        label="任务类型"
        min-width="11%"
         >
<!--        style="width:5%"-->
      </el-table-column>
      <el-table-column
        prop="createPlanTime"
        align="center"
        label="创建任务时间"
        min-width="14%"
         >
<!--        style="width:10%"-->
      </el-table-column>
      <el-table-column
        prop="calculateStatus"
        label="任务状态"
        align="center"
        min-width="10%"
        >
<!--        style="width:5%"-->
      </el-table-column>
      <el-table-column
        prop="startPlanTime"
        label="开始计算时间"
        align="center"
        min-width="14%">
<!--        style="width:10%"-->
      </el-table-column>
      <el-table-column
        prop="endPlanTime"
        align="center"
        label="结束计算时间"
        min-width="14%" >
<!--        style="width:10%"-->
      </el-table-column>
      <el-table-column
        label="文件链接"
        min-width="8%"
        align="center">
        <template slot-scope="{row}">
          <el-tag @click.native="handleDownload(row)">
            <i class="el-icon-download"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="calculateNum"
        align="center"
        label="数据量"
       min-width="7%">
<!--        style="width:1%"-->
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="errorMessage"-->
<!--        width="90"-->
<!--        label="错误信息">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="remark"-->
<!--        width="90"-->
<!--        label="备注">-->
<!--      </el-table-column>-->
     <el-table-column prop="errorMsg" align="center" label="审核" min-width="24%">
        <template slot-scope="scope">
          <el-button  type="danger"  size="small"  @click="showPassMessage(scope.row.id)">审核通过</el-button>
          <el-popover
            placement="top-start"
            title="审核信息"
            trigger="hover"

            >

            <!--            v-if="scope.row.calculateStatus==4" v-if="scope.row.calculateStatus=='计算错误'-->
            {{scope.row.errorMsg?scope.row.errorMsg:'无'}}
            <el-button size="small"  slot="reference" >
            审核信息</el-button>

          </el-popover>
        </template>
     </el-table-column>
      <el-table-column  prop="errorMsg" align="center" label="操作" min-width="10%" >
        <template slot-scope="scope">
<!--          <el-popover-->
<!--            placement="top-start"-->
<!--            title="备注"-->
<!--            width="90"-->
<!--            trigger="hover"-->
<!--            content="这是一段备注内容,这是一段备注内容">-->
<!--            <el-button slot="reference">备注</el-button>-->
<!--          </el-popover>-->
<!--          v-show="row.calculateType==4"-->

          <el-button  v-if="scope.row.calculateStatus=='计算错误'" type="primary" size="small" @click="restartCalculate(scope.row.id)">重启计算</el-button>

<!--          <el-button type="primary" @click="errorVisible = true">错误信息</el-button>-->
<!--          <el-button type="pramary" @click="detailVisible = true">备注信息</el-button>-->
          <el-dialog title="是否重新启动计算" :visible.sync="recalculateVisible" width="30%" :before-close="handleClose" center>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="restart">确 定</el-button>
                    <el-button @click="recalculateVisible = false">取 消</el-button>
                  </span>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <pagination
      v-show="totalElements>0"
      :total=totalElements
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

<!--    <div class="pagination-container">-->
<!--      <el-pagination-->
<!--        background-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        layout="total, sizes,prev, pager, next,jumper"-->
<!--        :page-size="listQuery.pageSize"-->
<!--        :page-sizes="[10,15,20]"-->
<!--        :current-page.sync="listQuery.pageNum"-->
<!--        :total="totalElements"-->
<!--      ></el-pagination>-->
<!--    </div>-->
  </div>
</template>

<script>
  import { getCalculatePlanList,restartCalculatePlan,passCalculate} from '@/api/calculatePlan'
  import Pagination from "@/components/Pagination";
  export default {
        name: "calculatePlan",
        components: { Pagination },
        data() {
              return {
                list: [],
                listLoading: true,
                listQuery: {
                  calculatePlanName: "",
                  calculateStatus: "",
                  calculateType: "",
                  startTime:"",
                  endTime: "",
                  pageNum: 1,
                  pageSize: 10
                },
                id:'',
                time:'',
                restartMessage:{
                  code:'',
                  message:'',
                  data:''
                },
                passMessage:'',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                options: [
                    {
                    value: 1,
                    label: '降雨计算'
                }, {
                    value: 2,
                    label: '径流小区泥沙计算'
                }, {
                    value: 3,
                    label: '小流域泥沙计算'
                }, {
                    value: 4,
                    label: '径流小区土壤TDR计算'
                }, {
                    value: 5,
                    label: '径流小区土壤烘干法计算'
                },{
                    value: 6,
                    label: '野外土壤TDR计算'

                  },{
                    value: 7,
                    label: '野外土壤烘干法计算'

                  }],

                options2: [
                    {
                    value: 1,
                    label: '待计算'
                }, {
                    value: 2,
                    label: '计算中'
                }, {
                    value: 3,
                    label: '已完成'
                }, {
                    value: 4,
                    label: '计算错误'
                }],
                recalculateVisible: false,
                type_data :{
                  "1":"降雨计算",
                  "2":"径流小区泥沙计算",
                  "3":"小流域泥沙计算",
                  "4":"径流小区土壤TDR计算",
                  "5":"径流小区土壤烘干法计算",
                  "6":"野外土壤TDR计算",
                  "7":"野外土壤烘干法计算"
                },
                totalPages:1,
                totalElements:1,
                status_data :{
                  "1":"待计算",
                  "2":"计算中",
                  "3":"已完成",
                  "4":"计算错误"
                }

              };
        },
        //lin
        created() {
          this.getList()
        },
        methods: {
            showPassMessage(id){
              passCalculate(id).then(res =>{
                this.$notify({
                  title: '审核结果',
                  message: res.data,
                  type: 'success',
                  duration: 2000
                })
              })

            },
            getList() {
              this.listLoading = true

              // console.log("time:"+this.dateTrans(this.time[0])+typeof(this.time[0])+" "+this.time [1]+" "+typeof(this.time[1]))
              getCalculatePlanList(
                this.listQuery
              ).then(response => {
                this.list = response.data.content.map(function(item){
                  item.calculateStatus = this.typeTrans(item.calculateStatus,this.status_data)
                  item.calculateType = this.typeTrans(item.calculateType,this.type_data)
                  return item
                },this)
                this.totalElements = response.data.totalElements
                this.totalPages = response.data.totalPages
                //Just to simulate the time of the request
                setTimeout(() => {
                  this.listLoading = false
                }, 1.5 * 1000)
              })
            },
          dateTrans(d){
            return d.getFullYear()
              + '-'
              +this.p((d.getMonth() + 1))
              + '-' + this.p(d.getDate())
              + ' ' + this.p(d.getHours())
              + ':' + this.p(d.getMinutes() )
              + ':' +this.p(d.getSeconds());
          },
          p(s){
            return s < 10 ? '0' + s : s
          },
          typeTrans(key,data){
              key =''+key
              return data[key]

          },
          restartCalculate(id){
            this.recalculateVisible=true
            this.id=id;
              console.log(id)
          },
          restart(){
            restartCalculatePlan(this.id).then(response =>{
              this.restartMessage = response
              this.getList()
              this.$notify({
                title: '重启',
                message: this.restartMessage.message,
                type: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.listLoading = false
              }, 1.5 * 1000)
              // alert(this.restartMessage.message)
            }).catch(err => {
              console.log(err)
            })
            this.recalculateVisible=false
          },
          handleFilter() {
              this.listQuery.page = 1
              if(this.time){
                this.listQuery.startTime = this.dateTrans(this.time[0])
                this.listQuery.endTime = this.dateTrans(this.time[1])
              }
              else{
                this.listQuery.startTime = ""
                this.listQuery.endTime = ""

              }
              console.log("startTime"+this.listQuery.startTime)
              // if(!this.listQuery.endTime)
              //   this.listQuery.startTime.Format("yyyy-MM-dd hh:mm:ss");
              this.getList()
          },
          handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
          typeSelectEvent(e){
            //  console.log(e)
            this.listQuery.calculateType = e;
            //  console.log(this.listQuery.calculateType)
            this.getList()

          },
          statusSelectEvent(e){
            //  console.log(e)
            this.listQuery.calculateStatus = e;
            //  console.log(this.listQuery.calculateType)
            this.getList()

          },
          handleDownload(row){
              //创建隐藏的可下载的链接
            let elink = document.createElement('a');
            elink.download = row.calculatePlanName + "-" + this.getTimeNow() + ".zip";
            elink.style.display = 'none';

              //插入url地址process.env.VUE_APP_CALCULATE_DOWNLOAD_API row.id
            elink.href = 'http://112.98.239.146:8030/'+ "getResult?" + "id=" +row.id;
              //触发点击
            document.body.appendChild(elink);
            elink.click();
              //然后移除
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          },
          getTimeNow() {
            let aDate = new Date()
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
    }
</script>

<style scoped>

</style>
