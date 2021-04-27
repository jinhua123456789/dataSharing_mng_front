<template>
  <div class="app-container">
    <el-row :gutter="10">

<!--        <el-card class="box-card">-->
        <el-card class="box-card">

          <div slot="header" class="clearfix">
            <el-row>
            <el-col :span="3">
            <el-select v-model="listQuery.calculateType" placeholder="请选择" @change="selectEvent">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-col>
            <el-col :span="16">
            <el-input v-if="listQuery.calculateType==1" v-model="listQuery.name" placeholder="小流域控制站名称" prefix-icon="el-icon-search" clearable style="width: 200px;"></el-input>
            <el-button type="primary" @click="handleFilter">搜索</el-button>
            </el-col>
<!--            <el-button type="primary" @click="newDalogVisible = true">新增</el-button>-->
<!--            <el-dialog title="新增计算系数" :visible.sync="newDalogVisible" width="30%" :before-close="handleClose">-->
<!--                <el-form>-->
<!--                  <el-form-item label="计算类型：" label-width="90px">-->
<!--                    <el-select v-model="typeValue" placeholder="请选择">-->
<!--                      <el-option-->
<!--                        v-for="item in options"-->
<!--                        :key="item.value"-->
<!--                        :label="item.label"-->
<!--                        :value="item.value">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="Cd:" label-width="90px">-->
<!--                    <el-input placeholder="1.2" style="width: 200px;float: left" v-model="cdValue"></el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="θ:" label-width="90px">-->
<!--                    <el-input placeholder="30" style="width: 200px;float: left" v-model="angelValue"></el-input>-->
<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--                <span slot="footer" class="dialog-footer">-->
<!--                    <el-button @click="newDalogVisible = false">取 消</el-button>-->
<!--                    <el-button type="primary" @click="newDalogVisible = false">确 定</el-button>-->
<!--                  </span>-->
<!--              </el-dialog>-->
            </el-row>
          </div>

<!--          <eForm ref="addform" :sup_this="sup_this" :is-add="true"></eForm>-->
          <!--表格渲染-->
