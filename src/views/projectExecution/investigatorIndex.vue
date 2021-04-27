<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="小流域编码" style="width: 200px;" class="filter-item" v-model="searchValue1" />
      <el-input placeholder="小流域位置" style="width: 200px;" class="filter-item" v-model="searchValue2" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="serchByValue()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;" :row-class-name="tableRowClassName">
      <el-table-column align="center" label="小流域编码" min-width="100px" fixed>
        <template slot-scope="{row}">
          <el-button type="text">{{row.code }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="小流域卡口位置" min-width="150px" fixed>
        <template slot-scope="{row}">{{row.location }}</template>
      </el-table-column>

      <el-table-column align="center" label="经度" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="纬度" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.latitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="海拔" min-width="80px">
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
      <el-table-column align="center" label="所有植被覆盖采集点" min-width="110px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="getStationsInfo(row.id, 2)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所有土壤水分温度采集点" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="getStationsInfo(row.id, 3)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平均海拔" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.averageAltitude}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最高海拔" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.highestAltitude}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最低海拔" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.lowestAltitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流域面积" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.drainageArea}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流域长度" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.basinLength}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="沟壑密度" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.gullyDensity}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流域形状系数" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.basinShapeFactor}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="主沟道纵比降" min-width="120px">
        <template slot-scope="{row}">
          <span>{{row.mainChannelVerticalGradient}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="流域特征" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.drainageCharacteristic}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="坡度分级" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.slopeClassification}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="土地利用结构" min-width="150px">
        <template slot-scope="{row}">
          <span>{{row.landUseStructure}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="130px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="setExtraInfo(row.climaticCharacteristics, 1)">气候特征</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="190px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="setExtraInfo(row.soilErosion, 2)">土壤与土壤侵蚀状况</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="190px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="setExtraInfo(row.socioeconomicStatus, 3)">社会经济状况</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
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

    <el-dialog :close-on-click-modal="false" title="图片" :visible.sync="dialogFormVisible" align="center" width="60%">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item, idx) in imgList" :key="idx">
          <img :src="item" style="height:400px;max-width:100%;">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="infoListTitle" :visible.sync="stationDialogVisible" width="30%">
      <div>
        <ul>
          <li v-for="(station, idx) in stations" :key="idx">
            {{station}}
          </li>
        </ul>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" align="center" :title="extraInfoTitle" :visible.sync="extraInfoDialogVisible" :top="extraInfoDialogTop">
      <el-form ref="dataForm1" label-position="left" :label-width="extraInfoDialogLabelWidth" style="width: 500px;">
        <el-form-item v-for="(item, idx) in extraInfo" :key="extraInfoTitle + idx.toString()" :label="item.label">
          <el-input :value="item.value" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="extraInfoDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <div>
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible" top="0" @close="beforeDialogClose">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="1">
            <el-form :model="newItem" :rules="rules" ref="dataForm" label-position="left" label-width="120px" style="width: 500px; margin-left:50px;">
              <el-form-item label="小流域编码" prop="code" v-if="isModify">
                <el-input v-model="newItem.code" maxlength="15" placeholder="请输入小流域编码" disabled/>
              </el-form-item>
              <el-form-item label="小流域编码" prop="code" v-else>
                <el-input v-model="newItem.code" maxlength="15" placeholder="请输入小流域编码" />
              </el-form-item>
              <el-form-item label="小流域卡口位置" prop="location">
                <el-input v-model="newItem.location" placeholder="请输入小流域位置" />
              </el-form-item>
              <el-form-item label="经度" prop="longitude">
                <el-input v-model="newItem.longitude" placeholder="请输入经度" />
              </el-form-item>
              <el-form-item label="纬度" prop="latitude">
                <el-input v-model="newItem.latitude" placeholder="请输入纬度" />
              </el-form-item>
              <el-form-item label="海拔" prop="altitude">
                <el-input v-model="newItem.altitude" placeholder="请输入海拔,单位：m(米)" />
              </el-form-item>
              <el-form-item label="代表雨量站" v-if="isModify" prop="representStation">
                <el-select v-model="newItem.representStation" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in stationOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="图片" prop="">
                <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed" :file-list="fileList" list-type="picture-card" :action="pathToUploadImage" :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange" :on-remove="handleRemove" multiple>
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="平均海拔" prop="averageAltitude">
                <el-input v-model="newItem.averageAltitude" placeholder="请输入平均海拔,单位：m(米)" />
              </el-form-item>
              <el-form-item label="最高海拔" prop="highestAltitude">
                <el-input v-model="newItem.highestAltitude" placeholder="请输入最高海拔,单位：m(米)" />
              </el-form-item>
              <el-form-item label="最低海拔" prop="lowestAltitude">
                <el-input v-model="newItem.lowestAltitude" placeholder="请输入最低海拔,单位：m(米)" />
              </el-form-item>
              <el-form-item label="流域面积" prop="drainageArea">
                <el-input v-model="newItem.drainageArea" placeholder="请输入流域面积,单位：㎡(平方米)" />
              </el-form-item>
              <el-form-item label="流域长度" prop="basinLength">
                <el-input v-model="newItem.basinLength" placeholder="请输入流域长度,单位：m(米)" />
              </el-form-item>
              <el-form-item label="沟壑密度" prop="gullyDensity">
                <el-input v-model="newItem.gullyDensity" placeholder="请输入沟壑密度,单位：kg/m³(千克每立方米)" />
              </el-form-item>
              <el-form-item label="流域形状系数" prop="basinShapeFactor">
                <el-input v-model="newItem.basinShapeFactor" placeholder="请输入流域形状系数" />
              </el-form-item>
              <el-form-item label="主沟道纵比降" prop="mainChannelVerticalGradient">
                <el-input v-model="newItem.mainChannelVerticalGradient" placeholder="请输入主沟道纵比降" />
              </el-form-item>
              <el-form-item label="流域特征" prop="drainageCharacteristic">
                <el-input v-model="newItem.drainageCharacteristic" placeholder="请输入流域特征" />
              </el-form-item>
              <el-form-item label="坡度分级" prop="slopeClassification">
                <el-input v-model="newItem.slopeClassification" placeholder="请输入坡度分级" />
              </el-form-item>
              <el-form-item label="土地利用结构" prop="landUseStructure">
                <el-input type="textarea" rows="5" v-model="newItem.landUseStructure" placeholder="请输入土地利用结构" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="气候特征" name="2">
            <el-form :model="newItem.climaticCharacteristics" :rules="rules" ref="dataForm.climaticCharacteristics" label-position="left" label-width="120px" style="width: 500px; margin-left:80px;">
              <el-form-item label="大于10℃积温" prop="accumulatedTemperature">
                <el-input v-model="newItem.climaticCharacteristics.accumulatedTemperature" placeholder="请输入大于10℃积温" />
              </el-form-item>
              <el-form-item label="年平均温度" prop="annualAverageTemperature">
                <el-input v-model="newItem.climaticCharacteristics.annualAverageTemperature" placeholder="请输入年平均温度,单位：℃(摄氏度)" />
              </el-form-item>
              <el-form-item label="年蒸发量" prop="annualEvaporation">
                <el-input v-model="newItem.climaticCharacteristics.annualEvaporation" placeholder="请输入年蒸发量" />
              </el-form-item>
              <el-form-item label="年最高温度" prop="annualMaximumTemperature">
                <el-input v-model="newItem.climaticCharacteristics.annualMaximumTemperature" placeholder="请输入年最高温度,单位：℃(摄氏度)" />
              </el-form-item>
              <el-form-item label="年最低温度" prop="annualMinimumTemperature">
                <el-input v-model="newItem.climaticCharacteristics.annualMinimumTemperature" placeholder="请输入年最低温度,单位：℃(摄氏度)" />
              </el-form-item>
              <el-form-item label="年均降雨量" prop="averageAnnualPrecipitation">
                <el-input v-model="newItem.climaticCharacteristics.averageAnnualPrecipitation" placeholder="请输入年最低温度,单位：mm(毫米)" />
              </el-form-item>
              <el-form-item label="无霜期" prop="frostFreeSeason">
                <el-input v-model="newItem.climaticCharacteristics.frostFreeSeason" placeholder="请输入无霜期" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="土壤与土壤侵蚀状况" name="3">
            <el-form :model="newItem.soilErosion" :rules="rules" ref="dataForm.soilErosion" label-position="left" label-width="140px" style="width: 500px; margin-left:80px;">
              <el-form-item label="平均土层厚度" prop="averageSoilThickness">
                <el-input v-model="newItem.soilErosion.averageSoilThickness" placeholder="请输入平均土层厚度" />
              </el-form-item>
              <el-form-item label="流域平均输沙模数" prop="averageSedimentRunoffModulusOfDrainageBasin">
                <el-input v-model="newItem.soilErosion.averageSedimentRunoffModulusOfDrainageBasin" placeholder="流域平均输沙模数" />
              </el-form-item>
              <el-form-item label="土壤侵蚀模数" prop="soilErosionModulus">
                <el-input v-model="newItem.soilErosion.soilErosionModulus" placeholder="土壤侵蚀模数" />
              </el-form-item>
              <el-form-item label="流域综合治理度" prop="comprehensiveReclamationOfRiverBasin">
                <el-input v-model="newItem.soilErosion.comprehensiveReclamationOfRiverBasin" placeholder="流域综合治理度" />
              </el-form-item>
              <el-form-item label="主要土壤类型" prop="mainSoilType">
                <el-input type="textarea" rows="5" v-model="newItem.soilErosion.mainSoilType" placeholder="主要土壤类型" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="社会经济状况" name="4">
            <el-form :model="newItem.socioeconomicStatus" :rules="rules" ref="dataForm.socioeconomicStatus" label-position="left" label-width="140px" style="width: 500px; margin-left:80px;">
              <el-form-item label="流域内人口数" prop="peopleNum">
                <el-input v-model="newItem.socioeconomicStatus.peopleNum" placeholder="流域内人口数" />
              </el-form-item>
              <el-form-item label="流域内劳动力人口数" prop="laborForseNum">
                <el-input v-model="newItem.socioeconomicStatus.laborForseNum" placeholder="流域内劳动力人口数" />
              </el-form-item>
              <el-form-item label="平均粮食单产" prop="yieldOfGrain">
                <el-input v-model="newItem.socioeconomicStatus.yieldOfGrain" placeholder="平均粮食单产" />
              </el-form-item>
              <el-form-item label="农村生产总值" prop="ruralgdp">
                <el-input v-model="newItem.socioeconomicStatus.ruralgdp" placeholder="农村生产总值" />
              </el-form-item>
              <el-form-item label="人均基本农田" prop="farmLand">
                <el-input v-model="newItem.socioeconomicStatus.farmLand" placeholder="人均基本农田" />
              </el-form-item>
              <el-form-item label="人均纯收入" prop="income">
                <el-input v-model="newItem.socioeconomicStatus.income" placeholder="人均纯收入" />
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onComfirm('dataForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pathToUploadImage from '@/api/projectExcution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getAllMinorDrainageBasin, addMinorDrainageBasin, modifyMinorDrainageBasin, deleteMinorDrainageBasin, searchMinorDrainageBasin, getBasinById, setBasinRepresentStation } from '@/api/projectExcution'

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
      else if (!reg.test(value)) {
        callback(new Error('请输入(-180°,+180°)内的值'));
      }
      else if (!(/^[0-9]+(.[0-9]{1,6})?$/.test(value))) {
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
      else if (!reg.test(value)) {
        callback(new Error('请输入(-90°,+90°)内的值'));
      }
      else if (!(/^[0-9]+(.[0-9]{1,6})?$/.test(value))) {
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
        callback(new Error('请输入站点编码'));
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
    var valiNumberPass6 = (rule, value, callback) => {//整数数字
      // let reg = /^[0-9]+(.[0-9]{1,4})?$/;
      console.log("#####" + value + "##########")
      let reg = /^[0-9]{1,8}$/;
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
      stationMap: {},
      stationDialogVisible: false,
      dialogFormVisible: false,
      stationOptions: [],
      activeNames: ['1'],
      climaticCharacteristics: {},
      extraInfoTitle: '',
      dialogVisibleClimate: false,
      extraInfoDialogVisible: false,
      extraInfoDialogTop: "0",
      extraInfoDialogLabelWidth: "100px",
      extraInfo: [],
      tableKey: 0,
      searchValue1: "",
      searchValue2: "",
      newItem: {
        code: '',
        location: '',
        longitude: '',
        latitude: '',
        altitude: '',
        averageAltitude: '',
        highestAltitude: '',
        lowestAltitude: '',
        drainageArea: '',
        basinLength: '',
        gullyDensity: '',
        basinShapeFactor: '',
        mainChannelVerticalGradient: '',
        drainageCharacteristic: '',
        slopeClassification: '',
        landUseStructure: '',
        soilErosion: {
          averageSoilThickness: '',
          averageSedimentRunoffModulusOfDrainageBasin: '',
          soilErosionModulus: '',
          comprehensiveReclamationOfRiverBasin: '',
          mainSoilType: ''
        },
        socioeconomicStatus: {
          peopleNum: '',
          laborForseNum: '',
          yieldOfGrain: '',
          ruralgdp: '',
          farmLand: '',
          income: ''
        },
        climaticCharacteristics: {
          accumulatedTemperature: '',
          annualAverageTemperature: '',
          annualEvaporation: '',
          annualMaximumTemperature: '',
          annualMinimumTemperature: '',
          averageAnnualPrecipitation: '',
          frostFreeSeason: ''
        }
      },
      rules: {
        code: [
          { required: true, message: '请输入小流域编码', trigger: 'blur' },
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
        location: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        // averageAltitude:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        // highestAltitude:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        // lowestAltitude:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        // drainageArea:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        // basinLength:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        // gullyDensity:[
        //   { required: true,validator:valiNumberPass3, trigger: 'blur' }
        // ],
        accumulatedTemperature:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],
        annualAverageTemperature:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],
        annualEvaporation:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],
        annualMaximumTemperature:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],
        annualMinimumTemperature:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],

        averageSoilThickness:[
          { required: false,validator:valiNumberPass5, trigger: 'blur' }
        ],

        peopleNum: [
          { required: false,validator:valiNumberPass6, trigger: 'blur' }
        ],
          laborForseNum:[
          { required: false,validator:valiNumberPass6, trigger: 'blur' }
        ]
      },
      fakeData: [
      ],
      // dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      details: '',
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      searchValue1: "",
      searchValue2: "",
      defaultVal: {
        altitude: 0,
        averageAltitude: 0,
        basinLength: 0,
        basinShapeFactor: 0,
        climaticCharacteristics: {},
        drainageArea: 0,
        drainageCharacteristic: 0,
        feild1: "",
        gullyDensity: 0,
        highestAltitude: 0,
        landUseStructure: "",
        latitude: 0,
        location: "",
        longitude: 0,
        lowestAltitude: 0,
        mainChannelVerticalGradient: 0,
        slopeClassification: 0,
        socioeconomicStatus: {},
        soilErosion: {}
      }
    }
  },
  created () {
    // console.log(this.$route.params.page, this.$route.params.idx)
    this.currentPage = (this.$route.params && this.$route.params.hasOwnProperty('page')) ? this.$route.params.page : 0
    this.getData()
  },
  methods: {
    getStationsInfo(id, cate) {
      getBasinById(id).then(res => {
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
    beforeDialogClose () {
      this.fileList = []
      this.fileMap = {}
      this.$refs.uploadImg.clearFiles()
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
      searchMinorDrainageBasin(this.searchValue1, this.searchValue2, this.currentPage, 10).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      })
    },
    getRepresentation (row) {
      return row.representStation ? row.representStation.stationname : ''
    },
    setExtraInfo (info, ttype) {
      this.extraInfoDialogVisible = true
      let cols = []
      let names = []
      switch (ttype) {
        case 1:
          this.extraInfoTitle = "气候特征"
          this.extraInfoDialogTop = "80px"
          this.extraInfoDialogLabelWidth = "100px"
          cols = ['accumulatedTemperature', 'annualAverageTemperature', 'annualEvaporation', 'annualMaximumTemperature', 'annualMinimumTemperature', 'averageAnnualPrecipitation', 'frostFreeSeason']
          names = ['大于10℃积温', '年平均温度', '年蒸发量', '年最高温度', '年最低温度', '年均降雨量', '无霜期']
          break
        case 2:
          this.extraInfoTitle = "土壤与土壤侵蚀状况"
          this.extraInfoDialogTop = "120px"
          this.extraInfoDialogLabelWidth = "130px"
          cols = ['mainSoilType', 'averageSoilThickness', 'averageSedimentRunoffModulusOfDrainageBasin', 'soilErosionModulus', 'comprehensiveReclamationOfRiverBasin']
          names = ['主要土壤类型', '平均土层厚度', '流域平均输沙模数', '土壤侵蚀模数', '流域综合治理度']
          break
        case 3:
          this.extraInfoTitle = "社会经济状况"
          this.extraInfoDialogTop = "120px"
          this.extraInfoDialogLabelWidth = "140px"
          cols = ['peopleNum', 'laborForseNum', 'yieldOfGrain', 'ruralgdp', 'farmLand', 'income']
          names = ['流域内人口数', '流域内劳动力人口数', '平均粮食单产', '农村生产总值', '人均基本农田', '人均纯收入']
          break
      }
      this.extraInfo = []
      for (let i = 0; i < cols.length; ++i) {
        this.extraInfo.push({
          label: names[i],
          value: info[cols[i]]
        })
      }
    },
    onComfirm (dataForm) {
      let imgs = []
      for (let i = 0; i < this.fileList.length; ++i) {
        imgs.push({
          name: this.fileList[i].name,
          url: this.fileMap[this.fileList[i].name]
        })
      }
      this.newItem.image = JSON.stringify(imgs)
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          if (this.isModify) {
            let newRepresentStation = this.newItem.representStation
            // console.log('aaaaaaanewRepresentStation', newRepresentStation)
            // console.log(this.newItem)
            if (newRepresentStation) {
              setBasinRepresentStation(this.newItem.id, newRepresentStation).then(res => {
                // console.log('setBasinRepresentStation', res)
                if (res.code === 200) {
                  this.newItem.representStation = {
                    stationname: this.stationMap[newRepresentStation]
                  }
                } else {
                  this.$message.error('代表站设置失败！');
                }
              })
            }
            this.newItem.representStation = {}
            modifyMinorDrainageBasin(this.newItem).then(res => {
              // console.log('modifyMinorDrainageBasin', res)
              if (res.code === 200) {
                // this.fakeData[this.modifyIdx] = Object.assign({}, this.newItem)
                this.getData()
                this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
                this.dialogProjectVisible = false
              }
            })
          } else {
            if ((this.newItem.code === undefined) || (this.newItem.code === "")) {
              this.$message.error('小流域编号不能为空！');
            } else {
              // console.log(this.newItem, 'newItem')
              addMinorDrainageBasin(this.newItem).then(res => {
                // console.log(res)
                if (res.code === 200) {
                  // this.newItem.id = res.data
                  // this.fakeData.push(this.newItem)
                  this.getData()
                  // this.newItem = {
                  //   soilErosion: {},
                  //   socioeconomicStatus: {},
                  //   climaticCharacteristics: {}
                  // }
                  this.dialogProjectVisible = false
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
        soilErosion: {},
        socioeconomicStatus: {},
        climaticCharacteristics: {}
      }
      this.activeNames = ['1']
      this.isModify = false
      this.dialogProjectVisible = true
      this.dialogTitle = "新增"
      if (this.$refs[dataForm]) {
        this.$refs[dataForm].clearValidate();
      }
    },
    deleteItem (scope) {
      this.$confirm('您确定要删除这条数据吗？')
      .then(_ => {
        deleteMinorDrainageBasin(this.fakeData[scope.$index].id).then(res => {
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
      this.activeNames = ['1']
      this.isModify = true
      this.modifyIdx = scope.$index
      // this.newItem = Object.assign({},this.fakeData[scope.$index])
      // this.dialogProjectVisible= true
      this.dialogTitle = "编辑"
      getBasinById(scope.row.id).then(res => {
        if (res.code === 200) {
          if (res.data.representStation) {
            res.data.minorDrainageBasin.representStation = res.data.representStation.id
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
          this.newItem = res.data.minorDrainageBasin
          try {
            this.fileList = JSON.parse(this.newItem.image)
            for (let i = 0; i < this.fileList.length; ++i) {
              this.fileMap[this.fileList[i].name] = this.fileList[i].url
            }
          } catch (err) {
            this.fileList = []
          }
          this.dialogProjectVisible = true
        }
      })
      if (this.$refs[dataForm]) {
        this.$refs[dataForm].clearValidate();
      }
    },
    serchByValue () {
      this.currentPage = 0
      this.getData()
    }
  }
}
</script>

<style scoped>
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
