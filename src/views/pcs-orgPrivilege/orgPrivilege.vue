
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
            label-width="80px"
            :rules="rules"
            :model="form"
            ref="form"
          >
            <!--              <el-form-item label="父级节点"-->
            <!--                            prop="parentId">-->
            <!--                <el-input v-model="form.parentId"-->
            <!--                          :disabled="formEdit"-->
            <!--                          placeholder="请输入父级节点"></el-input>-->
            <!--              </el-form-item>-->
            <!--              <el-form-item label="节点编号"-->
            <!--                            prop="deptId"-->
            <!--                            v-if="formEdit">-->
            <!--                <el-input v-model="form.id"-->
            <!--                          :disabled="formEdit"-->
            <!--                          placeholder="节点编号"></el-input>-->
            <!--              </el-form-item>-->
            <el-form-item label="权限名称" prop="name">
              <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="权限描述" prop="description">
              <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入简介"></el-input>
            </el-form-item>
            <el-form-item label="url" prop="url">
              <el-input v-model="form.url" :disabled="formEdit" placeholder="url"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="form.icon" :disabled="formEdit" placeholder="图标"></el-input>
            </el-form-item>
            <el-form-item label="组件">
              <el-input v-model="form.component" :disabled="formEdit" placeholder="组件"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model="form.sort" :disabled="formEdit" placeholder="排序"></el-input>
            </el-form-item>
            <!--              <el-form-item label="排序"-->
            <!--                            prop="orderNum">-->
            <!--                <el-input type="number"-->
            <!--                          v-model="form.sort"-->
            <!--                          :disabled="formEdit"-->
            <!--                          placeholder="请输入排序"></el-input>-->
            <!--              </el-form-item>-->
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
import {
  fetchTree,
  getObj,
  addObj,
  putObj,
  delObj
} from "@/api/OrgPrivilege.js";
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
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { max: 10, message: "最长10个字", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入权限描述", trigger: "blur" },
          { max: 100, message: "最长100个字", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入url", trigger: "blur" }],
        icon: [{ required: true, message: "请输入icon", trigger: "blur" }],
        component: [
          { required: true, message: "请输入component", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "请输入序号", trigger:"blur" }
        ]
      },
      labelPosition: "right",
      form: {
        name: undefined,
        id: undefined,
        parentId: 0,
        description: undefined,
        url: undefined,
        status: undefined,
        icon: undefined,
        component: undefined,
        sort: undefined,
        orgId: 1
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
          }
          if (response.data === "2") {
            this.$notify({
              title: "失败",
              message: "该权限目前有角色占用，请确保该权限无角色使用",
              type: "warning",
              duration: 4000
            });
            return;
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
        putObj(this.form).then(() => {
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
        addObj(this.form).then(() => {
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

