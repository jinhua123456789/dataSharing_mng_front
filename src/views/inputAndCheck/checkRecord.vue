<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-select
          v-model="listQuery.recordId"
          placeholder="模板类型"
          class="filter-item"
          style="width: 200px"
        >
          <el-option
            v-for="item in this.tableList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="listQuery.createAuthorName"
          placeholder="导入人"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="listQuery.updateAuthorName"
          placeholder="审核人"
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
      </div>
    </el-card>
    <div class="table-container">
      <div style="margin-top: 20px">
        <el-table
          :data="tables"
          stripe
          border
          fit
          highlight-current-row
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <template v-for="(col) in tableData">
            <el-table-column
              sortable
              :show-overflow-tooltip="true"
              :prop="col.dataItem"
              :label="col.dataName"
              :key="col.dataItem"
              v-if="col.dataItem != 'checkLog' || col.dataItem != 'singleDataId'"
            ></el-table-column>
          </template>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="primary" size="small" @click="handleUpdate(row)">编辑</el-button> -->
              <el-button type="success" size="small" @click="pass(scope.row)">通过</el-button>
              <el-button
                type="danger"
                size="small"
                @click="dialogFormVisible=true;getSingleDataId(scope.row)"
              >不通过</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      @pagination="getList"
    />
    <el-dialog title="审批意见" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="意见" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.checkLog"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="refuse()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchPv,
  createSysuser,
  updateSysuser,
  fetchSysuser,
  fetchSysuserByName,
  abandonSysuser,
  enable,
  resetPassword,
} from "@/api/sysuser";
import { fetchList } from "@/api/inputRecord";
import { refuseRecord,passRecord} from "@/api/checkRecord";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Vue from "vue";
import Validator from "vue-validator";
import { fetchTableList } from "@/api/table";

import {
  validatePhone,
  validUsername2,
  validateEMail,
} from "../../utils/validate";
import { fetchTreeNoPrivilege } from "@/api/OrgDpt.js";
import { getInfo } from "@/api/user";

Vue.use(Validator);

const calendarTypeOptions = [
  { id: "2", display_name: "Admin" },
  { id: "1", display_name: "SuperAdmin" },
  { id: "3", display_name: "vistor" },
];

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
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },

  data() {
    return {
      loginedUserId: null,
      tables: [],
      tableData: [],
      tableList: [],
      reportIndex: 0,
      reportValue: "",
      formLabelWidth: "120px",
      form: {
        checkAuthorId: null,
        checkLog: null,
        singleDataId: null,
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      roleList: undefined,
      dptList: [],
      listQuery: {
        recordId: 1,
        createAuthorName: "",
        updateAuthorName: "",
        state: 1,
        pageNum: 0,
      },
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["normal"],

      temp: {
        id: undefined,
        username: undefined,
        trueName: undefined,
        password: undefined,
        deptId: undefined,
        unitId: undefined,
        phoneNumber: undefined,
        emil: undefined,
        age: undefined,
        roleIds: undefined,
      },
      dialogFormVisible: false,
      textMap: {
        update: "更新用户",
        create: "新增用户",
      },
      pvData: [],
      downloadLoading: false,
    };
  },
  created() {
    this.listQuery.pageNum = 0;
    this.listQuery.recordId = 1;
    this.getList();
    this.getTemplateList();
    this.getUserId();
  },
  methods: {
    getUserId() {
      getInfo().then((response) => {
        this.loginedUserId = response.data.userId;
      });
    },
    getTemplateList() {
      fetchTableList().then((response) => {
        for (let i in response.data) {
          let data = response.data[i];
          this.tableList.push({ label: data.excelName, value: data.recordId });
        }
        console.log(this.tableList);
      });
    },

    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.total = response.data.pageResult.total;

        //清空历史数据
        this.tables = [];
        this.tableData = [];

        for (let i in response.data.pageResult.rows) {
          let data = response.data.pageResult.rows[i];
          this.tables.push(data);
        }
        console.log(this.tables);
        for (let i in response.data.recordDetail) {
          let data = response.data.recordDetail[i];
          this.tableData.push({
            dataItem: data.table_field_name,
            dataName: data.table_field_name_zh,
          });
        }
        console.log(this.tableData);

        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    handleFilter() {
      this.getList();
    },
    pass(row) {
      this.form.checkAuthorId = this.loginedUserId;
      console.log(this.form);
      this.$confirm("通过吗？", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        passRecord({checkAuthorId:this.loginedUserId,singleDataId:row.singleDataId}).then((response) => {
          if (response.code === 500) {
            this.$notify({
              title: "失败",
              message: "审批失败",
              type: "error",
              duration: 4000,
            });
            return;
          } else {
            this.$message({
              message: "审批成功",
              type: "success",
              duration: 3000,
            });
            this.getList();
          }
        });
      });
    },
    refuse() {
      /**
       * form: {
        checkAuthorId:null,
        checkLog: null,
        singleDataId:null
      },
       */
      this.form.checkAuthorId = this.loginedUserId;
      console.log(this.form);
      this.$confirm("要拒绝吗？", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        refuseRecord(this.form).then((response) => {
          if (response.code === 500) {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 4000,
            });
            return;
          } else {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000,
            });
            this.getList();
          }
          this.dialogFormVisible = false;
        });
      });
    },
    getSingleDataId(row) {
      console.log(row);
      this.form.singleDataId = row.singleDataId;
    },
  },
};
</script>
