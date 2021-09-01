<template>
  <div class="container">
    <el-tabs>
      <el-tab-pane
        v-for="tabName in tabNameList"
        :key="tabName"
        :label="tabName"
      ></el-tab-pane>
    </el-tabs>
    <div class="demo-class">
      <el-image style="height: 100%; margin: 0 auto;" :src="url"></el-image>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'record',
  data() {
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',

      tabNameList: ['数据关系', '视图定制', '视图列表'],
      infoList: Array(3).fill([]),
    }
  },

  computed: {},
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
