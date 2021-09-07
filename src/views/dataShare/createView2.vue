<template>
  <div>
    <el-container>
      <el-main>
        <el-input placeholder="请输入视图名" v-model="input1">
          <template slot="prepend">新创建的视图名</template>
        </el-input>
        <span v-for="(n, index) in this.tablecountinfor" :key="n">
          <el-row>
            {{ n }}: {{ index }}
            <div class="block">
              <span class="demonstration">请选择数据列</span>
              <el-cascader
                :options="options"
                ref="myCascader"
                clearable
                style="width: 300px;"
                @change="updatecascader(index, item)"
              ></el-cascader>

              <span class="demonstration">与数据列</span>
              <el-cascader
                :options="secondoptions"
                clearable
                ref="='mySecondCascader"
                style="width: 300px;"
                @change="updatesecondcascader"
              ></el-cascader>
              <span>链接</span>
            </div>
          </el-row>
        </span>
        <el-button @click="toThirdStep()">下一步</el-button>
        <el-button @click="backToFirstStep()">上一步</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Col } from 'element-ui'
export default {
  data() {
    return {
      input1: '',
      tablecount: 0,
      tablecountinfor: 0,
      screenWidth: '1',
      options: [],
      secondoptions: [],
      firsttype: '',

      conditions: [
        { leftTable: '', leftColumn: '', rightTable: '', rightColunm: '' },
      ],
    }
  },
  props: ['tData'],
  components: {},

  methods: {
    backToFirstStep() {
      this.$emit('backToFirstStep', 2)
    },
    toThirdStep() {
      console.log(this.tData)
      console.log(this.input1)
      if (this.input1 == '') {
        alert('视图名称不能为空')
      }
      console.log(this.conditions)
    },

    gettdata() {
      this.tData.forEach((element) => {
        let opchildren = []
        opchildren = element.tcol
        opchildren.forEach((col) => {
          col.label = col.value
          // col.label = col.columnname        //如果 数据 名改为 columnname 则使用这条代码
        })
        let option = {
          value: element.tname,
          label: element.tname,
          disabled: false,
          children: opchildren,
        }
        this.options.push(option)

        this.secondoptions.push(JSON.parse(JSON.stringify(option)))
        this.tablecount++
        console.log('op', option)
      })
    },

    updatecascader(index, item) {
      let node = this.$refs['myCascader'].current //labels
      console.log('this is index: ', index)
      console.log(index)
      console.log(item[0]) //用于填数据结构
      console.log(item[1]) //用于填数据结构
      this.conditions[n].leftTable = item[0]
      this.conditions[n].leftColumn = item[1]

      this.secondoptions.forEach((secop) => {
        if (secop.value == item[0]) {
          secop.disabled = true

          secop.children.forEach((child) => {
            if (child.label == item[1]) {
              this.firsttype = child.type
              console.log(child.type)
            }
          })
        } else if (secop.value != item[0]) {
          secop.disabled = false
          secop.children.forEach((child) => {
            console.log(this.firsttype, child.type)
            if (child.type == this.firsttype) {
              child.disabled = false
            } else {
              child.disabled = true
            }
          })
        }
      })
    },

    updatesecondcascader(item, n) {
      console.log(item[0]) //用于填数据结构
      console.log(item[1]) //用于填数据结构
      this.conditions[n].rightTable = item[0]
      this.conditions[n].rightColunm = item[1]
    },
  },

  created() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    this.gettdata()
    this.tablecountinfor = this.tablecount - 1
    console.log('infor', this.tablecountinfor)
    console.log('tablecount', this.tablecount)
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
.el-row {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
