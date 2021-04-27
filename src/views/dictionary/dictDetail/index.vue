<template>
  <div>
    <div v-if="dictName === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <eForm ref="form" :sup_this="sup_this" :is-add="true"></eForm>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="dictDetailList" size="small" style="width: 100%;">
        <el-table-column label="所属字典">
          <template slot-scope="scope">
            {{ dictName }}
          </template>
        </el-table-column>
        <el-table-column prop="label" label="字典标签"/>
        <el-table-column prop="value" label="字典值"/>
        <el-table-column prop="sort" label="排序"/>
        <el-table-column  label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <edit v-permission="['ADMIN','DICT_ALL','DICT_EDIT']" :dict-id="dictId" :data="scope.row" :sup_this="sup_this"/>
            <el-popover
              v-permission="['ADMIN','DICT_ALL','DICT_DELETE']"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
    </div>
  </div>
</template>

<script>
import { deleteDictDetail ,getDictDetailList} from '@/api/dictionary'
import eHeader from './module/header'
import eForm from './module/form'
import edit from './module/edit'
export default {
  components: { eForm,eHeader, edit },
  data() {
    return {
      sup_this: {
        type: Object,
        required: true
      },
      dictDetailList:null,
      dictDetailTotal:0,
      dictDetailListQuery:{
        pageNum:1,
        pagesize:5,
        dictId:undefined,
      },
      delLoading: false, sup_this: this, dictName: '', dictId: 0
    }
  },
  created() {
    this.getDictData()
    this.loading = false
  },
  methods: {
    getDictData(){
      this.dictDetailListQuery.dictId=this.dictId
      console.log(this.dictId)
      getDictDetailList(this.dictId).then(response=>{
        this.dictDetailList=response.data
        console.log("获取的详情是"+this.dictDetailList)
      }).catch((error=>{
        console.log("qingiushbbai")
      }))
    },
    subDelete(id) {
      this.delLoading = true
      deleteDictDetail(id).then(res => {
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
    }
  }
}
</script>

<style scoped>
  .my-code{
    padding: 15px;
    line-height: 20px;
    border-left: 3px solid #ddd;
    color: #333;
    font-family: Courier New;
    font-size: 12px
  }
</style>
