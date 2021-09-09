<template>
  <div class="container">
    <el-tabs>
      <el-tabs v-model="currentTab">
        <el-tab-pane label="数据关系" name="first">
          <erDiagram></erDiagram>
        </el-tab-pane>
        <el-tab-pane label="视图定制" name="second">
          <create-view-1
            v-if="isCreateView1"
            @from1To2="handleFrom1To2"
          ></create-view-1>

          <create-view-2
            v-if="isCreateView2"
            :tablesFrom1="tablesFrom1"
            @from2To3="handleFrom2To3"
          ></create-view-2>

          <create-view-3
            v-if="isCreateView3"
            :tablesFrom2="tablesFrom2"
            @createSuccess="handleCreateSuccess"
          ></create-view-3>

        </el-tab-pane>
        <el-tab-pane label="视图列表" name="third">
          <!-- <ViewList v-if="isViewList"></ViewList> -->
          <el-button @click="handleSubmit()" type="primary" :disabled="!canSubmit">提交修改</el-button>
          <el-table
            :data="viewTable"
            class="list_wrap"
            border
            style="width: 100%; margin-left: 0px; margin-top: 1%;"
            :row-style="{ height: '50px' }"
            alt=""
          >
            <el-table-column
              label='No.'
              type="index"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="viewName"
              label="视图名称"
              min-width="3"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建日期"
              min-width="3"
            ></el-table-column>
            <el-table-column 
              label="权限" 
              min-width="2">
              <template slot-scope="scope">
                <el-switch
                  v-model="viewTable[scope.$index].open"
                  @change="handleOpenChange($event, scope.row)"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="2">
              <template slot-scope="scope">
                <el-button
                  @click="handleClickDetail(scope.row)"
                  type="text"
                  size="small"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
  </div>
</template>

<script>
import createView1 from './createView1'
import createView2 from './createView2'
import createView3 from './createView3'
import erDiagram from './erDiagram.vue'

export default {
  name: 'dataPermission',
  components: {
    createView1,
    createView2,
    createView3,
    erDiagram
  },
  data() {
    return {
      tablesFrom1:[],
      tablesFrom2:[],
      isCreateView1: true,
      isCreateView2: false,
      isCreateView3: false,

      // height: 1000,
      canSubmit: false,
      viewTable: [],
      changes: {}, // 记录各个视图的开放权限改变
      currentTab: 'first',
    }
  },
  created() {
    
  },
  mounted() {

    // 获取所有视图，供功能点3使用
    this.$axios
    .get('http://localhost:8080/getAllViews')
    .then((respond) => {
      respond.data.forEach(view => {
        // console.log("view: ", view);
        this.viewTable.push({
          createTime: view.createTime,
          viewName: view.name,
          open: view.visible == 1 ? true : false,
        })
      });
    });
  },
  methods: {
    handleFrom1To2(t) {
      this.tablesFrom1 = t;
      this.isCreateView1 = false
      this.isCreateView2 = true
      this.isCreateView3 = false;
    },
    handleFrom2To3(t) {
      this.tablesFrom2 = t
      this.isCreateView1 = false
      this.isCreateView2 = false;
      this.isCreateView3 = true
    },
    handleClickDetail(row) {
      //用于查看视图详情

      console.log(row);

      const routeUrl = this.$router.resolve({
        name: 'erDiagram',
        query: { 
          'isOneView': true,
          'viewName': row.viewName,
        },
      });
      // console.log(routeUrl.href)
      window.open(routeUrl.href);
      // console.log('组成表以及关系')
    },
    handleSubmit() {
      let request = [];
      Object.keys(this.changes).forEach(key => {
        request.push({
          'name': key,
          'visible': this.changes[key].visible ? 1 : 0,
          'createTime': this.changes[key].createTime,
        });
      });
      console.log(request)
      this.$axios.post('http://localhost:8080/setViews', request)
      .then((response) => {
        console.log(response.data)
      })
      this.canSubmit = false;
    },
    handleOpenChange($event, row) {
      console.log("row: ", row);
      this.changes[row.viewName] = {
        'visible': $event,
        'createTime': row.createTime,
      };
      this.canSubmit = true;
      console.log(this.changes);
    },
    handleCreateSuccess() {
      // 刷新当前页面
      this.$router.go(0);
      // 跳转到【视图列表】页
      this.currentTab = 'third'
    },
    indexMethod(index) {
      return index + 1;
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
</style>
