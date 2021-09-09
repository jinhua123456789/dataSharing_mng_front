<template>
  <el-row>
    <el-col :span="8">
      <el-table
        :data="ptableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%; margin-top: 30px"
        border
      >
        <el-table-column
          :label="ptableName"
          prop="columnName"
          :key="index"
          align="center"
        >
        </el-table-column>
        <el-table-column label="权限" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              active-text="开放权限"
              inactive-text="关闭权限"
              :active-value="1"
              :inactive-value="0"
              @change="changeStatus($event, scope.$index, ptableName)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div align="center">
        <el-button @click="allSelect">全部开放权限</el-button>
        <el-button @click="noneSelect">全部取消权限</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tdata: {},

      selectdata: [],
    };
  },
  props: ["ptableData", "ptableName"],

  methods: {
    // handleSelectionChange(selection) {
    //   this.selectdata = selection.map((item) => item.name);
    //   this.$emit("modifydata", this.selectdata);
    // },
    changeStatus($event, index, table_name) {
      this.tdata.tablename = table_name;
      this.tdata.tindex = index;
      this.tdata.available = $event;

      // console.log($event);
      // console.log(index);
      // console.log(table_name);
      this.$emit("modifydata", this.tdata);
    },
    allSelect() {
      for (let i = 0; i < this.ptableData.length; i++) {
        this.ptableData[i].available = 1;
      }
    },
    noneSelect() {
      for (let i = 0; i < this.ptableData.length; i++) {
        this.ptableData[i].available = 0;
      }
    },
  },
};
</script>
