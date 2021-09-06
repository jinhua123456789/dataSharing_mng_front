<template>
  <div>
    <el-container>
      <el-main>
        <el-button
          type="primary"
          @click="addTab(editableTablesValue)"
        >
          添加数据表
        </el-button>

        <el-card class="box-card">
          <div slot="header">
            <span>第二步 this is</span>
            <el-button
              style="float: right; padding: 3px 0;"
              type="text"
            >
              操作按钮
            </el-button>
          </div>
          <div
            v-for="o in 4"
            :key="o"
            class="text item"
          >
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
        <el-button @click="toThirdStep()">
          下一步
        </el-button>
        <el-button @click="backToFirstStep()">
          上一步
        </el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      editableTablesValue: '0',
      editableTables: [
        // {
        //   index: 1,
        // },
      ],
      tableIndex: 0,
    }
  },

  methods: {
    backToFirstStep() {
      this.$emit('backToFirstStep', 2)
    },
    addTab(editableTables) {
      this.editableTables.push({
        index: this.tableIndex,
      })
      this.tableIndex++
      console.log(this.tableIndex)
    },
  },
}
</script>

<style scoped>
.container {
  padding: 20px;
}

li {
  margin: 10px;
  padding: 10px;
}
.download-text {
  font-size: 12px;
}

.download-name {
  font-size: 14px;
  color: dodgerblue;
}
.el-row {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
