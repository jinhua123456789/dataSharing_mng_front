<template>
  <el-row
    :gutter="40"
    class="panel-group"
    type="flex"
    justify="center"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="8"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
            icon-class="peoples"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户数
          </div>
          <count-to
            :start-val="0"
            :end-val="panelData.peopleNumber"
            :duration="4000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="8"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-warning">
          <svg-icon
            icon-class="warning"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            预警人数/人次
          </div>
          <count-to
            :start-val="0"
            :end-val="panelData.warningNumber"
            :duration="4000"
            class="card-panel-num"
          />/
          <count-to
            :start-val="0"
            :end-val="panelData.warningTimes"
            :duration="4000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="8"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-health">
          <svg-icon
            icon-class="health"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            干预人数/人次
          </div>
          <count-to
            :start-val="0"
            :end-val="panelData.healthNumber"
            :duration="4000"
            class="card-panel-num"
          />/
          <count-to
            :start-val="0"
            :end-val="panelData.healthTimes"
            :duration="4000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="8"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-ask">
          <svg-icon
            icon-class="ask_fill"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            咨询人数/人次
          </div>
          <count-to
            :start-val="0"
            :end-val="panelData.askNumber"
            :duration="4000"
            class="card-panel-num"
          />/
          <count-to
            :start-val="0"
            :end-val="panelData.askTimes"
            :duration="4000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="8"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-toy">
          <svg-icon
            icon-class="toy"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            设备使用频次/时长
          </div>
          <count-to
            :start-val="0"
            :end-val="panelData.toyTimes"
            :duration="4000"
            class="card-panel-num"
          />/
          <count-to
            :start-val="0"
            :end-val="panelData.toyUseTime"
            :duration="4000"
            class="card-panel-num"
          />h
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import { fetchPanelData } from '@/api/online'

export default {
  components: {
    CountTo
  },
  data () {
    return {
      panelData:{
        peopleNumber: 0,
        warningNumber: 0,
        warningTimes: 0,
        healthNumber: 0,
        healthTimes: 0,
        askNumber: 0,
        askTimes:0,
        toyTimes:0,
        toyUseTime:0
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchPanelData().then(response => {
        this.panelData=response.data
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 10px;
  .card-panel-col {
    margin-bottom: 16px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-warning {
        color: #f4516c;
      }
      .icon-ask {
        color: #1890FF;
      }
      .icon-health {
        color: #34bfa3;
      }
      .icon-toy {
        color: #1afa29;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-warning {
      color: #f4516c;
    }
    .icon-ask {
      color: #1890FF;
    }
    .icon-health{
      color: #34bfa3;
    }
    .icon-toy {
      color: #1afa29;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 10px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 13px;
      }
    }
  }
}
</style>