<!--        <el-card shadow="never" style="margin-top:20px">-->
        <div class="container-table">
          <div v-if="listQuery.calculateType==1">
            <el-table :data="list" size="small" highlight-current-row style="width: 100%;">
              <el-table-column :show-overflow-tooltip="true" prop="code" label="小流域编号"/>
              <el-table-column :show-overflow-tooltip="true" prop="stationName" label="小流域控制站名"/>
              <el-table-column :show-overflow-tooltip="true" prop="currentFacility" label="测流设施"/>
              <el-table-column v-if="false"  prop="weirWidth"/>
              <el-table-column v-if="false"  prop="angle"/>
              <el-table-column v-if="false"  prop="cd"/>
              <el-table-column v-if="false"  prop="kb"/>
              <el-table-column v-if="false"  prop="kh"/>
              <el-table-column v-if="false"  prop="p"/>
              <el-table-column :show-overflow-tooltip="true" label="描述">

                <template slot-scope="scope" >
                  <div  v-if="scope.row.currentFacility==='矩形薄壁堰'||scope.row.currentFacility==='2'" >
                    <el-row >流量系数:{{scope.row.cd}}</el-row>
                    <el-row >堰宽(顶) :{{scope.row.weirWidth}}</el-row>
                    <el-row >校正参数kb:{{scope.row.kb}}</el-row>
                  </div>
                  <div  v-else-if="scope.row.currentFacility==='1'||scope.row.currentFacility==='三角形薄壁堰'" >
                    <el-row >流量系数:{{scope.row.cd}}</el-row>
                    <el-row >校正参数kh:{{scope.row.kh}}</el-row>
                    <el-row >堰口角:{{scope.row.angle}}</el-row>
                    <el-row v-show="scope.row.angle==90">堰宽(顶) :{{scope.row.weirWidth}}</el-row>
                    <el-row v-show="scope.row.angle==90">p:{{scope.row.p}}</el-row>
                  </div>
                  <div  v-else-if="scope.row.currentFacility==='3'||scope.row.currentFacility==='梯形薄壁堰'" >
                    <el-row >流量系数:1.86</el-row>
                    <el-row >堰宽 (顶):{{scope.row.weirWidth}}</el-row>
                  </div>
                  <div v-else>
                    <el-row >暂无</el-row>
                  </div>
                </template>

              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="操作" width="150px" align="center">
                <template slot-scope="scope">
                  <!--                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑参数</el-button>-->
                  <!--                <el-button size="small" type="primary" @click="issueTableShow(row)">拨付</el-button>-->
                  <el-button type="primary" @click="handleShowDialog(scope.row)">更新</el-button>
                  <el-dialog title="小流域三角形薄壁堰计算系数" :visible.sync="dialogVisible" width="35%" :before-close="handleClose" center>
                    <!--                  <a>小流域名称:东北小流域控制站</?/a>-->
                    <div style="margin: 2%">
                      <el-form label-position="left" label-width="125px" style="width: 100%">
                        <el-form-item label="控制站名称"   >
                          <div style="width: 60%;float: left">
                            <label >{{updateQuery.stationName}}</label>
                          </div>
                        </el-form-item>
                        <el-form-item label="流量系数Cd:"    >
                          <el-input  style="width: 60%;float: left" v-model.number="updateQuery.cd" clearable ></el-input>
                        </el-form-item>
                        <el-form-item label="kh:"  >
                          <el-input style="width: 60%;float: left" v-model.lazy="updateQuery.kh" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="堰口角angle:"    >
                          <el-input  style="width: 60%;float: left" v-model="updateQuery.angle" clearable ></el-input>
                        </el-form-item>
                        <el-form-item v-show="updateQuery.angle==90" label="堰宽(顶) weirWidth:"  >
                          <el-input style="width: 60%;float: left" v-model="updateQuery.weirWidth" clearable></el-input>
                        </el-form-item>
                        <el-form-item v-show="updateQuery.angle==90"  label="p:"  >
                          <el-input style="width: 60%;float: left" v-model="updateQuery.p" clearable></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                  </span>
                  </el-dialog>
                  <el-dialog title="小流域矩形薄壁堰计算系数" :visible.sync="dialogVisible2" width="35%" :before-close="handleClose" center>
                    <!--                  <a>小流域名称:东北小流域控制站</?/a>-->
                    <div style="margin: 2%">
                      <el-form label-position="left" label-width="125px">
                        <el-form-item label="控制站名称"   >
                          <div style="width: 60%;float: left">
                            <label >{{updateQuery.stationName}}</label>
                          </div>
                        </el-form-item>
                        <el-form-item label="流量系数Cd:"    >
                          <el-input  style="width: 60%;float: left" v-model="updateQuery.cd" clearable ></el-input>
                        </el-form-item>
                        <el-form-item  label="堰宽(顶) weirWidth:"  >
                          <el-input style="width: 60%;float: left" v-model="updateQuery.weirWidth" clearable></el-input>
                        </el-form-item>
                        <el-form-item  label="校正参数Kb:"  >
                          <el-input style="width: 60%;float: left" v-model="updateQuery.kb" clearable></el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                  </span>
                  </el-dialog>


                  <el-dialog title="小流域梯形薄壁堰计算系数" :visible.sync="dialogVisible3" width="35%" :before-close="handleClose" center>
                    <!--                  <a>小流域名称:东北小流域控制站</?/a>-->
                    <div style="margin: 2%">
                    <el-form label-position="left" label-width="125px">
                      <el-form-item label="控制站名称"   >
                        <div style="width: 60%;float: left">
                          <label >{{updateQuery.stationName}}</label>
                        </div>
                      </el-form-item>
                      <el-form-item  label="堰宽(顶) weirWidth:"  >
                        <el-input style="width: 60%;float: left" v-model.lazy="updateQuery.weirWidth" clearable></el-input>
                      </el-form-item>
                    </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible3 = false">取 消</el-button>
                    <el-button type="primary" @click="update">确 定</el-button>
                  </span>
                  </el-dialog>
                </template>
              </el-table-column>
            </el-table>
          </div>
       </div>
        </el-card>
      <pagination
        v-show="totalElements>0"
        :total=totalElements
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-row>
  </div>
