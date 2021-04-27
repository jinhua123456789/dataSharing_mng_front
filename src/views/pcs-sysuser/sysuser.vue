<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('sysuser.username')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.roleId"
        placeholder="角色"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in this.roleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.trueName"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('sysuser.username')" min-width="60px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('sysuser.name')" min-width="60px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unitName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" min-width="60px">
        <template slot-scope="{row}">
          <el-tag v-for="role in row.roleList" :key="role">{{role}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.status')" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="400"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">更新</el-button>
          <el-button
            v-if="row.status!='废除'"
            size="mini"
            type="danger"
            @click="handleDelete(row.id)"
          >废弃</el-button>
          <el-button v-else size="mini" type="info" disabled>废弃</el-button>
          <el-button
            v-if="row.status!='正常'"
            size="mini"
            type="success"
            @click="handleEnable(row.id)"
          >启用</el-button>
          <el-button v-else size="mini" type="info" disabled>启用</el-button>
          <el-button size="mini" type="danger" @click="handleUserDelete(row.username)"
          >删除</el-button>
          <el-button
            v-if="row.status!='删除'"
            size="small"
            type="success"
            @click="resetPassword(row.id)"
          >恢复密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="删除" :visible.sync="deleteVisible" width="30%">
      <span>确认删除这个用户吗</span>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitDelete(username)">确 定</el-button>
          <el-button @click="deleteVisible = false">取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%" >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 100%"
      >
        <el-form-item :label="$t('sysuser.username')" prop="username" label-width="80px">
          <el-input style="width: 60%;float: left" v-model="temp.username" type="text" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="trueName" label-width="80px">
                  <el-input style="width: 60%;float: left" v-model="temp.trueName" type="text" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds" label-width="80px">
          <el-select v-model="temp.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in this.roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item  label="所属部门">
          <el-tree
            ref="tree"
            check-strictly
            :data="dptList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            default-expand-all
            @check-change="handleClick"
            @node-click="nodeClick"
          />
        </el-form-item>

        <el-form-item label="联系电话" prop="phoneNumber" label-width="80px">
          <el-input style="width: 60%;float: left" v-model="temp.phoneNumber" type="text" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="emil" label-width="80px">
          <el-input style="width: 60%;float: left" v-model="temp.email" type="text" placeholder="邮箱" />
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('sysuser.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('sysuser.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createSysuser,
  updateSysuser,
  fetchSysuser,
  fetchSysuserByName,
  abandonSysuser,
  enable,
  resetPassword, deleteUser
} from "@/api/sysuser";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Vue from "vue";
import Validator from "vue-validator";
import {addRole, getRoles, updateRole} from "../../api/role";
import {
  validatePhone,
  validUsername2,
  validateEMail
} from "../../utils/validate";
import { fetchTreeNoPrivilege } from "@/api/OrgDpt.js";
import {deleteBlockByBlockId} from "@/api/portal";

Vue.use(Validator);

const calendarTypeOptions = [
  { id: "2", display_name: "Admin" },
  { id: "1", display_name: "SuperAdmin" },
  { id: "3", display_name: "vistor" }
];
const defaultUser =  {
  id: "",
  phoneNumber: "",
  email: "",
  password: "",
  dptName: "",
  status: "正常",
  age: null,
  salary: null,
  trueName: "",
  userType: null,
  username: "",
  unitId: null,
  roles: [],
  orgName: null,
  unitName: "",
  roleList: [],
  roleIds: [],
  authorities: [],
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  timestamp: null
};

const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "Sysuser",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },

  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.temp.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      tableKey: 0,
      list: null,
      username: undefined,
      total: 0,
      listLoading: true,
      roleList: [],
      dptList: [],
      listQuery: {
        page: 0,
        limit: 20,
        id: undefined,
        username: undefined,
        trueName: undefined,
        password: undefined,
        institution: undefined,
        roleId: undefined,
        sort: "+id"
      },
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["normal"],

      temp:
        {
          id: "",
          phoneNumber: "",
          email: "",
          password: "",
          dptName: "",
          status: "正常",
          age: null,
          salary: null,
          trueName: "",
          userType: null,
          username: "",
          unitId: null,
          roles: [],
          orgName: null,
          unitName: "",
          roleList: [],
          roleIds: [],
          authorities: [],
          enabled: true,
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          timestamp: null
        },
      deleteVisible: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新用户",
        create: "新增用户"
      },
      dialogPvVisible: false,
      pvData: [],

      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          { validator: validUsername2, trigger: "blur" }
        ],
        trueName: [
          { required: true, message: "请填写真实姓名", trigger: "blur" },
          { type: "string", max: 30, message: "最长30个汉字", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          {
            type: "string",
            min: 11,
            message: "手机号不允许小于11位",
            trigger: "blur"
          },
          { validator: validatePhone, trigger: "blur" }
        ],
        roleIds: [
          {
            required: true,
            message: "请选择一个角色",
            trigger: ["blur", "change"]
          }
        ],
        emil: [
          { required: false, trigger: "blur" },
          { validator: validateEMail, trigger: ["blur", "change"] }
        ],
        unitId: [{ required: true, message: "请选择所属部门", trigger: "blur" }]
      },

      downloadLoading: false
    };
  },
  created() {
    this.listQuery.page = 0;
    this.getList();
    this.getRoleList();

  },
  methods: {
    handleClick(data, checked, node) {
      if (checked == true) {
        this.checkedId = data.id;
        this.$refs.tree.setCheckedNodes([data]);
      }
    },
    nodeClick(data, checked, node) {
      this.temp.unitId = this.$refs.tree.getCheckedKeys().pop();
      this.checkedId = data.id;
      this.$refs.tree.setCheckedNodes([data]);
    },
    getOrgList() {
      fetchTreeNoPrivilege().then(response => {
        this.dptList = response.data;
      });
      console.log("orgList" + this.orgList)
    },
    getRoleList() {
      getRoles().then(response => {
        this.roleList = response.data.content;

      });
      //console.log("roleList.id" + this.roleList.id)
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.content;
        this.total = response.data.totalElements;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getById() {
      this.listLoading = true;
      fetchSysuser(this.listQuery.id).then(response => {
        this.list = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getByName() {
      this.listLoading = true;

      fetchSysuserByName(this.listQuery.username).then(response => {
        this.listLoading = true;
        this.list = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    handleFilter() {
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = Object.assign({}, defaultUser);
    },
    handleCreate() {
      this.resetTemp();
      this.getOrgList();
      this.getRoleList();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      let s = [];
      for (var i = 0; i < this.temp.roleIds.length; i++) {
        s.push(this.temp.roleIds[i]);
      }

      this.temp.roleIds = s;
      this.temp.unitId = this.$refs.tree.getCheckedKeys().pop();

      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createSysuser(this.temp).then(response => {
            //this.list.unshift(response.data)
            if (response.data === "0") {
              this.getList();
              this.getRoleList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else {
              // this.dialogFormVisible = false;
              this.$notify({
                title: "失败",
                message: "创建失败",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.getOrgList();
      this.getRoleList();
      this.temp = Object.assign({}, row); // copy obj
      console.log("row " + row)

      this.temp.timestamp = new Date(this.temp.timestamp);
      console.log("updateTemp" + Object.keys(this.temp));

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        let arr = [];
        arr.push(this.temp.unitId);
        this.$refs.tree.setCheckedKeys(arr, false);
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.unitId = this.$refs.tree.getCheckedKeys().pop();
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log("updateTempData " + tempData.unitId);
          updateSysuser(tempData).then(response => {
            if (response.data === "0") {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000
              });
            } else if (response.data === "1") {
              // this.dialogFormVisible = false;
              this.$notify({
                title: "失败",
                message: "手机号重复！！！",
                type: "error",
                duration: 2000
              });
            } else if (response.data === "2") {
              //this.dialogFormVisible = false;
              this.$notify({
                title: "失败",
                message: "用户名重复",
                type: "error",
                duration: 2000
              });
            } else if (response.data === "4") {
              this.$notify({
                title: "失败",
                message: "无权限操作",
                type: "error",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleDelete(id) {
      abandonSysuser(id).then(response => {
        if (response.data === "4") {
          this.$notify({
            title: "错误",
            message: "无权限操作",
            type: "error",
            duration: 2000
          });
          return false;
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "废弃成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleUserDelete(username) {
      this.deleteVisible = true;
      this.username = username;
    },
    submitDelete(username) {
      /*for (const v of this.dormitory) {
          if (v.meet === this.temp.meet) {
            const index = this.dormitory.indexOf(v)
            this.dormitory.splice(index, 1)
            console.log(this.dormitory)
            break
          }
        }*/

      this.deleteVisible = false;
      deleteUser(username)
        .then(() => {
          this.getList();
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


    handleEnable(id) {
      enable(id).then(response => {
        if (response.data === "4") {
          this.$notify({
            title: "错误",
            message: "无权限操作",
            type: "error",
            duration: 2000
          });
          return false;
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "启用成功",
          type: "success",
          duration: 2000
        });
      });
    },
    resetPassword(id) {
      resetPassword(id).then(response => {
        if(response.data === '4'){
          this.$notify({
          title: "错误",
          message: "无权限操作",
          type: "error",
          duration: 2000
        })
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "密码已重置，默认为联系方式",
          type: "success",
          duration: 2000
        });
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "id",
          "username",
          "name",
          "institution",
          "type",
          "phone",
          "emil"
        ];
        const filterVal = [
          "id",
          "username",
          "name",
          "institution",
          "type",
          "phone",
          "emil"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
