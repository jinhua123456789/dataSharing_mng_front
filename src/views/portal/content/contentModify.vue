<template>
  <div class="dormitory">
    <br>
    <el-header style=" background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px">编辑
    </el-header>
    <br>
    <br>
    <div class="dormitoryData">
      <el-form
        :model="modifyForm"
        :rules="rules"
        ref="modifyForm"
        label-position="right"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="标题：" prop="contentTitle">
          <el-input v-model="modifyForm.contentTitle"
                    placeholder="内容标题"
                    style="width: 600px"/>
        </el-form-item>
        <el-form-item label="来源：" prop="contentFrom">
          <el-input v-model="modifyForm.contentFrom"
                    placeholder="URL"
                    style="width: 600px"/>
        </el-form-item>
        <el-form-item label="版块名称：" prop="blockName">
          <el-select v-model="modifyForm.blockId" placeholder="版块名称">
            <el-option v-for="item in blockList" :label="item.blockName" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" prop="contentContent">
          <tinymce v-model="modifyForm.contentContent"  style="width: 1000px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onModify()">更 新</el-button>
          <el-button @click="onCancel()">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  import {fetchConciseBlockList, fetchContentListByContentId,modifyContentListByContentId} from "@/api/portal"

  import Tinymce from '@/components/Tinymce'

  export default {
    inject:['reload'],
    components: {Tinymce},
    data() {
      return {
        modifyForm: {
          id:0,
          contentTitle: '',
          contentFrom: '',
          contentContent: '',
          blockId: ''
        },
        blockList: [],
        rules: {
          contentTitle: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.fetchBlock()
    },
    methods: {
      fetchBlock() {
        this.modifyForm.id = this.$route.query.id
        fetchConciseBlockList().then(response => {
          this.blockList = response.data
        })
        fetchContentListByContentId(this.modifyForm.id).then(response=>{
          this.modifyForm=response.data
        })
      },
      onCancel() {
        this.$router.push({path: "/contentSysManagement"})
      },
      onModify() {
        modifyContentListByContentId(this.modifyForm).then(() => {
          this.$notify({
            title: '修改',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
        this.$router.push({path: "/contentSysManagement"})
        this.reload()
      }
    },
    watch:{
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      /*'$route': 'created'*/
    }
  }
</script>
