<template>
  <div class="container">
    <el-tabs>
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="数据关系"
          name="first"
        >
          <div class="demo-class">
            <el-image
              style="height: 100%; margin: 0 auto;"
              :src="url"
            />
          </div>
          <!-- <DataRelationship v-if="isDataRelationship"></DataRelationship> -->
        </el-tab-pane>
        <el-tab-pane
          label="视图定制"
          name="second"
        >
          <!-- <CreateView v-if="isCreateView"></CreateView> -->

          <create-view
            v-if="iscreateview"
            :data="iscreateview"
            :data2="iscreateview2"
            :view-rule="viewRule"
            @toSecondStep="toSecondStep"
            @addtablename="addtablename"
          />

          <create-view-2
            v-if="iscreateview2"
            ref="childcom"
            :data="iscreateview"
            :data2="iscreateview2"
            :view-rule="viewRule"
            @backToFirstStep="backToFirstStep"
          />
        </el-tab-pane>
        <el-tab-pane
          label="视图列表"
          name="third "
        >
          <!-- <ViewList v-if="isViewList"></ViewList> -->
          <el-table
            :data="viewTable"
            class="list_wrap"
            border
            style="width: 100%; margin-left: 0px; margin-top: 1%;"
            :row-style="{ height: '50px' }"
            alt=""
          >
            <el-table-column
              prop="viewName"
              label="视图名称"
              min-width="3"
            />
            <el-table-column
              prop="createTime"
              label="创建日期"
              min-width="3"
            />
            <el-table-column
              prop="permission"
              label="权限"
              min-width="2"
            >
              <el-switch
                v-model="switchValue"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="2"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="handleClickDetail(scope.row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tabs>
    <!-- <div class="demo-class">
      <el-image style="height: 100%; margin: 0 auto;" :src="url"></el-image>
    </div> -->
  </div>
</template>

<script>
import createView from './createView'
import createView2 from './createView2'

export default {
  name: 'DataPermission',
  components: {
    createView,
    createView2,
  },
  data() {
    return {
      childcomwidth: '',

      viewRule: {
        name: '',
        tables: [],
        colunms: [
          {
            table: 'table1',
            column: ['column1'],
            name: 'columnname',
          },
        ],
        conditions: [
          {
            leftTable: 'string',
            leftColumn: 'string',
            rightTable: 'string',
            rightColumn: 'string',
          },
        ],
      },

      iscreateview: true,
      iscreateview2: false,

      // height: 1000,
      switchValue: true,
      viewTable: [
        //需要确定 视图列表展示数据项，以及获得数据视图列表的数据格式
        {
          date: '2016-05-03',
          viewName: 'exsl1',
        },
      ],

      activeName: 'first',
      isDataRelationship: true,
      isCreateView: false,
      isViewList: false,
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    }
  },
  computed: {},
  created() {
    this.childcomwidth = this.$refs.childcom
    // this.height = this.tableData.length * 50 + 50 + 'px'
  },
  methods: {
    addtablename(tablename) {
      this.viewRule.name = tablename
    },

    backToFirstStep() {
      this.iscreateview = true
      this.iscreateview2 = false
    },
    toSecondStep(params) {
      this.iscreateview = false
      this.iscreateview2 = true
    },
    getPictureUrl() {
      if (this.isDataRelationship) {
        //获取图片url待完善，包括确定向后端传递参数，确定后端生成url的方式以及链接，服务器地址
        this.$axios
          .get('http://www.baidu.com', {
            params: {
              userId: this.userId,
            },
          })
          .then((respond) => {
            this.url = respond.url
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    handleClickDetail(row) {
      //用于查看视图详情

      console.log('组成表以及关系')
    },
    handleClick(tab) {
      console.log(tab)
      if (tab.name === 'first') {
        this.isDataRelationship = true
        this.isCreateView = false
        this.isViewList = false
      } else if (tab.name === 'second') {
        this.isDataRelationship = false
        this.isCreateView = true
        this.isViewList = false
      } else if (tab.name === 'third') {
        this.isDataRelationship = false
        this.isCreateView = false
        this.isViewList = true
      }
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
