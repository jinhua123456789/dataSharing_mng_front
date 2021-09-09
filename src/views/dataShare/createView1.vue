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
      </el-table-column>
    </el-table>

    <el-footer>
      <el-button
        type="primary"
        round
        @click="from1To2()"
        style="margin-top: 10px"
        >下一步
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      tableData: [],
    };
  },
  created() {
    this.$axios.get("http://10.112.64.74:8765/getTables").then((res) => {
      this.tableData = res.data;
    });
  },
  methods: {
    from1To2() {
      this.$emit("from1To2", this.$refs.multipleTable.selection);
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