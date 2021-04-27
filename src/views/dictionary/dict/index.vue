<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
            <el-button
              v-permission="['ADMIN','DICT_ALL','DICT_CREATE']"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.addform.dialog = true">新增</el-button>
          </div>
          <eForm ref="addform" :sup_this="sup_this" :is-add="true"></eForm>
          <!--表格渲染-->
          <el-table v-loading="loading" :data="dictList" size="small" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" width="120px" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述"/>
            <el-table-column :show-overflow-tooltip="true" label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <edit  :data="scope.row" :sup_this="sup_this"/>
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="this.$refs.dictDetail && this.$refs.dictDetail.dictName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail.$refs.form.dialog = true">新增</el-button>
          </div>
          <dictDetail ref="dictDetail"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { deleteDict } from '@/api/dictionary'
import eHeader from './module/header'
import edit from './module/edit'
import eForm from './module/form'
import dictDetail from '../dictDetail/index'
import {getDictlist} from "../../../api/dictionary";
export default {
  components: { eForm,eHeader, edit, dictDetail },
  data() {
    return {
      query:null,
      sup_this: {
        type: Object,
        required: true
      },
      dictList:null,
      dictTotal:0,
      dictListQuery:{
        pageNum:1,
        pagesize:5,
        name:undefined,
      },
      delLoading: false, sup_this: this
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    getDictData(){
      getDictlist().then(response=>{
        this.dictList=response.data
      }).catch((error=>{
        console.log("qingiushbbai")
      }))
    },
    beforeInit() {
      this.url = 'api/dict'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.data = []
        this.$refs.dictDetail.dictName = ''
      }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      deleteDict(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.getDictData()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      console.log("&&&&&&&&&&&")
      if (val) {
        console.log("开始切换字典详情")
        this.$refs.dictDetail.dictName = val.name
        console.log(val.name)
        this.$refs.dictDetail.dictId = val.id
        console.log(val.id)
        console.log("执行初始化")
        this.$refs.dictDetail.getDictData()
        console.log("初始化完毕")
      }
    }
  }
}
</script>

<style scoped>

</style>
