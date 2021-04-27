<template>
  <div>
    <el-table :data="tableDataBody" :loading="loading">
      <my-column v-for="(item,index) in tableHeader" :key="index" :col="item"/>
    </el-table>
    <el-pagination
      background
      v-if="isPagination"
      :page-size="tablePageSize"
      :total="tableCount"
      @current-change="(e)=>page_change(e,index)"

    />
  </div>

</template>

<script>
  import MyColumn from './MyColumn'

  export default {
    components: {
      MyColumn
    },
    name: "reportTable",
    props: {
      index: {
        type: Number,
        default: 0
      },
      tableDataBody: {
        type: Array,
        default: function () {
          return []
        }
      },
      tableHeader: {
        type: Array,
        default: function () {
          return [{label: '', prop: '', children: null}]
        }
      },
      tablePageSize: {
        type: Number,
        default: 10
      },
      tableCount: {
        type: Number,
        default: 0
      },
      isPagination: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: true
      },
    },
    methods: {
      page_change(e, index) {
        this.$emit('page_change', {e, index})
      }
    }
    , mounted() {
      // console.log(this.tableDataBody)
    }
  }
</script>

<style scoped>

</style>