</template>

<script>

  import {getCalculateParamsList,updateRunoffCalculateParams} from '@/api/calculateParameter'
  import Pagination from "@/components/Pagination";
    export default {
        name: "calculateParameter",
        components: { Pagination },
        data() {
            return {
                list:[],
                listQuery: {
                  calculateType: 1,
                  name: "",
                  pageNum: 1,
                  pageSize: 10
                },
                updateQuery:{
                  id: 4,
                  stationId: 23,
                  code: "202007111",
                  stationName: "某某 小流域控制站",
                  currentFacility:'',
                  weirWidth: 1,
                  angle: 30,
                  cd: 1,
                  kb: 0,
                  kh: 0,
                  p: 0

                },
              facility_data: {
                1:"三角形薄壁堰",
                2:"矩形薄壁堰",
                3:"梯形薄壁堰"
              },
               //showItem:false,
               listLoading:false,
                form:{
                  cd:null,
                  angle:null,
                  weirWidth:null,
                  kb:null,
                  kh:null,
                  p:null
                },
                options: [{
                    value: 1,
                    label: '小流域计算'
                // }, {
                //     value: 2,
                //     label: '降雨计算'
                // }, {
                //     value: 3,
                //     label: '径流小区计算'
                // }, {
                //     value: 4,
                //     label: '植被计算'
                // }, {
                //     value: 5,
                //     label: '风蚀观测场计算'
                }],
                totalElements:1,
                totalPages:1,
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                params:'',

            }
        },
        created() {
          this.getList()
        },
        // watch:{
        //   'updateQuery.angle'(val){
        //     console.log("i'm watching you~");
        //     console.log(val);
        //     if(val==='90'){
        //       console.log("i'm 90")
        //       this.showItem=true;
        //     } else
        //       this.showItem=false;
        //   }
        //
        // },

         methods: {
            getList() {
              this.listLoading = true
              getCalculateParamsList(this.listQuery).then(response => {
                  this.list = response.data.content.map(function(item){
                    item.currentFacility= this.typeTrans(item.currentFacility,this.facility_data)
                    return item
                  },this)
                this.totalElements = response.data.totalElements
                this.totalPages = response.data.totalPages
                // Just to simulate the time of the request
                setTimeout(() => {
                  this.listLoading = false
                }, 1.5 * 1000)
                // if(response.data.content.id!=null)
                //   console.log("params")

              })
            },
           typeTrans(key,data){
             key =''+key
             return data[key]
           },
           selectEvent(e){
              this.listQuery.calculateType = e;
             this.getList()

           },
           update() {
             this.dialogVisible = false
             this.dialogVisible2 = false
             this.dialogVisible3 = false
              updateRunoffCalculateParams(this.updateQuery).then(() => {
                 this.getList()
                setTimeout(() => {
                  this.listLoading = false
                }, 1.5 * 1000)
                 this.$notify({
                   title: '成功',
                   message: '更新成功',
                   type: 'success',
                   duration: 2000
                 })
                this.dialogVisible = false

                 // alert(this.restartMessage.message)
               }).catch(err => {
                 console.log(err)
               })

            },
           handleFilter() {
             this.getList()
           },

            handleClick(row) {
                console.log(row);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            handleShowDialog(row){
                this.updateQuery =JSON.parse(JSON.stringify(row));
                delete this.updateQuery.currentFacility;

                if(row.currentFacility==='三角形薄壁堰'||row.currentFacility==='1'){
                    this.dialogVisible= true
                }else if(row.currentFacility ==='矩形薄壁堰'||row.currentFacility==='2'){
                    this.dialogVisible2 = true
                }else if(row.currentFacility ==='梯形薄壁堰'||row.currentFacility==='3'){
                    this.dialogVisible3 = true
                }
                else{
                  window.alert("暂无参数")
                }
            }
        }
    }
</script>

<style scoped>

</style>
