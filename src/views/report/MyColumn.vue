<template>
  <div v-if="!col.children">
    <el-table-column :label="col.label" :width="col.width" :show-overflow-tooltip="true">
      <template slot-scope="scope">{{formatProp(scope.row,col)}}</template>
    </el-table-column>
  </div>
  <div v-else>
    <el-table-column :label="col.label" :width="col.width">
      <my-column v-for="(item, index) in col.children"
                 :key="index"
                 :col="item"></my-column>
    </el-table-column>
  </div>
</template>


<script>
  export default {
    name: "MyColumn",
    props: {
      col: {
        type: Object
      }
    },
    methods: {
      formatProp(row, item) {
        const propString = item.prop
        const type = item.type
        let result = "", str1 = "", str2 = ""
        if (propString && propString.indexOf('.') != -1) {
          str1 = propString.split('.')[0]
          str2 = propString.split('.')[1]
          if (row[str1] && row[str1].hasOwnProperty(str2)) {
            result = row[str1][str2]
          }
        } else if (propString && propString.indexOf('/') != -1) {
          str1 = propString.split('/')[0]
          str2 = propString.split('/')[1]
          if (row[str2]!=0) {
            result = (row[str1] /  row[str2] * 60).toFixed(2)
          } else {
            result = ""
          }
        }else if (propString && propString.indexOf('*') != -1) {
          str1 = propString.split('*')[0]
          str2 = propString.split('*')[1]
          result = row[str1] + 'x' + row[str2]
        } else {
          result = row[propString]
        }


        if (!result && result != 0) return ""
        if (type === 'date') {
          result = this.formatDate(result)
        } else if (type === 'year') {
          result = new Date(result).getFullYear()
        } else if (type === 'month') {
          result = new Date(result).getMonth() + 1
        } else if (type === 'day') {
          result = new Date(result).getDate()
        } else if (type === 'dateTime') {
          result = this.formatDate(result) + '  ' + this.formatTime(result)
        } else if (type === 'monthDay') {
          result = this.formatMonthDay(result)
        } else if (type === 'substr' && result && result.indexOf(' ') != -1) {
          result = result.split(' ')[0]
        } else if (type === 'ms') {
          result = parseInt((result * 1) / 60 / 1000)
        } else if (type === 'num1') { //保留一位小数
          result = (result * 1).toFixed(1)
        } else if (type === 'num2') { //百分比
          result = (result * 100) + '%'
        }

        return result
      },
      formatDate(time) {
        const date = new Date(time)
        const year = date.getFullYear()
        const month = date.getMonth()+1
        const day = date.getDate()
        return [year, month, day].map(this.formatNumber).join('-')
      },
      formatTime(time) {
        const date = new Date(time)
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return [hour, minute, second].map(this.formatNumber).join(':')
      },
      formatMonthDay(time) {
        const date = new Date(time)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        return [month, day].map(this.formatNumber).join('-') + '  ' + [hour, minute].map(this.formatNumber).join(':')
      },
      formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      },
    }
  }
</script>

<style scoped>

</style>
