<template>
  <el-container>
    <el-row :gutter="40">
      <el-col :span="8" v-for="(item, index) in tablesFrom1">
        <dynamiccard
          :ptableData="item.columns"
          :ptableName="item.tableName"
          :key="index"
          @modifydata="commitData"
        ></dynamiccard>
      </el-col>
    </el-row>

    <el-footer>
      <el-button
        @click="handleFrom2To3()"
        style="margin-top: 10px;"
      >
        下一步
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import dynamiccard from './dynamicCard'

export default {
  data() {
    return {
      tablesFrom2: [],
      multipleSelection: [],
    }
  },
  props: [
    'tablesFrom1',
  ],
  components: {
    dynamiccard,
  },
  created() {

  },
  methods: {
    commitData(d) {      
      let exist = false;
      let toBeDeleted = false;
      if (this.tablesFrom2.length > 0) {
        let deleteIndex = -1;
        for (let i = 0; i < this.tablesFrom2.length; ++i) {
          if (d.name == this.tablesFrom2[i].name) {
            if (d.columns.length == 0) {
              toBeDeleted = true;
              deleteIndex = i;
            } else {
              //替换
              this.tablesFrom2[i] = d
            }
            exist = true;
            break;
          }
        }
        if (!exist) {
          // 加入
          this.tablesFrom2.push(d);
        } else if (toBeDeleted) {
          // 删除
          this.tablesFrom2.splice(deleteIndex, 1);
        }
      } else {
        // 加入
        this.tablesFrom2.push(d)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFrom2To3() {
      if (this.tablesFrom2.length == 0) {
        window.alert('请至少选择一张表')
        return;
      }
      this.$emit('from2To3', this.tablesFrom2)
      this.iscreateview = false
      this.iscreateview3 = true
    },
  },
}
</script>

<style scoped>
.el-main {
  display: block;
  flex-basis: auto;
  overflow: hidden;
  padding: 0 20px;
}
</style>
