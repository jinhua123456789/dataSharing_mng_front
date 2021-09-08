<template>
  <el-card>
    <!-- :body-style="{ padding: '0px' }" -->

    <!-- <div style="padding: 14px">    
    </div> -->
    <div>
      <el-table
        ref="multipleTable"
        :data="ptableData"
        stripe
        height="250"
        size="medium"
        style="width: 100%; margin-top: 30px"
        borde
        tooltip-effect="dark"
        @selection-change="getmessage()"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          :label="ptableName"
          prop="columnName"
          :key="index"
          align="center"
          width="120"
        >
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column
          prop="type"
          label="对应数据类型"
          width="120"
          align="center"
        >
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; margin-bottom: 10px">
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tdata: {
        tname: "",
        tcol: [],
      },
    };
  },
  props: ["ptableData", "ptableName", "index"],

  methods: {
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection();
    },

    getmessage() {
      this.tdata.tname = this.ptableName;
      this.tdata.tcol = this.$refs.multipleTable.selection;

      this.$emit("modifydata", this.tdata);
    },
  },
};
</script>
