<template>
  <el-container>
    <el-table
      stripe
      border
      ref="multipleTable"
      :data="
        tableData.filter(
          (data) =>
            !search ||
            data.tableName.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="数据表名" prop="tableName"> </el-table-column>

      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input clearable v-model="search" placeholder="输入关键字搜索" />
        </template>
        <!-- <template slot-scope="scope">
          <el-button size="mini">Edit</el-button>
        </template> -->
      </el-table-column>
    </el-table>

    <el-footer>
      <el-button
        type="primary"
        round
        @click="toSecondStep()"
        style="margin-top: 10px"
        >下一步
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
// import { createAction } from "@antv/g2/lib/interaction/action";
import axios from "axios";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      search: "",
      tableData: [],
    };
  },

  components: {},
  created() {
    this.getData();
  },
  computed: {},

  methods: {
    toSecondStep() {
      this.$emit("toSecondStep", this.$refs.multipleTable.selection);
    },
    getData() {
      axios.get("http://10.128.205.253:8080/getTables").then((res) => {
        this.tableData = res.data;
        console.log(this.tableData);
      });
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
