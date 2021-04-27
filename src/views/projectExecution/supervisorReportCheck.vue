<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="径流小区编号" style="width: 200px;" class="filter-item" v-model="searchValue1" />
      <el-input placeholder="测流设备" style="width: 200px;" class="filter-item" v-model="searchValue2" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="serchByValue()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;" :row-class-name="tableRowClassName">
      <el-table-column align="center" label="小区编号" min-width="100px" fixed>
        <template slot-scope="{row}">
          <el-button type="text">{{row.code }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="小区名称" min-width="100px" fixed>
        <template slot-scope="{row}">
          <el-button type="text">{{row.name }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经度（°）" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="纬度（°）" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.latitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="海拔（m）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.altitude}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有雨量站" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="getStationsInfo(row.id, 1)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代表雨量站" min-width="120px">
        <template slot-scope="{row}">
          <span>{{getRepresentation(row)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有植被盖度观测点" min-width="110px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="getStationsInfo(row.id, 2)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有土壤水分观测点" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="getStationsInfo(row.id, 3)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="坡度（°）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.slope}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="坡长（m）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.slopeLength}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="坡宽（m）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.slopeWidth}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="坡向（°）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.slopeAspect}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="坡位" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.slopePosition}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="面积（m²）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.area}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="土壤类型" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.soilType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="土层厚度（cm）" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.soilThickness}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="水保措施" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.conservationMeasures}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="径流小区类型" min-width="120px">
        <template slot-scope="{row}" v-if="row.ztype">
          <el-button type="primary" @click="setExtraInfo(row.id)">{{getTypeName(row.ztype)}}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="建设时间" min-width="140px">
        <template slot-scope="{row}">
          <span>{{toString(row.buildYear)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设置目的" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.purpose}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="观测项目" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.observation}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="测流设备" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.measureEquipment}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分流级数" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.level}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="一级分流孔数" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.tapHoleNum1}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="一级分流箱底面积（m²）" min-width="140px">
        <template slot-scope="{row}">
          <span>{{row.shuntLevel1Cas}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="二级分流孔数" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.tapHoleNum2}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="二级分流箱底面积（m²）" min-width="140px">
        <template slot-scope="{row}">
          <span>{{row.shuntLevel2Cas}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="集流桶底面积（m²）" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.collectingTankscas}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="说明" min-width="150px">
        <template slot-scope="{row}">
          <span>{{row.aim}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作 " align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="primary" @click="getInFetchList(row.id)"
          >查看</el-button> -->
          <el-button size="small" type="primary" @click="modifyItem(scope,'dataForm')">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="currentPage + 1" v-if="totalElements" background :page-size="10" layout="prev, pager, next" :total="totalElements" @current-change="onPageChange">
    </el-pagination>

    <el-dialog :close-on-click-modal="false" :title="infoListTitle" :visible.sync="stationDialogVisible" width="30%">
      <div>
        <ul>
          <li v-for="(station, idx) in stations" :key="idx">
            {{station}}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="图片" :visible.sync="dialogFormVisible" align="center" width="60%">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item, idx) in imgList" :key="idx">
          <img :src="item" style="height:400px;max-width:100%;">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" align="center" :title="extraInfoTitle" :visible.sync="extraInfoDialogVisible" :top="extraInfoDialogTop">
      <el-form ref="dataForm1" label-position="left" :label-width="extraInfoDialogLabelWidth" style="width: 500px;">
        <el-form-item v-for="(item, idx) in extraInfo" :key="extraInfoTitle + idx.toString()" :label="item.label">
          <el-input v-if="item.multiRow" type="textarea" rows="4" :value="item.value" />
          <el-input v-else :value="item.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="extraInfoDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <div>
      <!-- <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible" top="0" :before-close="beforeDialogClose"> -->
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible" top="0" @close="beforeDialogClose">
        <el-form :model="newItem.jingliu" :rules="rules" ref="dataForm" label-position="left" label-width="150px" style="width: 500px; margin-left:80px;">
          <el-form-item label="小区编号" prop="code" v-if="isModify">
            <el-input v-model="newItem.jingliu.code" maxlength="15" placeholder="请输入小区编号" disabled/>
          </el-form-item>
          <el-form-item label="小区编号" prop="code" v-else>
            <el-input v-model="newItem.jingliu.code" maxlength="15" placeholder="请输入小区编号" />
          </el-form-item>
          <el-form-item label="小区名称" prop="name">
            <el-input v-model="newItem.jingliu.name" maxlength="15" placeholder="请输入小区名称" />
          </el-form-item>
          <el-form-item label="经度（°）" prop="longitude">
            <el-input v-model="newItem.jingliu.longitude" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度（°）" prop="latitude">
            <el-input v-model="newItem.jingliu.latitude" placeholder="请输入纬度" />
          </el-form-item>
          <el-form-item label="海拔（m）" prop="altitude">
            <el-input v-model="newItem.jingliu.altitude" placeholder="请输入海拔,单位：m(米)" />
          </el-form-item>
          <el-form-item label="代表雨量站" v-if="isModify">
            <el-select v-model="newItem.representStation" placeholder="请选择">
              <el-option v-for="item in stationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="">
            <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed" :file-list="fileList" list-type="picture-card" :action="pathToUploadImage" :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange" :on-remove="handleRemove" multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="坡度（°）" prop="slope">
            <el-input v-model="newItem.jingliu.slope" placeholder="请输入,单位：°(度)" />
          </el-form-item>
          <el-form-item label="坡长（m）" prop="slopeLength">
            <el-input v-model="newItem.jingliu.slopeLength" placeholder="请输入坡长,单位：m(米)" />
          </el-form-item>
          <el-form-item label="坡宽（m）" prop="slopeWidth">
            <el-input v-model="newItem.jingliu.slopeWidth" placeholder="请输入坡宽,单位：m(米)" />
          </el-form-item>
          <el-form-item label="坡向（°）" prop="slopeAspect">
            <el-input v-model="newItem.jingliu.slopeAspect" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="坡位" prop="slopePosition">
            <el-input v-model="newItem.jingliu.slopePosition" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="面积（m²）" prop="area">
            <el-input v-model="newItem.jingliu.area" placeholder="请输入面积,单位：㎡(平方米)" />
          </el-form-item>
          <el-form-item label="土壤类型" prop="soilType">
            <el-input v-model="newItem.jingliu.soilType" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="土层厚度（cm）" prop="soilThickness">
            <el-input v-model="newItem.jingliu.soilThickness" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="水保措施" prop="conservationMeasures">
            <el-input v-model="newItem.jingliu.conservationMeasures" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="测流设备" prop="measureEquipment">
            <el-input v-model="newItem.jingliu.measureEquipment" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="分流级数" prop="measureEquipment">
            <el-input v-model="newItem.jingliu.level" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="径流小区类型" prop="ztype">
            <el-select v-model="newItem.jingliu.ztype" placeholder>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-collapse v-if="newItem.jingliu.ztype === 1">
            <el-collapse-item title="农地信息">
              <!-- <el-form :model="newItem.nongdi" :rules="rules" ref="dataFormNong" label-position="left" label-width="100px" style="width: 480px;margin-left: 10px"> -->
                  <!-- <el-form-item v-for="(item, idx) in nongdiFields" :key="'nong' + idx.toString()" :label="item.label"> -->
                  <!-- <el-form-item v-for="(item, idx) in nongdiFields" :key="'nong' + idx.toString()" :label="item.label" :prop="'nongdi.'+idx+'.value'" :rules="item.rule" > -->
                    <!-- <el-input v-if="item.multiRow" type="textarea" rows="5" v-model="newItem.nongdi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'"/>
                    <el-date-picker v-else-if="item.isDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="newItem.nongdi[item.field]" style="width: 100%;"></el-date-picker>
                    <el-input v-else v-model="newItem.nongdi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'"/>
                  </el-form-item> -->
              <!-- </el-form> -->
              <el-form :model="newItem.nongdi" :rules="rules" ref="dataForm" label-position="left" label-width="100px" style="width: 480px;margin-left: 10px">
                <el-form-item v-for="(item, idx) in nongdiFields" :key="'nong' + idx.toString()" :label="item.label"  :prop="item.field">
                  <el-date-picker v-if="item.isDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @input="getdate+item.field" v-model="item.prop" style="width: 100%;"></el-date-picker>
                  <el-input v-else-if="item.multiRow " type="textarea" rows="5" v-model="newItem.nongdi[item.field]" :placeholder="item.placeholder"/>
                  <el-input v-else v-model="newItem.nongdi[item.field]" :placeholder="item.placeholder"/>

                </el-form-item>
              <!-- </el-form> -->
              </el-form>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-if="newItem.jingliu.ztype === 2">
            <el-collapse-item title="林地信息">
              <!-- <el-form ref="dataFormLin" label-position="left" label-width="130px" style="width: 480px;margin-left: 10px"> -->
                <el-form-item v-for="(item, idx) in lindiFields" :key="'lin' + idx.toString()" :label="item.label">
                  <el-input v-if="item.multiRow" type="textarea" rows="5" v-model="newItem.lindi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'"/>
                  <el-date-picker v-else-if="item.isDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="newItem.lindi[item.field]" style="width: 100%;"></el-date-picker>
                  <el-input v-else v-model="newItem.lindi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'" />
                </el-form-item>
              <!-- </el-form> -->
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-if="newItem.jingliu.ztype === 3">
            <el-collapse-item title="灌草地信息">
              <!-- <el-form ref="dataFormGuan" label-position="left" label-width="100px" style="width: 480px;margin-left: 10px"> -->
                <el-form-item v-for="(item, idx) in guancaodiFields" :key="'cao' + idx.toString()" :label="item.label">
                  <el-input v-if="item.multiRow" type="textarea" rows="5" v-model="newItem.guancaodi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'" />
                  <el-date-picker v-else-if="item.isDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="newItem.guancaodi[item.field]" style="width: 100%;"></el-date-picker>
                  <el-input v-else v-model="newItem.guancaodi[item.field]" :placeholder="item.isNum ? '请输入数值' : '请输入'" />
                </el-form-item>
              <!-- </el-form> -->
            </el-collapse-item>
          </el-collapse>
          <el-form-item label="建设时间" prop="stationname">
            <!-- <el-input v-model="newItem.jingliu.buildYear" /> -->
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @input="getdate" v-model="newItem.jingliu.buildYear" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col class="line" :span="2">-</el-col> -->
            <!-- <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker placeholder="选择时间" format="HH:mm:ss" value-format="HH:mm:ss" @input="gettime" v-model="newItem.jingliu.date2" style="width: 100%;"></el-time-picker>
              </el-form-item>
            </el-col> -->
          </el-form-item>
          <el-form-item label="设置目的" prop="purpose">
            <el-input v-model="newItem.jingliu.purpose" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="观测项目" prop="observation">
            <el-input v-model="newItem.jingliu.observation" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="一级分流孔数" prop="tapHoleNum1">
            <el-input v-model="newItem.jingliu.tapHoleNum1" placeholder="请输入一级分水箱孔数" />
          </el-form-item>
          <el-form-item label="一级分流箱底面积（m²）" prop="shuntLevel1Cas">
            <el-input v-model="newItem.jingliu.shuntLevel1Cas" placeholder="请输入一级分水箱底面积,单位：㎡(平方米)" />
          </el-form-item>
          <el-form-item label="二级分流孔数" prop="tapHoleNum2">
            <el-input v-model="newItem.jingliu.tapHoleNum2" placeholder="请输入二级分水箱孔数" />
          </el-form-item>
          <el-form-item label="二级分流箱底面积（m²）" prop="shuntLevel2Cas">
            <el-input v-model="newItem.jingliu.shuntLevel2Cas" placeholder="请输入二级分水箱底面积,单位：㎡(平方米)" />
          </el-form-item>
          <el-form-item label="集流桶底面积（m²）" prop="collectingTankscas">
            <el-input v-model="newItem.jingliu.collectingTankscas" placeholder="请输入集流桶面积,单位：㎡(平方米)" />
          </el-form-item>
          <el-form-item label="说明" prop="aim">
            <el-input type="textarea" rows="5" v-model="newItem.jingliu.aim" placeholder="请输入实验目的,限制在500字以内" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onComfirm('dataForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
const nongdiFields = [
  {
    field: "cultivationDate",
    label: "中耕日期",
    multiRow: false,
    isDate: true
  },
  {
    field: "crop",
    label: "作物",
    multiRow: true
  },
  {
    field: "density",
    label: "密度",
    multiRow: false,
    isNum: true
  },
  {
    field: "grainYield",
    label: "粮食产量",
    multiRow: false,
    isNum: true,
    placeholder: "单位：kg"
  },
  {
    field: "harvestDate",
    label: "收割日期",
    multiRow: false,
    isDate: true
  },
  {
    field: "plantSpacing",
    label: "株距",
    multiRow: false,
    placeholder: "单位：米",
    isNum: true
  },
  {
    field: "pureFertilizerAmount",
    label: "施肥纯量",
    multiRow: false,
    prop: "floatVal",
    // rule: valiNumber,
    isNum: true
  },
  {
    field: "ridgeSpacing",
    label: "垄距",
    multiRow: false,
    isNum: true,
    placeholder: "单位：米"
  },
  {
    field: "rowSpacing",
    label: "行距",
    multiRow: false,
    isNum: true,
    placeholder: "单位：米"
  },
  {
    field: "seedingMethod",
    label: "播种方法",
    multiRow: true
  },
  {
    field: "sitePreparationMethod",
    label: "整地方法",
    multiRow: true
  },
  {
    field: "sowingDate",
    label: "播种日期",
    multiRow: false,
    isDate: true
  },
  {
    field: "strawYield",
    label: "秸秆产量",
    multiRow: false,
    isNum: true,
    placeholder: "单位：kg"
  }
];
const lindiFields = [
  {
    field: "averageCrownDiameter",
    label: "平均树冠直径",
    multiRow: false,
    isNum: true
  },
  {
    field: "afforestationMethod",
    label: "造林方法",
    multiRow: true
  },
  {
    field: "canopyDensity",
    label: "郁闭度",
    multiRow: false,
    isNum: true
  },
  {
    field: "coverage",
    label: "盖度",
    multiRow: false,
    isNum: true
  },
  {
    field: "plantSpacing",
    label: "株距",
    multiRow: false,
    isNum: true
  },
  // {
  //   field: "plantSpacing",
  //   label: "株距",
  //   multiRow: false
  // },
  {
    field: "rowSpacing",
    label: "行距",
    multiRow: false,
    isNum: true
  },
  {
    field: "standAge",
    label: "林龄",
    multiRow: false,
    isNum: true
  },
  {
    field: "treeSpecie",
    label: "树种",
    multiRow: true
  },
  {
    field: "undergrowthVegetationAverageHeight",
    label: "林下植被平均高度",
    multiRow: false,
    isNum: true
  },
  {
    field: "undergrowthVegetationMainType",
    label: "林下植被主要种类",
    multiRow: true
  },
  {
    field: "undergrowthVegetationType",
    label: "林下植被类型",
    multiRow: true
  }
];
const guancaodiFields = [
  {
    field: "averageHeight",
    label: "平均高度",
    multiRow: false,
    isNum: true
  },
  {
    field: "biomass",
    label: "生物量",
    multiRow: false,
    isNum: true
  },
  {
    field: "coverage",
    label: "盖度",
    multiRow: false,
    isNum: true
  },
  {
    field: "forageYield",
    label: "牧草产量",
    multiRow: false,
    isNum: true
  },
  {
    field: "harvestDate",
    label: "收割日期",
    multiRow: false,
    isDate: true
  },
  {
    field: "seedingMethod",
    label: "播种方法",
    multiRow: true
  },
  {
    field: "shrubGrassSpecie",
    label: "灌草种类",
    multiRow: true
  },
  {
    field: "sowingDate",
    label: "播种日期",
    multiRow: false,
    isDate: true
  }
]

import pathToUploadImage from '@/api/projectExcution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getAllJingLiuController, deleteJingLiuController, searchJingLiuController, addJingLiuController, modifyJingLiuController, getJingLiuById, setJingLiuRepresentStation } from '@/api/projectExcution'

export default {
  name: "soilTempreture",
  components: { Pagination },
  directives: { waves },
  data () {
    var valiNumberPass1 = (rule, value, callback) => {//包含小数的数字
      let reg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/;
      // if (value === '') {
      //     callback(new Error('请输入经度'));
      // } else if (!reg.test(value)) {
      //     callback(new Error('保留小数点后六位'));
      // } else {
      //     callback();
      // }
      if (value === '') {
        callback(new Error('请输入经度'));
      }
      if (!reg.test(value)) {
        callback(new Error('请输入(-180°,+180°)内的值'));
      }
      if (!(/^[0-9]+(.[0-9]{1,6})?$/.test(value))) {
        callback(new Error('请输入正确值（小数保留小数点后六位以内）'))
      }
      else {
        callback();
      }
    };
    var valiNumberPass2 = (rule, value, callback) => {//包含小数的数字
      let reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/;
      // if (value === '') {
      //     callback(new Error('请输入经度'));
      // } else if (!reg.test(value)) {
      //     callback(new Error('保留小数点后六位'));
      // } else {
      //     callback();
      // }
      if (value === '') {
        callback(new Error('请输入纬度'));
      }
      if (!reg.test(value)) {
        callback(new Error('请输入(-90°,+90°)内的值'));
      }
      if (!(/^[0-9]+(.[0-9]{1,6})?$/.test(value))) {
        callback(new Error('请输入正确值（小数保留小数点后六位以内）'))
      }
      else {
        callback();
      }
    };
    var valiNumberPass3 = (rule, value, callback) => {//包含小数的数字
      //let reg = /^[0-9]+(.[0-9]{1,4})$/;
      let reg = /^[0-9]+(.[0-9]{1})?$/;
      if (value === '') {
        callback(new Error('请输入海拔高度'));
      } else if (!reg.test(value)) {
        callback(new Error('至多保留小数点后一位'));
      } else {
        callback();
      }
      // if(value===''){
      //   callback(new Error('请输入纬度'));
      // }
      // if (!reg.test(value)) {
      //     callback(new Error('请输入(-90°,+90°)内的值'));
      // }
      // if(!(/^[0-9]+(.[0-9]{6})$/.test(value))) {
      //   callback(new Error('保留六位小数'))
      // }
      // else {
      //     callback();
      // }
    };
    var valiNumberPass4 = (rule, value, callback) => {//包含小数的数字
      //let reg = /^[0-9]+(.[0-9]{1,4})$/;
      let reg = /^[0-9]{1,8}$/;
      if (value === '') {
        callback(new Error('请输入小区编号'));
      } else if (!reg.test(value)) {
        callback(new Error('限制于八位数字以内'));
      } else {
        callback();
      }
    };
    var valiNumberPass5 = (rule, value, callback) => {//包含小数的数字
      // let reg = /^[0-9]+(.[0-9]{1,4})?$/;
      console.log("#####" + value + "##########")
      let reg = /^[0-9]+(.[0-9]{1})?$/;
      if (value && (value !== '')  && (!reg.test(value))) {
        callback(new Error('格式错误'));
      } else {
        callback();
      }
    };
    return {
      infoListTitle: '',
      pathToUploadImage,
      stations: [],
      imgList: [],
      fileList: [],
      fileMap: {},
      totalElements: 0,
      currentPage: 0,
      stationDialogVisible: false,
      dialogFormVisible: false,
      stationOptions: [],
      stationMap: {},
      nongdiFields,
      lindiFields,
      guancaodiFields,
      extraInfoTitle: '',
      extraInfoDialogVisible: false,
      extraInfoDialogTop: "0",
      extraInfoDialogLabelWidth: "100px",
      extraInfo: [],
      tableKey: 0,
      newItem: {
        jingliu: {
          code: '',
          longitude: '',
          latitude: '',
          altitude: '',
          representStation: '',
          slope: '',
          slopeLength: '',
          slopeWidth: '',
          slopeAspect: '',
          slopePosition: '',
          area: '',
          soilType: '',
          soilThickness: '',
          conservationMeasures: '',
          measureEquipment: '',
          date1: '',
          date2: '',
          buildYear: '',
          purpose: '',
          observation: '',
          shuntLevel1: '',
          tapHoleNum1: '',
          shuntLevel1Cas: '',
          shuntLevel2: '',
          tapHoleNum2: '',
          shuntLevel2Cas: '',
          collectingTanks: '',
          collectingTankscas: '',
          aim: ''
        },
        guancaodi: {},
        nongdi: {
          harvestDate:'',
          cultivationDate:'',
          sowingDate:'',
          pureFertilizerAmount:'',
          plantSpacing:'',
          ridgeSpacing:'',
          rowSpacing:'',
          strawYield:''
        },
        lindi: {}
      },
      rules: {
        code: [
          { required: true, message: '请输入小区编号', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{8}$/, message: '必须是8位数字', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入小区名称', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{8}$/, message: '必须是8位数字', trigger: 'blur' }
        ],
        longitude: [
          { required: true, validator: valiNumberPass1, trigger: 'blur' }
          //{type:'number',message:'必须小数且保留小数点后六位',trigger: 'blur'},
          //{pattern:  /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,message:'必须是8位数',trigger:'blur'}
        ],
        latitude: [
          { required: true, validator: valiNumberPass2, trigger: 'blur' }
          //{type:'number',message:'必须小数且保留小数点后六位',trigger: 'blur'},
          //{pattern:  /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,message:'必须是8位数字',trigger:'blur'}
        ],
        altitude: [
          { required: true, validator: valiNumberPass3, trigger: 'blur' }
        ],
        pureFertilizerAmount: [
          {required:false, validator: valiNumberPass5, trigger: 'blur' }
        ],
          plantSpacing: [
          {required:false, validator: valiNumberPass5, trigger: 'blur' }
        ],
          ridgeSpacing: [
          {required:false, validator: valiNumberPass5, trigger: 'blur' }
        ],
          rowSpacing: [
          {required:false, validator: valiNumberPass5, trigger: 'blur' }
        ],
          strawYield: [
          {required:false, validator: valiNumberPass5, trigger: 'blur' }
        ]
      },
      fakeData: [],
      options: [
        {
          value: 0,
          label: "无"
        },
        {
          value: 1,
          label: "农地"
        },
        {
          value: 2,
          label: "林地"
        },
        {
          value: 3,
          label: "灌草地"
        }
      ],
      // dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      searchValue1: "",
      searchValue2: "",
      defaultVal: {
        "altitude": 0,
        "area": 0,
        "buildYear": null,
        "collectingTanks": 0,
        "collectingTankscas": 0,
        "conservationMeasures": "",
        "latitude": 0,
        "longitude": 0,
        "measureEquipment": "",
        "observation": "",
        "purpose": "",
        "remark": "",
        "representStation": null,
        "shuntLevel1": null,
        "shuntLevel1Cas": 0,
        "shuntLevel2": 0,
        "shuntLevel2Cas": 0,
        "slope": 0,
        "slopeAspect": 0,
        "slopeLength": 0,
        "slopePosition": "",
        "slopeWidth": 0,
        "soilThickness": "",
        "soilType": "",
        "tapHoleNum1": 0,
        "tapHoleNum2": 0,
        "zid": 0,
        "ztype": 0
      }
    }
  },
  created () {
    this.currentPage = (this.$route.params && this.$route.params.hasOwnProperty('page')) ? this.$route.params.page : 0
    this.getData()
  },
  methods: {
    getStationsInfo(id, cate) {
      getJingLiuById(id).then(res => {
        if (res.code == 200) {
          this.stations = []
          var data, fieldName
          if (cate == 3) {
            data = res.data.soilTemperaturePoints
            fieldName = 'name'
            this.infoListTitle = '所有土壤水分温度采集点'
          } else if (cate == 2) {
            data = res.data.tblFieldSites
            fieldName = 'siteName'
            this.infoListTitle = '所有植被覆盖采集点'
          } else {
            data = res.data.stationList
            fieldName = 'stationname'
            this.infoListTitle = '所有雨量站'
          }
          for (let i = 0; i < data.length; ++i) {
            this.stations.push(data[i][fieldName])
          }
          this.stationDialogVisible = true
        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      // console.log(this.$route.params.page, this.$route.params.idx===rowIndex)
      if ((this.currentPage === this.$route.params.page) && (rowIndex === this.$route.params.idx)) {
        return 'success-row';
      }
      return '';
    },
    showImgs (images) {
      this.imgList = []
      try {
        images = JSON.parse(images)
        for (let i = 0; i < images.length; ++i) {
          this.imgList.push(images[i].url)
        }
        if (this.imgList.length) {
          this.dialogFormVisible = true
        } else {
          this.$message.warning('暂无图片！')
        }
      } catch (err) {
        this.$message.warning('暂无图片！')
      }
    },
    // beforeDialogClose (done) {
    beforeDialogClose () {
      this.fileList = []
      this.fileMap = {}
      this.$refs.uploadImg.clearFiles()
      // console.log("In beforeDialogClose")
      // done()
    },
    beforeUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('图片只能是 JPG 或 PNG 格式!')
      } else {
        let name = file.name.split('.')[0]
        let suffix = file.name.split('.')[1]
        if ((suffix !== 'png') && (suffix !== 'jpg')) {
          this.$message.error('图片只能是 JPG 或 PNG 格式!')
          return false
        }
        if (name.length > 64) {
          this.$message.error('文件名不能超过64个字符!')
          return false
        }
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    afterUpload (res, file, fileList) {
      console.log(res)
      this.fileMap[file.name] = res.data
    },
    onImgChange (file, fileList) {
      this.fileList = fileList
    },
    onExceed (file, fileList) {
      this.$message.error('图片数量超限！')
    },
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    onPageChange (page) {
      this.currentPage = page - 1
      this.getData()
    },
    getData () {
      searchJingLiuController(this.searchValue1, this.searchValue2, this.currentPage, 10).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      });
    },
    getdate (val) {
      this.newItem.jingliu.buildYear = val
      // this.newItem.jingliu.date1 = val;
      // //this.$message.error(val);
      // this.newItem.jingliu.buildYear = val + " " + this.newItem.jingliu.date2;
    },
    getdateharvestDate(val){
      this.newItem.nongdi.harvestDate = val
    },
    getdatecultivationDate(val){
      this.newItem.nongdi.cultivationDate = val
    },
    getdatesowingDate(val){
      this.newItem.nongdi.sowingDate = val
    },
    // gettime (val) {
    //   this.newItem.jingliu.date2 = val;
    //   //this.$message.error(val);
    //   this.newItem.jingliu.buildYear = this.newItem.jingliu.date1 + " " + val;
    // },
    getRepresentation (row) {
      return row.representStation ? row.representStation.stationname : ''
    },
    setExtraInfo (id) {
      getJingLiuById(id).then(res => {
        console.log(res, 'getJingLiuById')
        if (res.code === 200) {
          let info = {}
          let fields = []
          let row = res.data
          switch (row.jingliu.ztype) {
            case 1:
              this.extraInfoTitle = "农地信息"
              this.extraInfoDialogTop = "0"
              this.extraInfoDialogLabelWidth = "100px"
              fields = this.nongdiFields
              info = row.nongdi ? row.nongdi : {}
              break
            case 2:
              this.extraInfoTitle = "林地信息"
              this.extraInfoDialogTop = "0"
              this.extraInfoDialogLabelWidth = "140px"
              fields = this.lindiFields
              info = row.lindi ? row.lindi : {}
              break
            case 3:
              this.extraInfoTitle = "灌草地信息"
              this.extraInfoDialogTop = "0"
              this.extraInfoDialogLabelWidth = "100px"
              fields = this.guancaodiFields
              info = row.guancaodi ? row.guancaodi : {}
              break
          }
          this.extraInfo = []
          // this.extraInfo.splice(0, this.extraInfo.length)
          for (let i = 0; i < fields.length; ++i) {
            this.extraInfo.push({
              label: fields[i].label,
              value: info[fields[i].field],
              multiRow: fields[i].multiRow
            })
            // console.log(fields[i].label, info[fields[i].field], fields[i].multiRow)
          }
          this.extraInfoDialogVisible = true
        }
      })
    },
    getTypeName (ztype) {
      return {
        1: "农地",
        2: "林地",
        3: "灌草地"
      }[ztype]
    },
    onComfirm (dataForm) {
      let imgs = []
      for (let i = 0; i < this.fileList.length; ++i) {
        imgs.push({
          name: this.fileList[i].name,
          url: this.fileMap[this.fileList[i].name]
        })
      }
      this.newItem.jingliu.image = JSON.stringify(imgs)
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          if (this.isModify) {
            console.log(this.newItem, 'newItem')
            if (this.newItem.representStation) {
              setJingLiuRepresentStation(this.newItem.jingliu.id, this.newItem.representStation).then(res => {
                if (res.code === 200) {
                  this.newItem.jingliu.representStation = {
                    stationname: this.stationMap[this.newItem.representStation]
                  }
                } else {
                  this.$message.error('代表站设置失败！');
                }
              })
            }

            modifyJingLiuController(this.newItem).then(res => {
              console.log(res)
              if (res.code === 200) {
                // this.fakeData[this.modifyIdx] = Object.assign({}, this.newItem)
                this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem.jingliu))
                this.dialogProjectVisible = false
              }
            })
          } else {
            if ((this.newItem.jingliu.code === undefined) || (this.newItem.jingliu.code === "")) {
              this.$message.error('小区编号不能为空！');
            } else {
              console.log(this.newItem, 'newItem')
              for (let key in this.defaultVal) {
                if (this.newItem.jingliu[key] === undefined) {
                  this.newItem.jingliu[key] = this.defaultVal[key]
                }
              }
              // this.newItem.representStation = {}
              addJingLiuController(this.newItem).then(res => {
                console.log(res)
                if (res.code === 200) {
                  // this.newItem.jingliu.id = res.data.径流小区id
                  // this.fakeData.push(this.newItem.jingliu)
                  this.getData()
                  this.dialogProjectVisible = false
                  // console.log("End add")
                } else {
                  this.$message.error('编码已存在！');
                }
              })
            }
          }
        } else {
          this.$message.error('请补充信息！');
          return false;
        }
      })
    },
    addNewItem (dataForm) {
      this.newItem = {
        jingliu: {
          ztype: 0
        },
        guancaodi: {},
        nongdi: {},
        lindi: {}
      }
      this.isModify = false;
      this.dialogProjectVisible = true
      this.dialogTitle = "新增"
      if (this.$refs[dataForm]) {
        this.$refs[dataForm].clearValidate();
      }
    },
    deleteItem (scope) {
      this.$confirm('您确定要删除这条数据吗？')
      .then(_ => {
        deleteJingLiuController(this.fakeData[scope.$index].id).then(res => {
          if (res.code === 200) {
            // this.fakeData.splice(scope.$index, 1)
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      .catch(_ => {})
    },
    modifyItem (scope, dataForm) {
      console.log(scope)
      this.isModify = true
      this.modifyIdx = scope.$index
      this.dialogTitle = "编辑"
      if (scope.row.ztype) {
        getJingLiuById(scope.row.id).then(res => {
          console.log(res, 'getJingLiuById')
          if (res.code === 200) {
            res.data.nongdi = res.data.nongdi ? res.data.nongdi : {}
            res.data.lindi = res.data.lindi ? res.data.lindi : {}
            res.data.guancaodi = res.data.guancaodi ? res.data.guancaodi : {}
            if (res.data.representStation) {
              res.data.representStation = res.data.representStation.id
            }
            this.stationOptions = []
            this.stationMap = {}
            for (let i = 0; i < res.data.stationList.length; ++i) {
              this.stationMap[res.data.stationList[i].id] = res.data.stationList[i].stationname
              this.stationOptions.push({
                value: res.data.stationList[i].id,
                label: res.data.stationList[i].stationname
              })
            }
            this.newItem = res.data
          }
        })
      } else {
        this.newItem.jingliu = Object.assign({}, this.fakeData[scope.$index])
        this.newItem.nongdi = {}
        this.newItem.lindi = {}
        this.newItem.guancaodi = {}
      }
      try {
        this.fileList = JSON.parse(this.newItem.jingliu.image)
        for (let i = 0; i < this.fileList.length; ++i) {
          this.fileMap[this.fileList[i].name] = this.fileList[i].url
        }
      } catch (err) {
        this.fileList = []
      }
      this.dialogProjectVisible = true
      if (this.$refs[dataForm]) {
        this.$refs[dataForm].clearValidate();
      }
    },
    toString (stamp) {
      var now = stamp
      if (!(stamp instanceof Date)) {
        now = new Date(stamp)
      }
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      // return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
      return year + "-" + month + "-" + date
    },
    serchByValue () {
      this.currentPage = 0
      this.getData()
    }
  }
}
</script>

<style scoped>
.el-collapse {
  border-bottom: none;
  margin-bottom: 22px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
/deep/.el-upload--picture-card {
  /* text-align: center; */
  width: 100px;
  height: 100px;
}
.el-upload--picture-card i {
  position: relative;
  top: -20px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>
