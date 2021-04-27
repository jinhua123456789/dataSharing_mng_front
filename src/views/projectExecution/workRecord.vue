<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="用户名" style="width: 200px;" class="filter-item" v-model="searchValue" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchByName()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem()">新增</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="用户名" min-width="80px">
        <template slot-scope="{row}">
          <el-button type="text">{{row.userName }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日期" min-width="80px">
        <template slot-scope="{row}">{{toString(row.loginIn)}}</template>
      </el-table-column>
      <!-- <el-table-column align="center" label="登录时间" min-width="80px">
        <template slot-scope="{row}">{{row.loginInTime }}</template>
      </el-table-column>

      <el-table-column align="center" label="登出时间" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.loginOutTime }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="内容" min-width="200px">
        <template slot-scope="{row}">
          <span>{{row.things}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作 " align="center" width="200">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="primary" @click="getInFetchList(row.id)"
          >查看</el-button> -->
          <div v-if="userId===scope.row.userId">
            <el-button size="small" type="primary" @click="modifyItem(scope)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="currentPage + 1" v-if="totalElements" background :page-size="10" layout="prev, pager, next" :total="totalElements" @current-change="onPageChange">
    </el-pagination>

    <div>
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible">
        <el-form ref="dataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <!-- <el-form-item label="用户ID" prop="stationcode">
            <el-input v-model="newItem.userId" />
          </el-form-item> -->
          <!-- <el-form-item label="登录时间" prop="stationname">
            <el-input v-model="newItem.loginInTime" />
          </el-form-item>
          <el-form-item label="登出时间" prop="longitude">
            <el-input v-model="newItem.loginOutTime" />
          </el-form-item> -->
          <el-form-item label="日期" prop="stationname">
            <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" v-model="newItem.loginIn" style="width: 100%;"></el-date-picker>
          </el-form-item>

          <el-form-item label="内容" prop="altitude">
            <el-input type="textarea" rows="5" v-model="newItem.things" />
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
import { getInfo } from '@/api/user'
import { getAllWorkRecord, deleteWorkRecord, searchWorkRecord, addWorkRecord, modifyWorkRecord } from '@/api/projectExcution'

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
      searchValue: "",
      searchState: false,
      userId: ""
    }
  },
  created () {
    getInfo().then(res => {
      if (res.code === 200) {
        this.userId = res.data.userId
      }
    })
    this.getData()
  },
  methods: {
    onPageChange (page) {
      this.currentPage = page - 1
      this.getData()
    },
    getData () {
      if (this.searchState) {
        searchWorkRecord(this.searchValue, this.currentPage, 10).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.totalElements = res.data.totalElements
            // this.showData(res.data.content)
            this.fakeData = res.data.content
          }
        })
        return
      }
      getAllWorkRecord(this.currentPage, 10).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          // this.showData(res.data.content)
          this.fakeData = res.data.content
        }
        // if (data[i].loginOut) {
        //   data[i].loginOutTime = this.toString(data[i].loginOut)
        // }
        // this.fakeData.push(data[i])
      })
    },
    // showData (data) {
    //   this.fakeData = []
    //   for (let i = 0; i < data.length; ++i) {
    //     if (data[i].loginIn) {
    //       data[i].loginInTime = this.toString(data[i].loginIn)
    //     }
    //     if (data[i].loginOut) {
    //       data[i].loginOutTime = this.toString(data[i].loginOut)
    //     }
    //     this.fakeData.push(data[i])
    //   }
    //   // console.log(this.fakeData)
    // },
    onComfirm () {
      if (this.isModify) {
        // if (this.checkDate()) {
        modifyWorkRecord(this.newItem).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
            this.newItem = {}
            this.dialogProjectVisible = false
          }
        })
        // }
      } else {
        // if ((this.newItem.userId === undefined) || (this.newItem.userId === "")) {
        //   this.$message.error('用户ID不能为空！');
        // } else {
        // if (this.checkDate()) {
        // for (let key in this.defaultVal) {
        //   if (this.newItem[key] === undefined) {
        //     this.newItem[key] = this.defaultVal[key]
        //   }
        // }
        console.log(this.newItem, 'newItem')
        this.newItem.userId = this.userId
        addWorkRecord(this.newItem).then(res => {
          console.log(res)
          if (res.code === 200) {
            // this.newItem.id = res.data
            // this.fakeData.push(this.newItem)
            this.getData()
            this.newItem = {}
            this.dialogProjectVisible = false
          } else {
            this.newItem = tmp
            this.$message.error('站点编码已存在！');
          }
        })
        // }
        // }
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
        deleteWorkRecord(this.fakeData[scope.$index].id).then(res => {
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
      // console.log('scope', scope)
      this.isModify = true
      this.modifyIdx = scope.$index
      this.newItem = Object.assign({}, this.fakeData[scope.$index])
      this.dialogProjectVisible = true
      this.dialogTitle = "编辑"
    },
    searchByName () {
      this.currentPage = 0
      this.searchState = (!this.searchValue.length) ? false : true
      this.getData()
      // if (!this.searchValue.length) {
      //   this.$message.error('搜索内容不能为空！');
      //   return
      // }
      // searchWorkRecord(this.searchValue, 0, 10).then(res => {
      //   console.log(res)
      //   if (res.code === 200) {
      //     this.showData(res.data.content)
      //   }
      // })
    },
    toString (stamp) {
      if (!stamp) return ""
      var now = stamp
      if (!(stamp instanceof Date)) {
        now = new Date(stamp)
      }
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      // return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      return year + "-" + month + "-" + date
    },
    checkDate () {
      let loginInTime = this.newItem.loginInTime
      if (loginInTime === "" || loginInTime === undefined || loginInTime === null) {
        // this.newItem.loginIn = new Date()
        // console.log(this.newItem.loginIn)
      } else {
        if (isNaN(loginInTime)) {
          let tmp = Date.parse(loginInTime)
          if (isNaN(tmp)) {
            this.$message.error("登录时间格式错误！")
            return false
          } else {
            this.newItem.loginIn = new Date(tmp)
          }
        } else {
          this.$message.error("登录时间格式错误！")
          return false
        }
        this.newItem.loginInTime = this.toString(this.newItem.loginIn)
      }

      let loginOutTime = this.newItem.loginOutTime
      if (loginOutTime === "" || loginOutTime === undefined || loginOutTime === null) {
        // this.newItem.loginOut = new Date()
        // console.log(this.newItem.loginOut)
      } else {
        if (isNaN(loginOutTime)) {
          let tmp = Date.parse(loginOutTime)
          if (isNaN(tmp)) {
            this.$message.error("登出时间格式错误！")
            return false
          } else {
            this.newItem.loginOut = new Date(tmp)
            // this.newItem.loginOut = tmp / 1000
          }
        } else {
          this.$message.error("登出时间格式错误！")
          return false
        }
        this.newItem.loginOutTime = this.toString(this.newItem.loginOut)
      }
      return true
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
