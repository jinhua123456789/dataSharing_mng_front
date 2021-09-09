<template>
  <div>
    <el-container>
      <el-main>
        <el-input placeholder="请输入视图名" v-model="viewName">
          <template slot="prepend">新创建的视图名</template>
        </el-input>
        <span v-for="(n, index) in this.relationCount" :key="index">
          <el-row>
            <div class="block">
              <span class="demonstration">请选择数据列</span>
              <el-cascader
                :options="options[index].left"
                ref="myCascader"
                clearable
                style="width: 300px;"
                @change="updateCascader(index, $event, 'left')"
              ></el-cascader>

              <span class="demonstration">与数据列</span>
              <el-cascader
                :options="options[index].right"
                clearable
                ref="='mySecondCascader"
                style="width: 300px;"
                @change="updateCascader(index, $event, 'right')"
              ></el-cascader>
              <span>链接</span>
            </div>
          </el-row>
        </span>
        <el-button type="primary" @click="createView()">创建视图</el-button>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      viewName: '',
      tableCount: 0,
      relationCount: 0,
      screenWidth: '1',
      leftOptions: [],
      rightOptions: [],
      options: [],
      firsttype: '',
      types: [],
      relations: null,
    }
  },
  props: ['tablesFrom2'],
  methods: {
    createView() {
      if (this.viewName == '') {
        window.alert('视图名称不能为空')
        return;
      }
      if (this.relations.length > 0) {
        for (let i = 0; i < this.relations.length; ++i) {
          if (this.relations[i].leftTable == undefined || this.relations[i].rightTable == undefined) {
            window.alert('请确保对所有外键关系都进行了选择');
            return;
          }
        }
      }

      console.log(this.tablesFrom2)

      const tableNames = [];
      const columns = [];
      for (const table of this.tablesFrom2) {
        tableNames.push(table.name);
        for (const col of table.columns) {
          columns.push({
            table: table.name,
            column: col.columnName,
            name: table.name + '_' + col.columnName
          })
        }
      }


      let request = {
        name: this.viewName,
        tables: tableNames,
        columns: columns,
        conditions: this.relations
      }
      console.log(request)
      this.$axios.post('http://10.112.64.74:8765/createView', request)
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          window.alert("视图" + this.viewName + "创建成功");
          this.$emit("createSuccess");
        } else {
          window.alert("视图" + this.viewName + "创建失败");
        }
      })
    },

    initCascader() {
      this.tablesFrom2.forEach((table) => {
        let optionChildren = []
        optionChildren = table.columns
        optionChildren.forEach((col) => {
          col.value = col.columnName;
          col.label = col.columnName;
        })
        const option = {
          value: table.name,
          label: table.name,
          disabled: false,
          children: optionChildren,
        }
        this.leftOptions.push(option)
        this.rightOptions.push(JSON.parse(JSON.stringify(option)))

        for (let i = 0; i < this.options.length; ++i) {
          this.options[i].left.push(JSON.parse(JSON.stringify(option)))
          this.options[i].right.push(JSON.parse(JSON.stringify(option)))
        }
      })
    },

    initRelations() {
      this.relations = new Array(this.relationCount);
      for (let i = 0; i < this.relationCount; ++i) {
        this.relations[i] = { 
          leftTable: undefined, 
          leftColumn: undefined,
          rightTable: undefined,
          rightColumn: undefined,
        };
      }
    },

    initTypes() {
      this.types = new Array(this.relationCount);
      for (let i = 0; i < this.relationCount; ++i) {
        this.types[i] = null;
      }
    },

    initOptions() {
      this.options = new Array(this.relationCount);
      for (let i = 0; i < this.relationCount; ++i) {
        this.options[i] = { left: [], right: [] };
      }
    },

    updateCascaderLeft(index, item) {
      this.relations[index].leftTable = item[0]
      this.relations[index].leftColumn = item[1]

      this.rightOptions.forEach((option) => {
        if (option.value == this.relations[index].leftTable) {
          option.disabled = true

          for (const child of option.children) {
            if (child.label == this.relations[index].leftColumn) {
              this.types[index] = child.type;
              break;
            }
          }
        } else {
          option.disabled = false
          option.children.forEach((child) => {
            if (child.type == this.types[index]) {
              child.disabled = false
            } else {
              child.disabled = true
            }
          })
        }
      })
      console.log('leftOptions: ', this.leftOptions)
      console.log('rightOptions: ', rightOptions)

      // console.log(this.relations)
    },

    updateCascaderRight(index, item) {
      this.relations[index].rightTable = item[0]
      this.relations[index].rightColumn = item[1]
      console.log(this.relations)
      console.log('leftOptions: ', leftOptions)
      console.log('rightOptions: ', rightOptions)
    },

    updateCascader(index, item, thisSide) {
      const thisTable = thisSide + 'Table';
      const thisColumn = thisSide + 'Column';
      const otherTable = thisSide == 'left' ? 'rightTable' : 'leftTable';
      const otherColumn = thisSide == 'left' ? 'rightColumn' : 'leftColumn';
      const otherSide = thisSide == 'left' ? 'right' : 'left';
      
      // console.log(thisTable)
      // console.log(thisColumn)
      // console.log(otherTable)
      // console.log(otherColumn)
      // console.log(otherSide)

      this.relations[index][thisTable] = item[0];
      this.relations[index][thisColumn] = item[1];

      if (item.length == 0) {
        if (this.relations[index][thisTable] === undefined && this.relations[index][otherTable] === undefined) {
          // console.log("this.relations[index]: ", this.relations[index]);
          // console.log("this.types[index]: ", this.types[index]);
          this.types[index] = null;
          for (const side of [thisSide, otherSide]) {
            for (const option of this.options[index][side]) {
              option.disabled = false;
              for (const child of option.children) {
                child.disabled = false;
              }
            }
          }          
        }
      } else {

        // 获取类型 & 禁用原表
        for (const option of this.options[index][otherSide]) {
          let canBreak = false;
          if (option.value == this.relations[index][thisTable]) {
            option.disabled = true
            for (const child of option.children) {
              if (child.label == this.relations[index][thisColumn]) {
                if (this.types[index] == null) {
                  this.types[index] = child.type;
                }
                canBreak = true;
                break;
              }
            }
          }
          console.log('thisSide: ', thisSide)
          console.log('this.options[index][thisSide]: ', this.options[index][thisSide])
          console.log('otherSide: ', otherSide)
          console.log('this.options[index][otherSide]: ', this.options[index][otherSide])
          if (canBreak) break;
        }

        for (const option of this.options[index][otherSide]) {
          if (option.value != this.relations[index][thisTable]) {
            option.disabled = false
            option.children.forEach((child) => {
              if (child.type == this.types[index]) {
                child.disabled = false
              } else {
                child.disabled = true
              }
            })
          }
        }
 

        this.options[index][otherSide].forEach((option) => {
          if (option.value == this.relations[index][thisTable]) {
            option.disabled = true
            for (const child of option.children) {
              if (child.label == this.relations[index][thisColumn]) {
                this.types[index] = child.type;
                break;
              }
            }
          } else {
            option.disabled = false
            option.children.forEach((child) => {
              if (child.type == this.types[index]) {
                child.disabled = false
              } else {
                child.disabled = true
              }
            })
          }
        })
      }

      // console.log(this.relations[index][thisTable])
      // console.log(this.relations[index][thisColumn])

      // console.log()

      

      console.log("this.relations: ", this.relations);
      console.log("this.types: ", this.types);
    }
  },

  created() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
    this.tableCount = this.tablesFrom2.length;
    this.relationCount = this.tableCount - 1;
    this.initOptions(); // 必须在 initCasCader之前
    this.initCascader();
    this.initRelations();
    this.initTypes();
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
