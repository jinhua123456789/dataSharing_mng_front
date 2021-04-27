<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole" icon="el-icon-plus">新增</el-button>

    <el-table :data="rolesList" stripe style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色名" width="220">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">更新</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >{{ $t('permission.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'更新角色':'新增角色'">
      <el-form :model="role" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="role.name" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input
            v-model="role.roleDesc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="范围">
          <el-radio v-model="scope_radio" label="1">全局</el-radio>
          <el-radio v-model="scope_radio" label="2">部门</el-radio>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree
            ref="permissionTree"
            :check-strictly="false"
            trictly
            :data="routes"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
            @check-change="handleClick"
            @node-click="nodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span
                v-if="scope_radio != '1' &&(data.children == null || data.children.length == 0)"
              >
                <el-radio size="mini" v-model="routesLevel[data.id]"  label=3 >同级</el-radio>
                <el-radio size="mini" v-model="routesLevel[data.id]"  label=2 >同下级</el-radio>
                <!-- <el-button type="text" size="mini" @click="() => changeAttr(node, data)">转换</el-button> -->
              </span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
  getRolesById
} from "@/api/role";
import Vue from "vue";

const defaultRole = {
  id: "",
  name: "",
  roleDesc: "",
  routes: []
};

export default {
  data() {
    return {
      radio: 1,
      scope_radio: "1",
      routesLevel: {},
      temp_map:{},
      role: Object.assign({}, defaultRole),
      selectRoutes: [1001],
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "新增",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      rules: {
        name: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          { type: "string", max: 30, message: "最长30个汉字", trigger: "blur" }
        ],
        roleDesc: [
          {
            type: "string",
            max: 100,
            message: "最长100个汉字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.getRoutes();
    this.getRoles();
  },
  methods: {
    handleClick(data, checked, node) {
      if (checked == true) {
        this.checkedId = data.id;
        this.$refs.tree.setCheckedNodes([data]);
      }
    },
    nodeClick(data, checked, node) {
      this.checkedId = data.id;
      this.$refs.tree.setCheckedNodes([data]);
    },
    async getRoutes() {
      
      const res = await getRoutes();
      this.routes = res.data;
      for (var i = 0; i < this.routes.length; i++) {
        this.traverseTree(this.routes[i]);
      }
    },
    traverseTree(node) {
      if (node.children.length == 0) {
        Vue.set(this.routesLevel, node.id, "3");
        return;
      } else if (node.children.length > 0) {
        var i = 0;
        for (i = 0; i < node.children.length; i++) {
          this.traverseTree(node.children[i]);
        }
      }
    },
    async getRoles() {
      const res = await getRoles();
      this.rolesList = res.data.content;
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys([]);
        this.checkStrictly = false;
      });
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      //this.getRoutes();
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.role = deepClone(scope.row);
      this.scope_radio = this.role.type
      //回显同级还是同下级
      console.log(this.role.routesLevel)
      for(var i = 0; i< this.role.routes.length;i++){
        //当是叶子节点时,进行填充
        var route_temp = this.role.routes[i];
        if(this.routesLevel[route_temp+''] != null){
          if(this.role.routesLevel[route_temp+''] == '1'){
            this.routesLevel[route_temp] = '3'
          }else{
          this.routesLevel[route_temp] = this.role.routesLevel[route_temp+'']
          }
        }
      }

      this.$nextTick(() => {
        let lzx = [];
        //权限tree回显
        for(var i = 0;i<this.role.privileges.length;i++){
          //只针对叶子节点（this.routesLevel中的key就是叶子节点）
          if(this.routesLevel[this.role.privileges[i].id] != null){
            lzx.push({id:this.role.privileges[i].id,label:this.role.privileges[i].name})
          }
        }
        console.log(this.routesLevel)
        console.log(lzx)
        this.$refs.permissionTree.setCheckedNodes(lzx);
        this.checkStrictly = false;
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm("确认删除这个角色?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const msg = await deleteRole(row.id);
          // this.rolesList.splice($index, 1)
          this.getRoles();
          this.$message({
            type: "success",
            message: msg.data
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    async confirmRole() {
      if (this.role.name == null || this.role.name == "") {
        this.$notify.error({
          title: "错误",
          message: "角色名不能为空！！！"
        });
        return false;
      }
      const isEdit = this.dialogType === "edit";

      const checkedKeys = this.$refs.permissionTree.getCheckedKeys();

      this.role.routes = checkedKeys;
      /////////////////////////////////////////在此处添加
      for(var i = 0;i<this.role.routes.length;i++){
        Vue.set(this.temp_map,this.role.routes[i],this.routesLevel[this.role.routes[i]])
      }
      this.role.routesLevel = this.temp_map

      this.role.type = this.scope_radio
      if (isEdit) {
        //await updateRole(this.role.key, this.role)
        await updateRole(this.role);
        this.getRoles();
        this.getRoutes();
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role));
            break;
          }
        }
      } else {
        const { data } = await addRole(this.role);
        this.getRoles();
        this.getRoutes();
      }
      const { roleDesc, name } = this.role;
      this.dialogVisible = false;
      this.$notify({
        title: "成功",
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色名: ${name}</div>
            <div>描述: ${roleDesc}</div>
          `,
        type: "success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
