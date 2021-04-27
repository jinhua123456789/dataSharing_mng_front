<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="link"><i class="el-icon-d-arrow-left icon" @click="goBack()">返回</i></div>
      <el-select v-model="searchValue" value="" class="filter-item">
        <el-option
          v-for="item in this.searchOptions"
          :key="item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search()">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">
        新增
      </el-button>

      <p class="notice">
        *此堰槽的计算系数记录需为已有计算结果的计算任务提供查看计算系数等作用，因此，如需修改，请弃用后新增。
      </p>
      <el-table :data="weirTankData" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="堰槽编号" min-width="80px">
          <template slot-scope="{row}">
            <span>{{row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="堰槽类型" min-width="80px">
          <template slot-scope="{row}">
            <span>{{row.weirTypeCode}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="堰槽计算系数" min-width="80px">
          <template slot-scope="{row}">
            <span>{{row.coefficient}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="堰槽状态" min-width="80px">
          <template slot-scope="{row}">
            <span>{{showWeirTankStatus(row.deleted)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作 " align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="deleteItem(scope)">弃用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="totalElements"
                     :current-page="currentPage + 1"
                     :page-size="10"
                     :total="totalElements"
                     background
                     layout="prev, pager, next"
                     @current-change="onPageChange">
      </el-pagination>
    </div>
    <el-dialog title="堰槽详情"
               :close-on-click-modal="false"
               :visible.sync="dialogProjectVisible"
               top="0">
      <el-form :model="weirTankItem"
               ref="dataForm"
               label-position="left"
               label-width="110px"
               style="width: 450px; margin-left:50px;">
        <el-form-item label="堰槽编号" prop="id">
          <el-input v-model="weirTankItem.weirCode" />
        </el-form-item>
        <el-form-item label="堰槽类型" prop="type">
          <el-input v-model="weirTankItem.weirType" />
        </el-form-item>
        <el-form-item label="H槽参数A（HA）" prop="HA">
          <el-input v-model="weirTankItem.ha" />
        </el-form-item>
        <el-form-item label="H槽参数B（HB）" prop="HB">
          <el-input v-model="weirTankItem.hb" />
        </el-form-item>
        <el-form-item label="H槽参数C（HC）" prop="HC">
          <el-input v-model="weirTankItem.hc" />
        </el-form-item>
        <el-form-item label="零水位校正值K0" prop="K0">
          <el-input v-model="weirTankItem.k0" />
        </el-form-item>
        <el-form-item label="流量校正系数Ck" prop="Ck">
          <el-input v-model="weirTankItem.ck" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProjectVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {
        addFlowCalculateCoefficient,
        deleteFlowCalculateCoefficient,
        findByManagementStationId
    } from "../../api/projectExcution";

    export default {
        name: "weirTankDetail",
        props: ["watershedManagementStationId"],
        data() {
            return {
                managementStationId: this.watershedManagementStationId,
                searchValue: '', // 条件查询默认显示全部
                searchOptions: [{
                    value: '0',
                    label: '显示全部'
                }, {
                    value: '1',
                    label: '只显示可用堰槽'
                }],
                weirTankData: [{
                    id: 'H_01',
                    weirTypeCode: 'H型槽',
                    coefficient: 'HA = 0.5, HB = 1.2'
                }],
                dialogProjectVisible: false,
                weirTankItem: {
                    "angle": 0,
                    "b": 0,
                    "cd": 0,
                    "ck": 0,
                    "cl": 0,
                    "cv": 0,
                    "deleted": 0,
                    "f": 0,
                    "field1": 0,
                    "field2": 0,
                    "ha": 0,
                    "hb": 0,
                    "hc": 0,
                    "id": 0,
                    "k0": 0,
                    "kb": 0,
                    "kh": 0,
                    "kq": 0,
                    "l": 0,
                    "n": 0,
                    "note": "",
                    "p": 0,
                    "rb": 0,
                    "stationId": this.managementStationId,
                    "weirCode": "",
                    "weirName": "",
                    "weirType": 0
                },
                currentPage: 0,
                totalElements: 0
            }
        },
        created() {
            this.getData();
        },
        methods: {
            showWeirTankStatus(status) {
                return status == 0 ? "正常" : "弃用";
            },
            search() {
              this.getData(parseInt(this.managementStationId), this.currentPage, 10, this.searchValue);
            },
            getData() {
                if (!this.searchValue) {
                    findByManagementStationId(parseInt(this.managementStationId), this.currentPage, 10, 0)
                        .then(res => {
                            this.weirTankData = res.data.content;
                        })
                } else {
                    findByManagementStationId(parseInt(this.managementStationId), this.currentPage, 10, this.searchValue)
                        .then(res => {
                            this.weirTankData = res.data.content;
                        })
                }
            },
            goBack() {
              this.$emit("backToMainPageAndHideWeirTankDetail", false);
            },
            onConfirm () {
                console.log(this.weirTankItem);
                addFlowCalculateCoefficient(this.weirTankItem).then(res => {
                    console.log(res);
                })
            },
            addNewItem () {
                this.dialogProjectVisible = true;
                this.dialogTitle = "新增";
            },
            deleteItem (scope) {
                deleteFlowCalculateCoefficient(scope.row.id).then(res => {
                    console.log(res);
                })
            },
            onPageChange (page) {
                this.currentPage = page - 1;
            },
        }
    }
</script>

<style scoped>
.notice {
  font-size: 12px;
  color: #777777;
}
.link {
  color: #379AFF;
  margin: 0 0 20px;
  cursor: pointer;
}
</style>
