<template>
  <el-container>
    <el-main style="display:grid;justify-content: center;align-items: center">
        <el-table
          :data="showTable"
          stripe
          style="margin-top: 30px;"
          border>
          <el-table-column
            prop="userId"
            label="用户id"
            align="center"
            width="180px"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下载时间"
            align="center"
            width="230px"
          >
          </el-table-column>
          <el-table-column
            prop="sourceTable"
            label="下载表格"
            align="center"
            width="210px"
          >
          </el-table-column>
        </el-table>
    </el-main>
    <el-footer>
        <el-pagination
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next"
          :page-size="pagesize"
          :total="this.tableData.length"
          background
        >
        </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
// import { createAction } from "@antv/g2/lib/interaction/action";
import axios from "axios";
export default {
  data() {
    return {
      pagesize: 10, //设置每页显示条目个数为10
      currentPage: 1, //设置当前页默认为1

      tableData: [], //分页前的数据
    };
  },
  created() {
    this.getDownloadHistory();
  },
  computed: {
    //showTable计算属性通过slice方法计算表格当前应显示的数据
    showTable() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
    },
  },
  methods: {},

  methods: {
    //设置当前页为点击页
    handleCurrentChange(val) {
      console.log("当前页: ${val}");
      console.log(val);
      this.currentPage = val;
    },
    getDownloadHistory() {
      axios
        .get(
          "http://10.112.64.74:8765/globalHistory"
        )
        .then((res) => {
          this.tableData = res.data;
        });
    },
    print() {
      console.log(this.currentPage);
    },
  },
};
</script>
<style scoped>
  .el-main {
    display: block;
    flex-basis: auto;
    overflow: hidden;
    padding: 0 20px;
  }
</style>
