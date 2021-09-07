<template>
  <div>
    <el-container>
      <el-main>
        <el-input placeholder="请输入视图名" v-model="input1">
          <template slot="prepend">新创建的视图名</template>
        </el-input>
        <span v-for="n in this.tablecountinfor" :key="n">
          <el-row>
            <div class="block">
              <span class="demonstration">请选择数据列</span>
              <el-cascader
                :options="options"
                ref="myCascader"
                clearable
                style="width: 300px"
                @change="updatecascader"
              ></el-cascader>

              <span class="demonstration">与数据列</span>
              <el-cascader
                :options="secondoptions"
                clearable
                style="width: 300px"
              ></el-cascader>
              <span>链接</span>
            </div>
          </el-row>
        </span>
        <el-button @click="toThirdStep()"> 下一步 </el-button>
        <el-button @click="backToFirstStep()"> 上一步 </el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {

      input1: '',
      tablecount: 3,
      tablecountinfor: 0,
      screenWidth: "1",
      options: [
        {
          value: "表",
          label: "资源",

          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
            {
              value: "sketch",
              label: "Sketch Templates",
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
        {
          value: "ziyuan11",
          label: "资源11",
          disabled: false,
          children: [
            {
              value: "axure11",
              label: "Axure Components11",
            },
            {
              value: "sketch11",
              label: "Sketch Templates11",
            },
            {
              value: "jiaohu11",
              label: "组件交互文档11",
            },
          ],
        },
      ],
      secondoptions: [
        {
          value: "表",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
            {
              value: "sketch",
              label: "Sketch Templates",
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
        {
          value: "ziyuan11",
          label: "资源11",
          children: [
            {
              value: "axure11",
              label: "Axure Components11",
            },
            {
              value: "sketch11",
              label: "Sketch Templates11",
            },
            {
              value: "jiaohu11",
              label: "组件交互文档11",
            },
          ],
        },
      ],
    };
  },
  props: ["tData"],
  components: {},

  methods: {
    backToFirstStep() {
      this.$emit("backToFirstStep", 2);
    },
    toThirdStep() {
      console.log(this.tData);
      console.log(this.input1);
    },

    updatecascader(item) {
      // console.log(this.$refs.myCascader.getCheckedNodes()[0].pathLabels)
      let node = this.$refs["myCascader"].currentLabels;
      console.log(item, this.$refs["myCascader"][0]);
      // console.log(item, node) //大舒服了
      // for (var i in this.secondoptions) {
      //   if (i.label == node[0]) {
      //     i.disabled = true
      //   }
      // }
    },
  },
  created() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };

    this.tablecountinfor = this.tablecount - 1;
  },
};
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
.el-row {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
