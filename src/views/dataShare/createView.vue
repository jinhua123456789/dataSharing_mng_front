<template>
  <el-container>
    <el-row :gutter="40">
      <el-col :span="8" v-for="(item, index) in tableData">
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
        type="primary"
        round
        @click="toSecondStep()"
        style="margin-top: 10px;"
      >
        下一步
      </el-button>
      <el-button
        type="primary"
        round
        @click="savedata"
        style="margin-top: 10px;"
      >
        保存数据
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
// import { createAction } from "@antv/g2/lib/interaction/action";
import axios from 'axios'
import { Loading } from 'element-ui'
import dynamiccard from './dynamicCard'

export default {
  data() {
    return {
      tData: [],

      tableData: [
        {
          tableName: '降雨量表',
          columns: [
            {
              value: '2016-05-03',
              type: 'int',
            },
            {
              value: '2016-05-02',
              type: 'int',
            },
            {
              value: '2016-05-15',
              type: 'int',
            },
            {
              value: '2016-05-26',
              type: 'int',
            },
          ],
        },
        {
          tableName: '地址表',
          columns: [
            {
              value: '2016-05-03',
              type: 'int',
            },
            {
              value: '2016-05-02',
              type: 'int',
            },
          ],
        },
        {
          tableName: '流动人口表',
          columns: [
            {
              value: '2016-05-03',
              type: 'int',
            },
            {
              value: '2016-05-02',
              type: 'int',
            },
            {
              value: '2016-05-15',
              type: 'int',
            },
            {
              value: '2016-05-26',
              type: 'int',
            },
            {
              value: '2016-05-15',
              type: 'int',
            },
            {
              value: '2016-05-26',
              type: 'int',
            },
            {
              value: '2016-05-15',
              type: 'int',
            },
            {
              value: '2016-05-26',
              type: 'int',
            },
          ],
        },
        {
          tableName: '调查表',
          columns: [
            {
              value: '2016-05-03',
              type: 'int',
            },
            {
              value: '2016-05-02',
              type: 'int',
            },
            {
              value: '2016-05-15',
              type: 'int',
            },
          ],
        },
      ],
      multipleSelection: [],
    }
  },

  components: {
    dynamiccard,
  },
  created() {},
  computed: {},

  methods: {
    // getDownloadHistory() {
    //   axios.get("http://10.112.64.74:8765/globalHistory").then((res) => {
    //     this.tableData = res.data;
    //   });
    // },
    commitData(d) {
      let k = -1
      let i = this.tData.length
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          if (d.tname == this.tData[j].tname) {
            //已提交过表项 此时进行修改
            this.tData[j] = d
            k = 1
            //修改后 直接退出循环
            break
          }
        }
        //未有重复的表名 说明添加新表项 进行push
        if (k == -1) {
          this.tData.push(d)
        }
      } else {
        //添加第一个表项
        this.tData.push(d)
      }

      //  console.log(tdata.tname);
    },

    // toloading() {
    //   this.$router.push({ path: "/viewShow" });
    // },

    savedata() {},

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toSecondStep() {
      this.$emit('toSecondStep', 2, this.tData)
      // iscreateview = false
      // iscreateview2 = true
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
