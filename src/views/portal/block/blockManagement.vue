<template>
  <div class="dormitory">
    <br />
    <el-header
      style="background-color: #B3C0D1;
    color: #333;
    text-align:left;
    height: 30px;line-height: 30px"
    >版块管理</el-header>
    <br />
    <br />
    <div class="searchWord">
      <!--  1-搜索框             -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.blockName" clearable placeholder="版块名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch"
                     :disabled="buttonPrivilege['查询版块'] != 1"
          >查询</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="onAdd"
                     :disabled="buttonPrivilege['新增版块'] != 1"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="dormitoryData">
      <el-table
        ref="dormitoryTable"
        :data="tables"

        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="版块名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.blockName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="版块类型" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.blockType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="250">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " align="center" width="290">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="getInFetchList(row.id)"
                       :disabled="buttonPrivilege['查看版块详情'] != 1"
            >查看</el-button>

            <el-button size="small" type="primary" @click="getInModifyList(row.id)"
                       :disabled="buttonPrivilege['编辑版块'] != 1"
            >编辑</el-button>

            <el-button size="small" type="danger" @click="deleteInModifyList(row.id)"
                       :disabled="buttonPrivilege['删除版块'] != 1"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页插件-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />

      <!--删除回话框               -->
      <el-dialog title="删除" :visible.sync="deleteVisible" width="30%">
        <span>确认删除这条记录吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete(blockId)">确 定</el-button>
          <el-button @click="deleteVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <!--新增回话框               -->
      <el-dialog title="新增" :visible.sync="dialogAddVisible">
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="版块名称：" prop="blockName">
            <el-input v-model="addForm.blockName" placeholder="版块名称" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="版块类型：" prop="blockType">
            <el-select v-model="addForm.blockType" placeholder="版块类型" >
              <el-option
                v-for="item in blockList"
                :key="item.id"
                :label="item.blockName"
                :value="item.id"
              />
              <!-- <el-option label="一级门户" value="一级门户" /> -->
              <!-- <el-option label="行业咨询" value="行业咨询" /> -->
              <!-- <el-option label="心灵咨询" value="心灵咨询" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="版块描述：" prop="blockDescription">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="版块描述"
              style="width: 550px"
              v-model="addForm.blockDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片地址：" prop="blockImage">
<!--            <el-input v-model="addForm.image" readonly placeholder="图片地址" style="width: 500px"></el-input>-->
            <el-upload
              class="upload-demo"
              :on-remove="handleAddRemove"
              :on-success="handleAddSuccess"
              name="file"
              :action="imageUrl"
              list-type="picture-card"
              :file-list="fileList"
              :limit="100"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="AddBlockList()">确 认</el-button>
          <el-button @click="dialogAddVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!--修改回话框               -->
      <el-dialog title="编辑" :visible.sync="dialogModifyVisible">
        <el-form
          :model="modifyForm"
          :rules="rules"
          ref="modifyForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="版块名称：" prop="blockName">
            <el-input v-model="modifyForm.blockName" placeholder="版块名称" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="版块类型：" prop="blockType">
            <el-select v-model="modifyForm.blockType" placeholder="版块类型">
              <el-option
                v-for="item in blockList"
                :key="item.id"
                :label="item.blockName"
                :value="item.id"
              />
              <!-- <el-option label="一级门户" value="一级门户" /> -->
              <!-- <el-option label="行业咨询" value="行业咨询" /> -->
              <!-- <el-option label="心灵咨询" value="心灵咨询" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="版块描述：" prop="blockDescription">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="版块描述"
              style="width: 550px"
              v-model="modifyForm.blockDescription"
            ></el-input>
          </el-form-item>
          <el-form-item label="图片地址：">
<!--            <el-input-->
<!--              v-model="modifyForm.image"-->
<!--              readonly="true"-->
<!--              placeholder="图片地址"-->
<!--              style="width: 500px"-->
<!--            ></el-input>-->
            <el-upload
              class="upload-add"
              :on-remove="handleModifyRemove"
              :on-success="handleModifySuccess"
              name="file"
              :action="imageUrl"
              list-type="picture-card"
              :file-list="fileList"
              :limit="100"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modifyBlockList()">更 新</el-button>
          <el-button @click="dialogModifyVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="版块详情" :visible.sync="dialogWholeInfoVisible">
        <el-form
          :model="WholeInfoForm"
          ref="WholeInfoForm"
          label-position="right"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="版块名称：" prop="blockName">{{WholeInfoForm.blockName}}</el-form-item>
          <el-form-item label="版块类型：" prop="blockType">{{WholeInfoForm.blockType}}</el-form-item>
          <el-form-item label="版块描述：" prop="blockDescription">
            <el-input
              readonly="true"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5}"
              placeholder="版块描述"
              style="width: 550px"
              v-model="WholeInfoForm.blockDescription"
            ></el-input>
          </el-form-item>
