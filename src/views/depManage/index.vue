
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="handlerAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handlerEdit">更新</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col :span="8" style="margin-top:15px;">
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="getNodeData"
          default-expand-all
        ></el-tree>
      </el-col>
      <el-col :span="16" style="margin-top:15px;">
        <el-card class="box-card">
          <el-form
            :label-position="labelPosition"
            label-width="130px"
            :rules="rules"
            :model="form"
            ref="form"
          >
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="部门简介">
              <el-input v-model="form.info" :disabled="formEdit" placeholder="请输入简介"></el-input>
            </el-form-item>
            <!-- <el-form-item label="管理员电话" prop="adminPhone">
              <el-input v-model="form.adminPhone" :disabled="formEdit" placeholder="请输入管理员手机号码"></el-input>
            </el-form-item>
            <el-form-item label="管理员真实姓名">
              <el-input v-model="form.adminRealName" :disabled="formEdit" placeholder="请输入管理员真是姓名"></el-input>
            </el-form-item>-->
            <el-form-item label="部门地址">
              <el-input v-model="form.address" :disabled="formEdit" placeholder="部门地址"></el-input>
            </el-form-item>
<!--            <el-form-item label="统一社会信用代码">-->
<!--              <el-input v-model="form.uniformSocialCreditCode" :disabled="formEdit"></el-input>-->
<!--            </el-form-item>-->
            <el-form-item v-if="formStatus == 'update'">
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="update">更新</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button @click="onCancel">取消</el-button>
              <el-button type="primary" @click="create">确认</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, putObj, delObj } from "@/api/OrgDpt.js";
import { validatePhone } from "@/utils/validate.js";
import { mapGetters } from "vuex";
export default {
  name: "privilege",
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      methodOptions: ["GET", "POST", "PUT", "DELETE"],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      rules: {
        parentId: [
          { required: true, message: "请输入父级节点", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "请输入节点编号", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
        // ,
        // adminPhone: [
        //   { required: true, trigger: "blur", validator: validatePhone }
        // ]
      },
      labelPosition: "right",
      form: {
        name: null,
        id: null,
        parentId: null,
        info: null,
        status: null,
        orgId: null,
        dptNo: null,
        adminPhone: null,
        address: null,
        uniformSocialCreditCode: null,
        adminRealName: null,
        depAddress: null
      },
      currentId: 0,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    };
  },
  created() {
    this.getList();
    // this.deptManager_btn_add = this.permissions['sys_dept_add']
    // this.deptManager_btn_edit = this.permissions['sys_dept_edit']
    // this.deptManager_btn_del = this.permissions['sys_dept_del']
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data;
        //console.log(response.data)
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      this.showElement = true;
    },

    handlerEdit() {
      if (this.form.id) {
        this.form.orgId = 1;
        this.formEdit = false;
        this.formStatus = "update";
      }
    },
    handlerAdd() {
      this.resetForm();
      this.formEdit = false;
      this.formStatus = "create";
    },
    handleDelete() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delObj(this.currentId).then(response => {
          if (response.data === "1") {
            this.$notify({
              title: "失败",
              message: "无法删除，可能含有子节点",
              type: "warning",
              duration: 4000
            });
            return;
          } else if (response.data === "2") {
            this.$notify({
              title: "失败",
              message: "该权限目前有角色占用，请确保该权限无角色使用",
              type: "warning",
              duration: 4000
            });
            return;
          } else if (response.data === "4") {
            this.$notify({
              title: "失败",
              message: "权限不足",
              type: "error",
              duration: 2000
            });
            return ;
          }
          if (response.data !== "0") {
            this.$notify({
              title: "失败",
              message: "服务器异常，请重试或联系维护人员",
              type: "warning",
              duration: 4000
            });
            return;
          }
          this.getList();
          this.resetForm();
          this.onCancel();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    update() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        putObj(this.form).then(response => {
          // alert(JSON.stringify(response.data))
          if (response.data == 1) {
            this.$notify({
              title: "失败",
              message: "请勿重复",
              type: "error",
              duration: 2000
            });
            return;
          } else if (response.data === "4") {
            this.$notify({
              title: "失败",
              message: "权限不足",
              type: "error",
              duration: 2000
            });
            return ;
          }
          this.getList();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    create() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        addObj(this.form).then(response => {
          if (response.data === "1") {
            this.$notify({
              title: "失败",
              message: "请勿重复",
              type: "error",
              duration: 2000
            });
            return;
          } else if (response.data === "4") {
            this.$notify({
              title: "失败",
              message: "权限不足",
              type: "error",
              duration: 2000
            });
            return ;
          }
          this.getList();
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        });
      });
    },
    onCancel() {
      this.formEdit = true;
      this.formStatus = "";
    },
    resetForm() {
      this.form = {
        parentId: this.currentId
      };
    }
  }
};
</script>

