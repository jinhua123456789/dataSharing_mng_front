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
          prop="value"
          :key="index"
          align="center"
          width="120"
        >
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
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

//两件事 第一件事 检查最后所有数据是否从子组件发送到父组件 即父组件是用append添加数据  第二件事 在最后点击下一步时 数据从子组件发送父组件