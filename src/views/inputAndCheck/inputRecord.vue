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
        <el-select
          v-model="listQuery.state"
          placeholder="状态"
          clearable
          class="filter-item"
          style="width: 200px"
        >
          <el-option
            v-for="item in this.statusList"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

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
              v-if="col.dataItem != 'checkLog'"
            ></el-table-column>
          </template>
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <!-- <el-button type="primary" size="small" @click="handleUpdate(row)">编辑</el-button> -->
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="success" size="small" @click="getCheckLog(scope.row)">人工审核意见</el-button>
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
    <!-- :limit.sync="listQuery.limit" -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div></div>
      <el-select
        placeholder="模板类型"
        clearable
        class="filter-item"
        style="width: 200px"
        v-model="optionValue"
        @change="selectTemplateType(optionValue)"
      >
        <el-option
          v-for="item in this.tableList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <form-create v-model="$f" :rule="form_gen_rules" @on-submit="onSubmit"></form-create>
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

<script type="module">
import {
  fetchList,
  getTableFieldById,
  getStationId,
  addRecord,
  delRecord,
} from "@/api/inputRecord";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Vue from "vue";
import Validator from "vue-validator";
import { fetchTableList } from "@/api/table";
import { getInfo } from "@/api/user";

import {
  validatePhone,
  validUsername2,
  validateEMail,
} from "../../utils/validate";
import { fetchTreeNoPrivilege } from "@/api/OrgDpt.js";

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
      optionValue: null,
      $f: {},
      //表单生成规则
      form_gen_rules: [],
      stationList:[],
      var_options:[],
      tables: [],
      tableData: [],
      table_form: {
        rain_station: "",
        rainfall: "",
        observation_time: "",
        runoff_producing: "",
        observation_person: "",
        observation_person: "",
        reviewer: "",
        description: "",
      },
      reportIndex: 0,
      reportValue: "",
      tableList: [],
      statusList: [
        {
          key: "noChecked",
          label: "待审核",
          value: 1,
        },
        {
          key: "pass",
          label: "通过",
          value: 2,
        },
        {
          key: "fail",
          label: "未通过",
          value: 3,
        },
      ],
      value: "",
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
      dialogStatus: "",
      textMap: {
        update: "更新数据",
        create: "录入数据",
      },
      dialogPvVisible: false,
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
    this.getStationList("雨量站编号");
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
        for (let i in response.data.recordDetail) {
          let data = response.data.recordDetail[i];
          this.tableData.push({
            dataItem: data.table_field_name,
            dataName: data.table_field_name_zh,
          });
        }

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
        type: "success",
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
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        phoneNumber: undefined,
        dptId: undefined,
        status: "正常",
        type: "",
        roleIds: [],
        roleList: undefined,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {},
    handleUpdate(row) {},
    updateData() {},
    handleDelete(row) {
      this.$confirm("确认删除吗?", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const msg = await delRecord(row.singleDataId, this.loginedUserId);
          this.getList();
          this.$message({
            type: "success",
            message: msg.data,
            duration: 1000,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    selectTemplateType(id) {
      this.form_gen_rules = [];
      getTableFieldById(id).then((response) => {
        for (let i in response.data) {
          let data = response.data[i];
          let table_field_type = response.data[i].table_field_type;
          let table_field_name_zh = response.data[i].table_field_name_zh;

          if (table_field_name_zh == "雨量站编号") {
            this.form_gen_rules.push({
              type: "select",
              field: data.table_field_name,
              title: data.table_field_name_zh,
              value: this.stationList,
              options: this.var_options,
            });
          } else if (
            table_field_type == "double" ||
            table_field_type === "int"
          ) {
            this.form_gen_rules.push({
              type: "input",
              field: data.table_field_name,
              title: data.table_field_name_zh,
              props: { placeholder: "请填写数字！" },
            });
          } else if (table_field_type === "date") {
            this.form_gen_rules.push({
              type: "datePicker",
              field: data.table_field_name,
              title: data.table_field_name_zh,
            });
          } else if (table_field_type === "datetime") {
            this.form_gen_rules.push({
              field: data.table_field_name,
              title: data.table_field_name_zh,
              type: "DatePicker",
              props: {
                "type": "datetime",
                "format": "yyyy-MM-dd HH:mm:ss",
                "placeholder":"请选择具体时间",
              }
            });
          } else if (table_field_type === "String"||table_field_type === "text") {
            this.form_gen_rules.push({
              type: "input",
              field: data.table_field_name,
              title: data.table_field_name_zh,
            });
          } else if (table_field_type === "bit") {
            this.form_gen_rules.push({
              type: "select",
              field: data.table_field_name,
              title: data.table_field_name_zh,
              value: ["1", "0"],
              options: [
                { value: "1", label: "是", disabled: false },
                { value: "0", label: "否", disabled: false },
              ],
            });
          }
        }
      });
    },
    onSubmit(formData) {
      this.$confirm("是否提交数据", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).then(() => {
        addRecord(formData, this.loginedUserId, this.optionValue).then(
          (response) => {
            if (response.code === 500) {
              this.$notify({
                title: "失败",
                message: response.data,
                type: "error",
                duration: 4000,
              });
              return;
            } else {
              this.$message({
                message: "自动审核通过，提交成功！",
                type: "success",
                duration: 1000,
              });
              this.getList();
            }
          }
        );
      });
    },

    getCheckLog(row) {
      if (row.checkLog === null || row.checkLog === "") {
        this.$alert("暂时没有被审核", "审核日志", {
          confirmButtonText: "确定",
        });
      } else {
        this.$alert(row.checkLog, "审核日志", {
          confirmButtonText: "确定",
        });
      }
    },
    getStationList(table_field_name_zh) {
      getStationId(table_field_name_zh).then((response) => {
        this.stationList = response.data;
        this.stationList.forEach((item) => {
          this.var_options.push({ value: item, label: item, disabled: false });
        });
      });
    },
  },
};
</script>