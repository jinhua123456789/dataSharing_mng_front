<template>
  <div class="dormitory">
    <br>
    <el-header style=" background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px">新增
    </el-header>
    <br>
    <br>
    <div class="dormitoryData">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-position="right"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="标题：" prop="contentTitle">
          <el-input v-model="addForm.contentTitle"
                    placeholder="内容标题"
                    style="width: 600px"/>
        </el-form-item>
        <el-form-item label="来源：">
          <el-input v-model="addForm.contentFrom"
                    placeholder="URL"
                    style="width: 600px"/>
        </el-form-item>
        <el-form-item label="版块名称：">
          <el-select v-model="addForm.blockId" placeholder="版块名称">
            <el-option v-for="item in blockList" :label="item.blockName" :value="item.id" :key="item.id"/>

          </el-select>
        </el-form-item>
        <el-form-item label="内容：">
          <tinymce v-model="addForm.contentContent"  style="width: 1000px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd()">确 认</el-button>
          <el-button @click="onCancel()">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  import {fetchConciseBlockList, addContentList} from "@/api/portal"

  import Tinymce from '@/components/Tinymce'

  export default {
    inject:['reload'],
    components: {Tinymce},
    data() {
      return {
        addForm: {
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
        fetchConciseBlockList().then(response => {
          this.blockList = response.data
        })
      },
      onCancel() {
        this.$router.push({path: "/contentSysManagement"})
      },
      onAdd() {
        addContentList(this.addForm).then(() => {
          this.$notify({
            title: '新增',
            message: '新增成功',
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
      /*'$route': 'onAdd'*/
    }
  }
</script>
