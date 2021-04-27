<template>
  <div class="dormitory">
    <br>
    <el-header  style=" background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px">审核管理</el-header>
    <br>
    <br>
    <div class="searchWord">
      <!--  1-搜索框             -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
        <el-table-column label="版块名称" align="center" width="100">
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
        <el-table-column label="审核人" align="center" width="70">
          <template slot-scope="{row}">
            <span>{{ row.auditName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.auditTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.auditAdvise }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " prop="operation"  align="center" width="360">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="getInFetchList(row.id)">预览</el-button>

            <el-button size="small" type="primary" @click="auditYesList(row.id)">审核通过</el-button>
            <el-button size="small" type="danger" @click="auditNoList(row.id)">审核不通过</el-button>
            <el-button v-if="row.contentStatus=='上线'"
                       size="small"
                       type="danger"
                       @click="offLineInModifyList(row.id)">下线</el-button>
            <el-button v-if="row.contentStatus=='下线'"
                       size="small"
                       type="success"
                       @click="onLineInModifyList(row.id)">上线</el-button>

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
        title="下线"
        :visible.sync="deleteVisible"
        width="30%">
        <span>确认下线这条记录吗?</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete">确 认</el-button>
          <el-button @click="deleteVisible = false">取 消</el-button>
        </span>
      </el-dialog>


      <!--新增回话框               -->
      <el-dialog :title="auditTitle" :visible.sync="dialogAuditVisible">
        <el-form :model="auditForm" ref="auditForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="审核意见：" prop="auditAdvise">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="审核意见"
              style="width: 450px"
              v-model="auditForm.auditAdvise">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="auditList()">确 认</el-button>
          <el-button @click="dialogAuditVisible = false">取 消</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>

  import {onOffLineContentByContentId,fetchMoreConditionConciseAuditList,fetchConciseBlockList,modifyAuditListByAuditId} from "@/api/portal";
  import Pagination from '@/components/Pagination'

  export default {
    components:{ Pagination },

    data() {
      return {
        id:0,
        blockList:[],
        tables: [],
        total:0,
        listQuery:{
          contentTitle:undefined,
          blockId:undefined,
          contentStatus:undefined,
          auditStatus:undefined,
          page:1,
          limit:10
        },
        formInline: {
          user: '',
          region: ''
        },
        auditForm:{
          auditAdvise:undefined
        },
        dialogAuditVisible:false,
        deleteVisible:false,
        auditTitle:''
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData(){
        this.listloading=true

        fetchConciseBlockList().then(response => {
          this.blockList = response.data
        })
        fetchMoreConditionConciseAuditList(this.listQuery.contentTitle,
          this.listQuery.blockId,this.listQuery.contentStatus,this.listQuery.auditStatus, this.listQuery.page,this.listQuery.limit).then(response=>{
          this.tables=response.data.conciseAuditInfoDTOList
          this.total=response.data.total
          this.listloading=false
        })
      },
      getInFetchList(id){
        this.$router.push({path:"/auditSysWholeInfo",
          query:{id:id}})
      },
      auditYesList(id){
        this.auditTitle="审核通过"
        this.dialogAuditVisible=true
        this.id=id
        this.$refs['auditForm'].resetFields()
      },
      auditNoList(id){
        this.auditTitle="审核不通过"
        this.dialogAuditVisible=true
        this.id=id
        this.$refs['auditForm'].resetFields()
      },
      auditList(){
        this.dialogAuditVisible=false
        modifyAuditListByAuditId(this.id,this.auditTitle,
        this.auditForm.auditAdvise).then(()=>{
          this.fetchData()
          this.$notify({
            title: '审核',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      onLineInModifyList(id){
        onOffLineContentByContentId(id).then(()=>{
          this.fetchData()
          this.$notify({
            title: '上线',
            message: '上线成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      offLineInModifyList(id){
        this.deleteVisible=true
        this.id=id
      },
      submitDelete() {
        this.deleteVisible=false
        onOffLineContentByContentId(this.id).then(()=>{
          this.fetchData()
          this.$notify({
            title: '下线',
            message: '下线成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      onSearch() {
        fetchMoreConditionConciseAuditList(this.listQuery.contentTitle,
          this.listQuery.blockId,this.listQuery.contentStatus,this.listQuery.auditStatus, this.listQuery.page,this.listQuery.limit).then(response=>{
          this.tables=response.data.conciseAuditInfoDTOList
          this.total=response.data.total
        })
      }
    }
  }
</script>
