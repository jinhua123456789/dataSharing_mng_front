
<template>
  <div class="dormitory" style="display:grid;justify-content: center;align-items: center">
    <br>
    <div class="searchWord">
      <!--  1-搜索框             -->
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
<!--        <el-form-item>
          <el-input v-model="listQuery.contentName"
                    clearable
                    placeholder="姓名"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.contentGender" placeholder="性别" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-input v-model="listQuery.contentEmail"
                    clearable
                    style="margin-left: 20px"
                    placeholder="邮箱"/>
        </el-form-item>
<!--        <el-form-item>
          <el-input v-model="listQuery.contentPhone"
                    clearable
                    placeholder="手机"/>
        </el-form-item>-->
        <el-form-item>
          <el-input v-model="listQuery.contentOrganization"
                    clearable
                    style="margin-left: 20px"
                    placeholder="机构"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch" style="margin-left: 20px">查询</el-button>
          <!--          <el-button type="primary" icon="el-icon-edit" @click="onAdd">新增</el-button>-->
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
        <el-table-column label="姓名" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" width="150px">
          <template slot-scope="{row}">
            <span v-if="row.gender === 'F'">女</span>
            <span v-if="row.gender === 'M'">男</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" width="210px">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构" align="center" width="250px">
          <template slot-scope="{row}">
            <span>{{ row.organization }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" align="center" width="150px">
          <template slot-scope="{row}">
            <span v-if="row.type === 'C'">普通用户</span>
            <span v-if="row.type === 'A'">管理员</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作 " prop="operation"  align="center" width="250">
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
        </el-table-column>-->
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
        listLoading:true,
        blockId:0,
        listQuery:{ //记录筛选条件
          contentEmail: '',
          contentOrganization: '',
          page: 1, //记录当前页数
          limit: 10
        },
        options: [{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData(){
        this.tables=[]
        this.listLoading = true
        var that = this
        this.$axios({
          method: 'post',
          url: '/dataShare/user/searchAll',
          contentType: 'application/json; charset=UTF-8', // 解决415错误
          headers: {'Content-Type': 'application/json;charset=UTF-8'},
          dataType: 'json',
          data: JSON.stringify({
            email:this.listQuery.contentEmail,
            organization: this.listQuery.contentOrganization,
            page: this.listQuery.page,
            limit: this.listQuery.limit
          })
        }).then(res => { // 注意：后端需要返回userID
          console.log(res.data)
/*          that.tables = res.data*/
          console.log(that.tables)
          var string1 = res.data //储存数据
          var dataNum = string1.length //储存数据条数
          for(var i=0;i<dataNum;i++){
            var objectToInsert = JSON.parse(string1[i]);
            that.tables.push(objectToInsert);
          }
          that.total = parseInt(that.tables.pop())
        }).catch(error => {
          alert(error)
          console.log(error)
        })
        this.listLoading = false
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

      clickSearch() {
        this.listQuery.page = 1
        this.fetchData()
      },
      onAdd(){
        this.$router.push({path:"/contentSysAdd"})
      },
      submitDelete(blockId) {
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
<style scoped>
  .dormitory{

  }
  .dormitoryData{
    overflow: hidden;
  }
</style>
