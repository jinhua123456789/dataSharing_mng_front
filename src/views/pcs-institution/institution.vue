<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="机构名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.adminTrueName"
        placeholder="管理员姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.type" placeholder="机构类型" clearable>
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.label"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <el-cascader
        size="large"
        clearable
        placeholder="请选择省市区"
        :options="options"
        v-model="selectedOptions"
        @change="handleChange2"
      ></el-cascader>

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
      <!--      <el-button-->
      <!--        v-waves-->
      <!--        :loading="downloadLoading"-->
      <!--        class="filter-item"-->
      <!--        type="primary"-->
      <!--        icon="el-icon-download"-->
      <!--        @click="handleDownload"-->
      <!--      >-->
      <!--        {{ $t('sysuser.export') }}-->
      <!--      </el-button>-->
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!--      <el-table-column-->
      <!--        :label="$t('sysuser.id')"-->
      <!--        prop="id"-->
      <!--        sortable="custom"-->
      <!--        align="center"-->
      <!--        width="150px"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.id }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="机构名称" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构类型" min-width="60px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员姓名" min-width="60px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.adminTrueName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="省" min-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.province}}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" min-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.city}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区" min-width="50px">
        <template slot-scope="scope">
          <span>{{scope.row.district}}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status">{{row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核通过时间" min-width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.approvalTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="停止服务时间" min-width="82px">
        <template slot-scope="scope">
          <span>{{scope.row.stopServiceTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="360"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">更新</el-button>
          <el-button v-if="row.status==='待审核'" size="mini" type="primary" @click="verify(row.id)">审核</el-button>
          <el-button v-else size="mini" type="info" disabled>审核</el-button>

          <el-button
            v-if="row.status==='停止服务'"
            size="small"
            type="primary"
            @click="handleEnableService(row.id)"
          >
            <!--            {{ $t('table.delete') }}-->
            启用
          </el-button>
          <el-button v-else size="small" type="info" disabled>启用</el-button>

          <el-button
            v-if="row.status==='正常'"
            size="small"
            type="danger"
            @click="handleStopService(row.id)"
          >
            <!--            {{ $t('table.delete') }}-->
            停止服务
          </el-button>
          <el-button v-else size="small" type="info" disabled>停止服务</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:60px;"
      >
        <el-form-item label="机构名称" prop="name" label-width="120px">
          <el-input v-model="temp.name" type="text" placeholder="机构名称" />
        </el-form-item>
        <el-form-item label="机构类型" prop="type" label-width="120px">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="机构所属部门"
          prop="department"
          label-width="120px"
        >
        <el-input
            v-model="temp.name"
            type="text"
            placeholder="请选择下面的部门"
            disabled="true"
          />
        <DepManageTree/>
        </el-form-item>-->
        <el-form-item label="机构所属部门" v-model="temp.unitId" prop="unitId">
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
        <el-form-item label="管理员联系电话" label-width="120px" prop="adminPhone">
          <el-input v-model="temp.adminPhone" type="text" placeholder="管理员电话" />
        </el-form-item>
        <el-form-item label="管理员姓名" label-width="120px" prop="adminTrueName">
          <el-input v-model="temp.adminTrueName" type="text" placeholder="管理员真实姓名" />
        </el-form-item>

        <el-form-item label="省/市/区" label-width="120px" prop="selectedOptions">
          <el-cascader
            size="large"
            :options="options"
            v-model="temp.selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="地址" label-width="120px" prop="address">
          <el-input v-model="temp.address" type="text" placeholder="机构地址" />
        </el-form-item>

        <el-form-item label="机构缩写" label-width="120px" prop="abbr">
          <el-input v-model="temp.abbr" type="text" placeholder="机构缩写" />
        </el-form-item>
        <!--        <el-form-item-->
        <!--          label="上级机构"-->
        <!--          label-width="80px"-->
        <!--        >-->
        <!--          <el-input v-model="temp.parentOrg" />-->
        <!--        </el-form-item>-->
        <el-form-item label="logo" label-width="85px" enctype="multipart/form-data">
          <el-upload
            ref="upload"
            :action="actionUrl"
            name="picture"
            list-type="picture-card"
            :limit="1"
            :file-list="fileList"
            :on-exceed="onExceed"
            :before-upload="beforeUploadImg"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="机构简介" label-width="120px">
          <el-input v-model="temp.info" placeholder="机构简介" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVerifyVisible" title="Reading statistics">
      <span>是否通过审核</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVerifyVisible = false">否</el-button>
        <el-button type="primary" @click="dialogVerifyVisible = false">是</el-button>
      </span>
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
  fatchByName,
  addObj,
  putObj,
  verifyOrg,
  stopService,
  enableService,
  getImgUrl,
  getDetails
} from "@/api/institution";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import Vue from "vue";
import Validator from "vue-validator";
import {
  regionData,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import {
  validatePhone,
  validUsername2,
  validateEMail
} from "../../utils/validate";
import DepManageTree from "./component/DepManageTree";
import { fetchTreeNoPrivilege } from "@/api/OrgDpt.js";
Vue.use(Validator);

// const calendarTypeOptions = [
//   { key: '学校', display_name: '学校' },
//   { key: '机关单位', display_name: '机关单位' },
// ]

// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: "Org",
  components: { Pagination, DepManageTree },
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
    let checkLetter = (rule, value, callback) => {
      if (/^[a-z]+$/.test(value)) {
        callback();
      } else {
        callback(new Error("只能输入小写字母"));
      }
    };

    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字电话号"));
        } else {
          if (value < 99) {
            callback(new Error("请输入正确电话号"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
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
      checkedId: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
      dptList: [],
      actionUrl: process.env.VUE_APP_BASE_API + "pcs-system/org/uploadImg",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      //图片文件上传的参数
      dialogImageUrl: "",
      dialogVisible: false,
      //图片列表（用于在上传组件中回显图片）
      fileList: [{ name: "", url: "" }],
      listQuery: {
        page: undefined,
        limit: 20,
        id: undefined,
        name: undefined,
        uniformSocialCreditCode: undefined,
        adminId: undefined,
        adminTrueName: undefined,
        info: undefined,
        homeUrl: undefined,
        province: undefined,
        city: undefined,
        district: undefined,
        parentId: undefined,
        creatTime: undefined,
        approvalTime: undefined,
        stopService: undefined,
        status: undefined,
        sort: "+id",
        type: null
      },

      //行政区划
      options: regionData,
      options2: regionDataPlus,
      selectedOptions: [],

      calendarTypeOptions: [],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["正常", "待审核", "审核不通过", "停止服务"],
      temp: {
        id: undefined,
        unitId: null, //部门Id
        name: undefined,
        uniformSocialCreditCode: undefined,
        adminId: undefined,
        adminUsername: undefined,
        adminTrueName: undefined,
        adminPhone: undefined,
        info: undefined,
        homeUrl: undefined,
        province: undefined,
        city: undefined,
        district: undefined,
        parentId: undefined,
        creatTime: undefined,
        approvalTime: undefined,
        stopService: undefined,
        abbr: undefined,
        status: undefined,
        selectedOptions: [],
        imgUrl: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "更新机构",
        create: "新增机构"
      },
      dialogPvVisible: false,
      dialogVerifyVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择机构类型", trigger: "change" }
        ],
        adminUsername: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          { validator: validUsername2, trigger: "blur" }
        ],
        adminPhone: [
          { required: true, message: "请输入管理员电话", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        adminTrueName: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字", trigger: "blur" }
        ],
        adminUrl: [
          { required: true, message: "请输入机构缩写", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字", trigger: "blur" }
        ],
        selectedOptions: [
          { required: true, message: "请选择省市区", trigger: "blur" }
        ],
        abbr: [
          {
            required: true,
            min: 0,
            max: 100,
            message: "长度在 0 到 100 个字",
            trigger: "blur"
          },
          { validator: checkLetter, trigger: ["change", "blur"] }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.listQuery.page = 1;
    this.getList();
    this.getDicDetails();
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
    //表单行政区划列表
    handleChange(value) {
      this.temp.province = CodeToText[value[0]];
      this.temp.city = CodeToText[value[1]];
      this.temp.district = CodeToText[value[2]];
    },
    //查询行政区划
    handleChange2(value) {
      this.listQuery.province = CodeToText[value[0]];
      this.listQuery.city = CodeToText[value[1]];
      this.listQuery.district = CodeToText[value[2]];
    },

    getList() {
      //this.listLoading = true
      fetchList(this.listQuery).then(response => {
        //console.log(this.listQuery.page)
        this.list = response.data.content;
        this.total = response.data.totalElements;
        //console.log(this.list)
        // Just to simulate the time of the request
      });
    },
    getById() {
      this.listLoading = true;
      //console.log(this.listQuery.id)
      fetchSysuser(this.listQuery.id).then(response => {
        console.log("id" + response);
        this.list = response.data;
        //this.total = response.data.data.totalElements
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    getByName() {
      this.listLoading = true;

      fetchSysuserByName(this.listQuery.name).then(response => {
        this.listLoading = true;
        this.list = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 100);
      });
    },
    handleFilter() {
      //console.log(this.listQuery.id)
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
    getOrgList() {
      fetchTreeNoPrivilege().then(response => {
        this.dptList = response.data;
      });
    },
    getDicDetails() {
      getDetails("机构类型").then(response => {
        this.calendarTypeOptions = response;
      });
    },
    resetTemp() {
      (this.temp = {
        id: undefined,
        remark: "",
        timestamp: new Date(),
        name: undefined,
        uniformSocialCreditCode: undefined,
        adminId: undefined,
        adminUsername: undefined,
        adminTrueName: undefined,
        adminPhone: undefined,
        info: undefined,
        homeUrl: undefined,
        province: undefined,
        city: undefined,
        district: undefined,
        parentId: undefined,
        creatTime: undefined,
        approvalTime: undefined,
        stopService: undefined,
        abbr: undefined,
        status: "待审核",
        selectedOptions: []
      }),
        (this.fileList = []);
    },
    handleCreate() {
      this.getDicDetails();
      this.getOrgList();
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.unitId = this.$refs.tree.getCheckedKeys().pop();
          addObj(this.temp).then(response => {
            if (response.data === "0") {
              // this.list.unshift(this.temp)
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
            } else if (response.data === "1") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "机构名已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "2") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "机构缩写已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "3") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "手机号已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "4") {
              this.dialogFormVisible = true;
              this.$notify({
                title: "失败",
                message: "暂无权限",
                type: "warning",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.getDicDetails();
      this.getOrgList();
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);

      this.getImgUrl(row.logo);
      let s = [];
      s.push(TextToCode[this.temp.province].code);
      s.push(TextToCode[this.temp.province][this.temp.city].code);
      s.push(
        TextToCode[this.temp.province][this.temp.city][this.temp.district].code
      );
      // let arr = []

      this.temp.selectedOptions = s;
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
          this.temp.unitId = this.$refs.tree.getCheckedKeys().pop();
          putObj(this.temp).then(response => {
            if (response.data === "0") {
              // this.list.unshift(this.temp)
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "编辑成功",
                type: "success",
                duration: 2000
              });
            } else if (response.data === "1") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "机构名已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "2") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "机构缩写已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "3") {
              this.dialogFormVisible = true;
              this.getList();
              this.$notify({
                title: "失败",
                message: "手机号已存在",
                type: "warning",
                duration: 2000
              });
            } else if (response.data === "4") {
              this.dialogFormVisible = true;
              this.$notify({
                title: "失败",
                message: "暂无权限",
                type: "warning",
                duration: 2000
              });
            }
          });
        }
      });
    },
    handleStopService(id) {
      stopService(id).then(response => {
        if (response.data === "4") {
          this.$notify({
            title: "失败",
            message: "暂无权限",
            type: "warning",
            duration: 2000
          });
          return false;
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "已停止服务",
          type: "warning",
          duration: 2000
        });
      });
    },
    stopService() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          stopService(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            //this.dialogFormVisible = false
            this.$notify({
              title: "成功",
              message: "已停止服务",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },

    handleEnableService(id) {
      enableService(id).then(response => {
        if (response.data === "4") {
          this.$notify({
            title: "失败",
            message: "暂无权限",
            type: "warning",
            duration: 2000
          });
          return false;
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "已启用服务",
          type: "success",
          duration: 2000
        });
      });
    },
    enableService() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          //tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          enableService(tempData.id).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            //this.dialogFormVisible = false
            this.$notify({
              title: "成功",
              message: "已启用服务",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleVerify(id) {
      this.dialogVerifyVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    verify(id) {
      verifyOrg(id).then(response => {
        if (response.data === "4") {
          this.$notify({
            title: "失败",
            message: "暂无权限",
            type: "warning",
            duration: 2000
          });
          return false;
        }
        this.getList();
        this.$notify({
          title: "成功",
          message: "审核成功",
          type: "success",
          duration: 2000
        });
      });
    },

    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
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

    //文件上传成功的钩子函数
    handleSuccess(res, file) {
      this.$message({
        type: "info",
        message: "图片上传成功",
        duration: 6000
      });
      if (file.response.code === 0) {
        this.temp.logo = file.response.msg; //将返回的文件储存路径赋值picture字段
        console.log(this.temp.logo);
      }
    },
    //删除文件之前的钩子函数
    handleRemove(file, fileList) {
      this.$message({
        type: "info",
        message: "已删除原有logo",
        duration: 6000
      });
    },
    //点击列表中已上传的文件事的钩子函数
    handlePreview(file) {},
    //上传的文件个数超出设定时触发的函数
    onExceed(files, fileList) {
      this.$message({
        type: "info",
        message: "最多只能上传一个logo",
        duration: 6000
      });
    },
    //文件上传前的前的钩子函数
    //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUploadImg(file) {
      const isJPG = file.type === "image/jpeg";
      const isGIF = file.type === "image/gif";
      const isPNG = file.type === "image/png";
      const isBMP = file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error("上传logo必须是JPG/GIF/PNG/BMP 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传logo大小不能超过 2MB!");
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
    },

    getImgUrl(key) {
      getImgUrl(key).then(response => {
        this.temp.imgUrl = response.data;
        if (this.temp.imgUrl != null)
          this.fileList = [{ name: this.temp.imgUrl, url: this.temp.imgUrl }];
        else this.fileList = [];
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