<!--          <el-form-item label="图片地址：" prop="image">{{WholeInfoForm.image}}</el-form-item>-->
          <el-form-item label="创建人：" prop="createName">{{WholeInfoForm.createName}}</el-form-item>
          <el-form-item label="创建时间：" prop="createTime">{{WholeInfoForm.createTime}}</el-form-item>
          <el-form-item label="修改人：" prop="editName">{{WholeInfoForm.editName}}</el-form-item>
          <el-form-item label="修改时间：" prop="editTime">{{WholeInfoForm.editTime}}</el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogWholeInfoVisible = false">确 认</el-button>
          <el-button @click="dialogWholeInfoVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!--信息错误提示回话框               -->
      <el-dialog title="错误提示" top="1" :visible.sync="errorVisible" width="30%">
        <span>不能删除已绑定内容的版块，要想删除该记录，先删除与之绑定的内容！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="errorVisible = false">确 认</el-button>
          <el-button @click="errorVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getButtonPermission } from '@/api/sysuser'
  import {
    getImageURL,
    fetchMoreConditionConciseBlockList,
    fetchBlockListByBlockId,
    deleteBlockByBlockId,
    modifyBlockListByBlockId,
    addBlockList,
    getBlockList
  } from "@/api/portal";
  import Pagination from "@/components/Pagination";
  import {isArray} from "../../../utils/validate";

  export default {
    components: { Pagination },
    data() {
      return {
        // blockList: [],
        blockList: [],
        buttonPrivilege: {},
        imageUrl:
          process.env.VUE_APP_BASE_API +
          "pcs-portal/portal-internal-management-image/uploadImage",
        errorInfo: "",
        fileList: [],
        blockId: 0,
        isTrue: false,
        tables: [],
        total: 0,
        listQuery: {
          blockName: undefined,
          blockType: undefined,
          page: 1,
          limit: 10
        },
        dialogAddVisible: false,
        dialogModifyVisible: false,
        dialogWholeInfoVisible: false,
        deleteVisible: false,
        errorVisible: false,
        formInline: {
          user: "",
          region: ""
        },
        addForm: {
          blockName: "",
          blockType: "",
          blockDescription: "",
          image: ""
        },
        modifyForm: {
          blockName: "",
          blockType:"",
          blockDictId:"",
          blockDescription: "",
          image: ""
        },
        WholeInfoForm: {},
        rules: {
          blockName: [
            { required: true, message: "请输入版块名称", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
          ],
          blockDescription: [
            {
              min: 0,
              max: 255,
              message: "长度要少于 255 个字符",
              trigger: "blur"
            },
            {
              required: true
            }
          ],
          blockType: [
            {
              required: true
            }

          ]
        }
      };
    },
    created() {
      this.fetchData();
      this.getPermissionList()
      getBlockList().then(res => {
        this.blockList = res.data
      })
    },
    methods: {
      getPermissionList() {
        getButtonPermission({"modulePrivilege": "版块管理"}).then(res => {
          this.buttonPrivilege = res
        })
      },
      fetchData() {
        this.listloading = true;
        fetchMoreConditionConciseBlockList(
          this.listQuery.blockName,
          this.listQuery.blockType,
          this.listQuery.page,
          this.listQuery.limit
        ).then(response => {
          this.tables = response.data.conciseBlockInfoDTOList;
          this.total = response.data.total;
          this.listloading = false;
        });
      },
      deleteInModifyList(blockId) {
        this.deleteVisible = true;
        this.blockId = blockId;
      },
      async getInModifyList(blockId) {
        this.fileList = [];
        this.dialogModifyVisible = true;
        this.blockId = blockId;
        fetchBlockListByBlockId(blockId).then(response => {
          this.modifyForm = response.data
        })
        let _result = await fetchBlockListByBlockId(blockId);
        this.modifyForm = _result.data;
        console.log("img"+ this.modifyForm.image);
        if(this.modifyForm.image.length != 0 && this.modifyForm.image[0] == 'h'){
          this.fileList.push({name: "image.jpg", url:this.modifyForm.image});
        }else if (this.modifyForm.image.length != 0){
          this.modifyForm.image = JSON.parse(this.modifyForm.image);
          console.log("isArray " + isArray(this.modifyForm.image));
          console.log("image_arr:" +this.modifyForm.image);

          let length = this.modifyForm.image.length;

          for(let i = 0; i < length; i++){
            this.fileList.push({name: this.modifyForm.image[i] + ".jpg", url: this.modifyForm.image[i]})
          }
        } else {
            this.fileList = [];
          }

      },
      getInFetchList(blockId) {
        this.dialogWholeInfoVisible = true;
        fetchBlockListByBlockId(blockId).then(response => {
          this.WholeInfoForm = response.data;
        });
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
        deleteBlockByBlockId(blockId)
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
      },
      onSearch() {
        fetchMoreConditionConciseBlockList(
          this.listQuery.blockName,
          this.listQuery.blockType,
          this.listQuery.page,
          this.listQuery.limit
        ).then(response => {
          this.tables = response.data.conciseBlockInfoDTOList;
          this.total = response.data.total;
        });
      },
      // editSelectChange() {
      //   console.log("调用改变复选框")
      //   for(let item in this.blockList){
      //     if(this.modifyForm.blockType == item.name){
      //       this.modifyForm.blockDictId = item.id;
      //     }
      //   }
      // },      // editSelectChange() {
      //   console.log("调用改变复选框")
      //   for(let item in this.blockList){
      //     if(this.modifyForm.blockType == item.name){
      //       this.modifyForm.blockDictId = item.id;
      //     }
      //   }
      // },
      onAdd() {
        this.addForm.image = [];
        this.fileList = [];
        this.dialogAddVisible = true;
        this.$refs["addForm"].resetFields();
      },
      AddBlockList() {
        if (this.addForm.blockName === "" || this.addForm.blockName === null) {
          alert("请输入版块名称");
          return;
        }
        if (this.addForm.blockType === "" || this.addForm.blockType === null) {
          alert("请输入版块类型");
          return;
        }
        if (
          this.addForm.blockDescription === "" ||
          this.addForm.blockDescription === null
        ) {
          alert("请输入版块描述");
          return;
        }
        //取消强制输入图片
        // if (this.addForm.image === "" || this.addForm.image === null) {
        //   alert("输入图片信息");
        //   return;
        // }
        // console.log(this.fileList_add);
        // this.fileList_add.forEach(function (file) {
        //   this.addForm.image.push(file);
        // })
        //
        this.addForm.image = JSON.stringify(this.addForm.image);
        this.dialogAddVisible = false;
        addBlockList(
          this.addForm.blockName,
          this.addForm.blockType,
          this.addForm.blockDescription,
          this.addForm.image
        ).then(() => {
          this.fetchData();
          this.$notify({
            title: "新增",
            message: "新增成功",
            type: "success",
            duration: 2000
          });
        });
      },
      modifyBlockList() {
        this.dialogModifyVisible = false;
        this.fileList = [];

        let temp = '';
        if (typeof (this.modifyForm.blockType) == "number") {
          temp = this.modifyForm.blockType;
        } else {
          temp = this.modifyForm.blockDictId;
        }

        if(typeof(this.modifyForm.image) != "string"){
          this.modifyForm.image = JSON.stringify(this.modifyForm.image);
        }
        // if(this.modifyForm.image != null && this.modifyForm.image != "" && this.modifyForm.image[0] == '['){
        //   this.modifyForm.image = JSON.stringify(this.modifyForm.image);
        // }else if(this.modifyForm.image != null && this.modifyForm.image != ""){
        //   // let temp = this.modifyForm.image;
        //   // this.modifyForm.image = [];
        //   // this.modifyForm.image.push(temp);
        //   this.modifyForm.image = JSON.stringify(this.modifyForm.image);
        // }else{
        //this.modifyForm.image = "";
        // }

        modifyBlockListByBlockId(
          // this.blockId,
          // this.modifyForm.blockName,
          // this.modifyForm.blockType,
          // this.modifyForm.blockDescription,
          // this.modifyForm.image


          this.blockId,
          this.modifyForm.blockName,
          temp,
          this.modifyForm.blockDescription,
          this.modifyForm.image
        ).then(() => {
          this.fetchData();
          this.$notify({
            title: "修改",
            message: "修改成功",
            type: "success",
            duration: 2000
          });
        });
      },
      handleAddSuccess(response, file, fileList) {
        console.log(file)
        console.log(fileList)
        // this.addForm.image = "http://112.98.239.146:8010/image/" + response.data.data;
        this.addForm.image.push("http://112.98.239.146:8010/image/"+ response.data.data);
      },
      handleAddRemove() {
        this.addForm.image = null;

      },
      handleModifySuccess(response) {
        /*axios.get("http://localhost:8010/portal-internal-management-image/getImageURL?upload="+response.data).then(res=>{
            this.addForm.image=res.data.data
          })*/

        //this.modifyForm.image = "http://112.98.239.146:8010/image/" + response.data.data;
        console.log("this.modifyForm.image " + this.modifyForm.image + isArray(this.modifyForm.image));
        let str = "http://112.98.239.146:8010/image/"+ response.data.data;
        let str_arr = [];
        str_arr.push(str);

        let temp = JSON.parse(JSON.stringify(this.modifyForm.image));
        if(isArray(this.modifyForm.image)){
          this.modifyForm.image = str_arr.concat(this.modifyForm.image.flat());
        }else{
          this.modifyForm.image = [];
          this.modifyForm.image = str_arr.concat(this.modifyForm.image);
        }



      },
      handleModifyRemove() {
        this.modifyForm.image = "";
      }
    }
  };
</script>
