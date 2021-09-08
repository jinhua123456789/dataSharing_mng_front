<template>
  <div>
    <el-container>
      <el-main>
        <el-input placeholder="请输入视图名" v-model="input1">
          <template slot="prepend">新创建的视图名</template>
        </el-input>
        <span v-for="index in this.tablecountinfor" :key="index">
          <el-row>
            <div class="block">
              <span class="demonstration">请选择数据列</span>
              <el-cascader
                :options="options"
                ref="myCascader"
                clearable
                style="width: 300px;"
                @change="updatecascader(index, $event)"
              ></el-cascader>

              <span class="demonstration">与数据列</span>
              <el-cascader
                :options="secondoptions"
                clearable
                ref="='mySecondCascader"
                style="width: 300px;"
                @change="updatesecondcascader(index, $event)"
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
export default {
  data() {
    return {
      count: 0,
      input1: '',
      tablecount: 0,
      tablecountinfor: 0,
      screenWidth: '1',
      options: [],
      secondoptions: [],
      firsttype: '',
      tablestopost: [],
      columnstopost: [
        {
          table: '',
          column: '',
          name: '',
        },
      ],
      conditions: [
        // { leftTable: '', leftColumn: '', rightTable: '', rightColunm: '' },
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
      console.log('tdata', this.tData)
      console.log('options', this.options)
      if (this.input1 == '') {
        alert('视图名称不能为空')
      } else {
        this.$axios
          .get('http://10.112.64.74:8765/history', {
            params: {
              name: this.input1,
              tables: [],
              conditions: this.conditions,
            },
          })
          .then((respond) => {
            // this.tableData = respond.data;
          })
          .catch(function (err) {
            console.log(err)
          })
      }
      console.log(this.conditions)
    },

    gettdata() {
      this.tData.forEach((element) => {
        this.tablecount++
        this.tablestopost.push(element.tname)
        console.log('tablestopost', this.tablestopost)

        let opchildren = []
        opchildren = element.tcol
        opchildren.forEach((col) => {
          // this.count++
          // this.columnstopost[this.count].table = element.name
          // this.columnstopost[this.count].column = element.column
          // this.columnstopost[this.count].name = element.name + '_' + element.column
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

        for (let index = 0; index < this.tablecountinfor; index++) {
          // this.conditions[index].leftTable = ''
          // this.conditions[index].leftColumn = ''
          // this.conditions[index].rightTable = ''
          // this.conditions[index].rightColunm = ''
          // this.conditions.push({
          //   leftTable: '',
          //   leftColumn: '',
          //   rightTable: '',
          //   rightColunm: '',
          // })
          this.conditions.push(
            JSON.parse(
              JSON.stringify({
                leftTable: '',
                leftColumn: '',
                rightTable: '',
                rightColunm: '',
              }),
            ),
          )
          console.log('tablecountinfor', this.tablecountinfor)
          console.log('conditions', this.conditions)
        }
        console.log('op', option)
        console.log('conditions', this.conditions)
      })
    },

    updatecascader(index, item) {
      let node = this.$refs['myCascader'].current //labels
      console.log('this is index: ', index)
      console.log(index)
      console.log(item[0]) //用于填数据结构
      console.log(item[1]) //用于填数据结构

      this.secondoptions.forEach((secop) => {
        if (secop.value == item[0]) {
          secop.disabled = true

          secop.children.forEach((child) => {
            if (child.label == item[1]) {
              this.firsttype = child.type
            }
          })
        } else if (secop.value != item[0]) {
          secop.disabled = false
          secop.children.forEach((child) => {
            if (child.type == this.firsttype) {
              child.disabled = false
            } else {
              child.disabled = true
            }
          })
        }
      })
      console.log(index)
      this.conditions[index - 1].leftTable = item[0]
      this.conditions[index - 1].leftColumn = item[1]
      console.log('conditions', this.conditions)
    },

    updatesecondcascader(index, item) {
      console.log(item[0]) //用于填数据结构
      console.log(item[1]) //用于填数据结构
      console.log(index)
      this.conditions[index - 1].rightTable = item[0]
      this.conditions[index - 1].rightColunm = item[1]
      console.log('conditions', this.conditions)
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

    //this.tablecountinfor = this.tablecount - 1
    this.gettdata()
    this.tablecountinfor = this.tablecount - 1
    console.log('tablecountinfor', this.tablecountinfor)
    console.log('tablecount', this.tablecount)
    this.conditions = new Array(this.tablecountinfor).fill({
      leftTable: '',
      leftColumn: '',
      rightTable: '',
      rightColunm: '',
    })
    console.log('indexofconditon?', this.conditions)
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
