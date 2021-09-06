<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <sp>选择数据表</sp>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-row>

        <!-- 循环加载可添加数据表项 -->
        <!-- <el-container>
      <el-row
        v-for="item in editableTables"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <p>选择数据表</p>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          type="delete"
          icon="el-icon-close"
          circle
          @click="removeTable(editableTablesValue)"
        ></el-button>
      </el-row>
    </el-container> -->

        <el-row v-for="item in editableTables" :key="item.index">
          <sp>选择数据表</sp>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 删除选择框 -->
          <el-button
            type="delete"
            icon="el-icon-close"
            circle
            @click="removeTable(editableTablesValue)"
          ></el-button>
        </el-row>
        <el-button type="primary" @click="addTab(editableTablesValue)">
          添加数据表
        </el-button>
        <el-checkbox v-model="checked" @editcheckbox="editcheckbox">
          备选项
        </el-checkbox>

        <el-card class="box-card">
          <div slot="header">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0;" type="text">
              操作按钮
            </el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>

        <el-button @click="toSecondStep()">
          下一步
        </el-button>
        <p>{{ viewRule }}</p>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Table } from 'element-ui'
import { iscreateview } from './dataPermission'

import { iscreateview2 } from './dataPermission'
export default {
  data() {
    return {
      checked: true,
      editableTablesValue: '0',
      editableTables: [
        // {
        //   index: 1,
        // },
      ],
      tableIndex: 0,
    }
  },
  components: {},
  props: {
    iscreateview: Boolean,
    iscreateview2: Boolean,
    viewRule: Object,
  },

  methods: {
    editcheckbox(tablename) {
      this.$emit('addtablename', 'tablename1')
    },
    toSecondStep() {
      this.$emit('toSecondStep', 2)
      // iscreateview = false
      // iscreateview2 = true
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
