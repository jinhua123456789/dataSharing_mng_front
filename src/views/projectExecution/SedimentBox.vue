<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="泥沙盒编号" style="width: 200px;" class="filter-item" v-model="searchValue" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchByName()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem()">新增</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="泥沙盒编号" min-width="80px">
        <template slot-scope="{row}">
          <el-button type="text">{{row.sedimentBoxId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="泥沙盒重量(g)" min-width="80px">
        <template slot-scope="{row}">{{row.boxWeight }}</template>
      </el-table-column>

      <el-table-column align="center" label="所属年份" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.year }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作 " align="center" width="200">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="primary" @click="getInFetchList(row.id)"
          >查看</el-button> -->
          <el-button size="small" type="primary" @click="modifyItem(scope)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="currentPage + 1" v-if="totalElements" background :page-size="10" layout="prev, pager, next" :total="totalElements" @current-change="onPageChange">
    </el-pagination>

    <div>
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible">
        <el-form ref="dataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="泥沙盒编号" prop="stationcode" v-if="isModify">
            <el-input v-model="newItem.sedimentBoxId" disabled/>
          </el-form-item>
          <el-form-item label="泥沙盒编号" prop="stationcode" v-else>
            <el-input v-model="newItem.sedimentBoxId" />
          </el-form-item>

          <el-form-item label="泥沙盒重量(g)" prop="stationname">
            <el-input v-model="newItem.boxWeight" />
          </el-form-item>
          <el-form-item label="所属年份" prop="longitude">
            <el-input v-model="newItem.year" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onComfirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getAllSedimentBox, deleteSedimentBox, searchSedimentBox, addSedimentBox, modifySedimentBox } from '@/api/projectExcution'

export default {
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      totalElements: 0,
      currentPage: 0,
      tableKey: 0,
      newItem: {},
      details: "",
      fakeData: [],
      // dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      defaultVal: {
        altitude: 0,
        loginIn: "",
        loginOut: "",
        things: ""
      },
      searchValue: ""
    }
  },
  created () {
    this.getData()
  },
  methods: {
    onPageChange (page) {
      this.currentPage = page - 1
      this.getData()
    },
    getData () {
      getAllSedimentBox(this.currentPage, 10).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      })
    },
    onComfirm () {
      if (this.isModify) {
        modifySedimentBox(this.newItem).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
            this.dialogProjectVisible = false
          }
        })
      } else {
        if ((this.newItem.sedimentBoxId === undefined) || (this.newItem.sedimentBoxId === "")) {
          this.$message.error('泥沙盒编号不能为空！');
        } else {
          let tmp = Object.assign({}, this.newItem)
          console.log(this.newItem, 'newItem')
          addSedimentBox(this.newItem).then(res => {
            console.log(res)
            if (res.code === 200) {
              // this.newItem.id = res.data
              // this.fakeData.push(this.newItem)
              this.getData()
              this.dialogProjectVisible = false
            } else {
              this.newItem = tmp
              this.$message.error('泥沙盒编号已存在！');
            }
          })
        }
      }
    },
    addNewItem () {
      this.newItem = {}
      this.isModify = false;
      this.dialogProjectVisible = true
      this.dialogTitle = "新增"
    },
    deleteItem (scope) {
      this.$confirm('您确定要删除这条数据吗？')
      .then(_ => {
        deleteSedimentBox(this.fakeData[scope.$index].id).then(res => {
          if (res.code === 200) {
            // this.fakeData.splice(scope.$index, 1)
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      .catch(_ => {})
    },
    modifyItem (scope) {
      this.isModify = true
      this.modifyIdx = scope.$index
      this.newItem = Object.assign({}, this.fakeData[scope.$index])
      this.dialogProjectVisible = true
      this.dialogTitle = "编辑"
    },
    searchByName () {
      if (!this.searchValue.length) {
        // this.$message.error('搜索内容不能为空！');
        this.currentPage = 0
        this.getData()
        return
      }
      searchSedimentBox(this.searchValue, 0, 10).then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.data) {
            this.fakeData = [res.data]
            this.totalElements = 1
          } else {
            this.fakeData = []
            this.totalElements = 0
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
