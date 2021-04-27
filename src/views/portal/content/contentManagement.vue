
<template>
  <div class="dormitory">
    <br>
    <el-header  style=" background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px">内容编辑</el-header>
    <br>
    <br>
    <div class="searchWord">
      <!--  1-搜索框             -->
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item >
          <el-input v-model="listQuery.contentTitle"
                    clearable
                    placeholder="标题"/>
        </el-form-item>
        <el-form-item >
          <el-select v-model="listQuery.blockId" placeholder="版块名称" clearable>
            <el-option v-for="item in blockList" :label="item.blockName" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="listQuery.contentStatus" clearable placeholder="内容状态">
            <el-option label="上线" value="上线"></el-option>
            <el-option label="下线" value="下线"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="listQuery.auditStatus" clearable placeholder="审核状态">
            <el-option label="待审核" value="待审核"></el-option>
            <el-option label="审核通过" value="审核通过"></el-option>
            <el-option label="审核不通过" value="审核不通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="onAdd">新增</el-button>
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
        <el-table-column label="内容标题" align="center">
          <template slot-scope="{row}">
            <span>{{ row.contentTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版块名称" align="center"width="140">
          <template slot-scope="{row}">
            <span>{{ row.blockName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容状态" align="center" width="80">
          <template slot-scope="{row}">
            <el-tag v-if="row.contentStatus=='上线'"
                    type="success">
              {{ row.contentStatus }}
            </el-tag>
            <el-tag v-if="row.contentStatus=='下线'"
                    type="danger">
              {{ row.contentStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" width="110">
          <template slot-scope="{row}">
            <el-tag v-if="row.auditStatus=='待审核'"
                    type="primary">
              {{ row.auditStatus }}
            </el-tag>
            <el-tag v-if="row.auditStatus=='审核通过'"
                    type="success">
              {{ row.auditStatus }}
            </el-tag>
            <el-tag v-if="row.auditStatus=='审核不通过'"
                    type="danger">
              {{ row.auditStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" width="70">
          <template slot-scope="{row}">
            <span>{{ row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " prop="operation"  align="center" width="250">
          <template slot-scope="{row}">

            <el-button size="small" type="primary" @click="getInFetchList(row.id)">预览</el-button>

            <el-button v-if="row.userDifferent || row.auditStatus=='审核通过'"
                       size="small"
                       type="info"
                       @click="getInModifyList(row.id)">
              编辑
            </el-button>

            <el-button v-else
                       size="small"
                       type="primary"
                       @click="getInModifyList(row.id)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteInModifyList(row.id)">删除</el-button>



          </template>
        </el-table-column>
      </el-table>

      <!--分页插件-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData" />

      <!--删除回话框               -->
      <el-dialog
        title="删除"
        :visible.sync="deleteVisible"
        width="30%">
        <span>确认下线这条记录吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete(blockId)">确 认</el-button>
          <el-button @click="deleteVisible = false">取 消</el-button>
        </span>
      </el-dialog>


    </div>
  </div>
</template>

<script>

import {fetchMoreConditionConciseContentList, fetchConciseBlockList, removeBlockByBlockId} from "@/api/portal";
  import Pagination from '@/components/Pagination'

  export default {
    components:{ Pagination },

    data() {
      return {
        id:0,
        blockList:[],
        tables: [],
        total:0,
        deleteVisible:false,
        listloading:true,
        blockId:0,
        listQuery:{
          contentTitle:undefined,
          blockId:undefined,
          contentStatus:undefined,
          auditStatus:undefined,
          page:1,
          limit:10
        }
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData(){
        this.listloading=true


        fetchConciseBlockList().then(response => {
          this.blockList = response.data
        })
        fetchMoreConditionConciseContentList(this.listQuery.contentTitle,
          this.listQuery.blockId,this.listQuery.contentStatus,this.listQuery.auditStatus,
          this.listQuery.page,this.listQuery.limit).then(response=>{
          this.tables=response.data.conciseContentInfoDTOList
          this.total=response.data.total
          this.listloading=false
        })
      },
      deleteInModifyList(blockId) {
        this.deleteVisible = true;
        this.blockId = blockId;
      },
      getInFetchList(id){
        this.$router.push({path:"/contentSysWholeInfo", query:{id:id}})
      },
      getInModifyList(id){
        this.$router.push({path:"/contentSysModify", query:{id:id}})
      },
      /*onChange(val){
        var obj = {};
        obj = this.blockList.find(item =>{
          return item.id === val
        });
        // console.log(obj.chname)
        this.listQuery.blockLabel = obj.blockName
      },*/
      onSearch() {
        fetchMoreConditionConciseContentList(this.listQuery.contentTitle,
          this.listQuery.blockId,this.listQuery.contentStatus,this.listQuery.auditStatus,
          this.listQuery.page,this.listQuery.limit).then(response=>{
            this.tables=response.data.conciseContentInfoDTOList;
            this.total=response.data.total
        })
      },
      onAdd(){
        this.$router.push({path:"/contentSysAdd"})
      },
      submitDelete(blockId) {
        /*for (const v of this.dormitory) {
            if (v.meet === this.temp.meet) {
              const index = this.dormitory.indexOf(v)
              this.dormitory.splice(index, 1)
              console.log(this.dormitory)
              break
            }
          }*/

        this.deleteVisible = false;
        removeBlockByBlockId(blockId)
          .then(() => {
            this.fetchData();
            this.$notify({
              title: "删除",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .catch(error => {
            this.errorVisible = true;
            this.errorInfo = error;
          });
      }
    },

    watch:{
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      /*'$route': function (to, from) {
        //执行数据更新查询
        this.fetchData();
      }*/
    }
  }
</script>
