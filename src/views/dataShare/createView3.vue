<template>
  <div>
    <el-row>
      请选择外键
    </el-row>
    <el-row>
      <div class="block">
        <span class="demonstration">单选选择任意一级选项</span>
        <el-cascader
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
        ></el-cascader>
      </div>
      <div class="block">
        <span class="demonstration">单选选择任意一级选项</span>
        <el-cascader
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
        ></el-cascader>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data: {
    tablecount: 2,
  },
}
</script>

<style></style>
