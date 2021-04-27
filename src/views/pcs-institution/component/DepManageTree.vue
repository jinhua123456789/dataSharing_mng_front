<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="30">
        <el-tree
          class="filter-tree"
          :data="treeData"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="getNodeData"
          default-expand-all
        ></el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchTree, getObj, addObj, putObj, delObj } from "@/api/OrgDpt.js";
import { mapGetters } from "vuex";
export default {
  //name: "",
  data() {
    return {
      list: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: "",
      showElement: false,
      typeOptions: ["0", "1"],
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      labelPosition: "right",
      form: {
        name: null,
        id: null,
        parentId: null,
        info: null,
        status: null,
        orgId: null,
        dptNo: null,
        adminPhone: null,
        adminRealName: null,
        depAddress: null
      },
      currentId: 0,
      deptManager_btn_add: false,
      deptManager_btn_edit: false,
      deptManager_btn_del: false
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data;
        //console.log(response.data)
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = "update";
      }
      getObj(data.id).then(response => {
        this.form = response.data;
      });
      this.currentId = data.id;
      this.showElement = true;
    }
  }
};
</script>

