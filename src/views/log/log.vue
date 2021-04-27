<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="user" style="width: 200px;" placeholder="用户名" ></el-input>
      <el-input v-model="ip" style="width: 200px;" placeholder="ip"></el-input>
        <el-date-picker
          v-model="startTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          style="width: 200px;"
          placeholder="开始日期">
        </el-date-picker>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm:ss"
        style="width: 200px;"
        placeholder="结束日期">
      </el-date-picker>

      <el-input v-model="module" style="width: 200px;" placeholder="所属模块"></el-input>
      <el-button v-waves
                 class="filter-item"
                 type="primary"
                 icon="el-icon-search"
                 @click="search">
          查询
      </el-button>
    </div>
    <el-table
      :data="list"
      border
      style="width: 100%">
      <el-table-column
        prop="user"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="action"
        label="行为">
      </el-table-column>
      <el-table-column
        prop="module"
        label="所属模块">
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />


  </div>
</template>

<script>
  import { fetchList } from '@/api/log'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import Vue from 'vue'

  export default {
    components: { Pagination },
    methods: {
      search(){
        this.getList()
      },

      getList() {
        this.listLoading = true
        fetchList(this.listQuery.page-1,this.listQuery.limit,
          this.user,this.ip,this.startTime,this.endTime,this.module).then(response => {
          console.log(this.user)
          this.list = response.data.content
          this.total = response.data.totalElements
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 100)
        })
      }
    },
    created() {
      this.listQuery.page = 1
      this.getList()
    },
    data() {
      return {
        user:null,
        ip:null,
        startTime:null,
        endTime:null,
        module:null,
        tableData: [],
        tableKey: 0,
        list: null,
        total: 20,
        listLoading: true,
        listQuery: {
          page: 0,
          limit: 10,
        },
      }
    }
  }
</script>
