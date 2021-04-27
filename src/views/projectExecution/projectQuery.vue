<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="雨量站名称" style="width: 200px;" class="filter-item" v-model="searchValue1" />
      <el-input placeholder="设备编码" style="width: 200px;" class="filter-item" v-model="searchValue2" />
      <el-select v-model="sortValue" placeholder="排序方式" value="" class="filter-item">
        <el-option
          v-for="item in this.sortCondition"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchByName()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
      <el-button v-waves class="filter-item" type="primary"><a type="primary" :href="currentUrl">下载</a></el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" ref="fakeData" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="站点编号" min-width="80px" fixed>
        <template slot-scope="{row}">
          <el-button type="text">{{row.stationcode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点名称" min-width="150px" fixed>
        <template slot-scope="{row}">
          <el-button type="text">{{row.stationname }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经度（°）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="纬度（°）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.latitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="海拔（m）" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.altitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备编号" min-width="80px">
        <template slot-scope="{row}">
          <span>{{getDeviceCode(row.deviceid)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备名称" min-width="80px">
        <template slot-scope="{row}">
          <span>{{getDeviceName(row.deviceid)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属小流域" min-width="120px">
        <template slot-scope="{row}">
          <span>{{getBasinName(row.minor_drainage_basin_id)}}</span>
          <el-button v-if="row.minor_drainage_basin_id" type="text" @click="showMinorDrainageBasin(row.minor_drainage_basin_id)"><i class="el-icon-view el-icon--right"></i></el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属径流小区" min-width="120px">
        <template slot-scope="{row}">
          <span v-for="item in row.jingliuIds" @click="showJingliu(item)" class="jingliu_link">{{getJingLiuName(item)}}</span>
<!--          <el-button v-if="row.jingliu_id" type="text" @click="showJingliu(row.jingliu_id)"><i class="el-icon-view el-icon&#45;&#45;right"></i></el-button>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="设立时间（年/月）" min-width="100px">
        <template slot-scope="{row}">
          <span>{{getStartDate(row.yearOfBuild)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="说明" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="dialogVisible = true;details=row.notes">查看说明</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作 " align="center" width="200" fixed="right">
        <template slot-scope="scope">
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

    <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="dialogVisible" width="30%">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="details" placeholder="请输入内容" rows="8" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <div>
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible" top="0" @close="beforeDialogClose">
        <el-form :model="newItem" :rules="rules" ref="dataForm" label-position="left" label-width="110px" style="width: 680px;">
          <el-form-item label="站点编号" prop="stationcode" v-if="isModify">
            <el-input v-model="newItem.stationcode" maxlength="15" placeholder="请输入站点编码" disabled/>
          </el-form-item>
          <el-form-item label="站点编号" prop="stationcode" v-else>
            <el-input v-model="newItem.stationcode" maxlength="15" placeholder="请输入站点编码" />
          </el-form-item>
          <el-form-item label="站点名称" prop="stationname">
            <el-input v-model="newItem.stationname" placeholder="请输入站点名称" />
          </el-form-item>
          <el-form-item label="经度（°）" prop="longitude">
            <el-input v-model="newItem.longitude" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度（°）" prop="latitude">
            <el-input v-model="newItem.latitude" placeholder="请输入纬度" />
          </el-form-item>
          <el-form-item label="海拔（m）" prop="altitude">
            <el-input v-model="newItem.altitude" placeholder="请输入海拔,单位：m(米)" />
          </el-form-item>
          <el-form-item label="设备" prop="deviceid">
            <el-select v-model="newItem.deviceid" placeholder="请选择" ref="deviceSelect" :filterable="true">
              <el-option v-for="item in deviceOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请输入搜索编码" v-model="searchCode" class="input-with-select" :clearable="true">
              <el-select slot="prepend" v-model="searchType" placeholder="请选择搜索类型" style="width: 100%;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchDevice()"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="所属径流小区" prop="jingliuIds">
            <el-select v-model="newItem.jingliuIds" multiple placeholder="请选择">
              <el-option label="全选" :value="-1">全选</el-option>
              <el-option v-for="item in jingliuOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属小流域" prop="minor_drainage_basin_id">
            <el-select v-model="newItem.minor_drainage_basin_id" placeholder="请选择">
              <el-option v-for="item in basinOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设立时间（年/月）" prop="yearOfBuild">
            <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            v-model="newItem.yearOfBuild" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="图片" prop="">
            <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed"
                       :file-list="fileList" list-type="picture-card" :action="pathToUploadImage"
                       :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange"
                       :on-remove="handleRemove" multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="说明" prop="notes">
            <el-input type="textarea" rows="5" v-model="newItem.notes" placeholder="请输入.." />
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
import pathToUploadImage from '@/api/projectExcution'
import axios from 'axios'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import {convertDateToYearMonth, convertDateToYearMonthDay} from "../../utils/dateFormat";
import { getAllStation, modifyStation, deleteStation, addStation,
    searchStation, uploadImage, getAllJingLiu, getAlBasins, getDevices,
    fetchDict, searchDeviceByCodeAndType, locateMinorDrainageBasin, locateJingLiu } from '@/api/projectExcution'

export default {
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
        callback(new Error('请输入(-90°,+90°)内的整数或小数'));
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
    return {
      currentUrl:process.env.VUE_APP_BUSINESS_API + 'exportPageInfo/StationInfo',
      sortValue: '',
      sortCondition: [{
          value: '1',
          label: '站点编号'
      }, {
          value: '2',
          label: '站点名称'
      }, {
          value: '3',
          label: '设立时间'
      }],
      allDeviceOptions: [],
      options: [],
      searchCode: '',
      searchType: '',
      pathToUploadImage,
      imgList: [],
      fileList: [],
      fileMap: {},
      totalElements: 0,
      currentPage: 0,
      tableKey: 0,
      newItem: {
        stationcode: '',
        stationname: '',
        longitude: '',
        latitude: '',
        altitude: '',
        deviceid: '',
        deviceName: '',
        // jingliu_id: '',
        jingliuIds: '',
        minor_drainage_basin_id: '',
        notes: ''
      },
      details: "",
      fakeData: [],
      dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      defaultVal: {
        altitude: 0,
        deviceid: 1,
        images: "",
        latitude: 0,
        longitude: 0,
        notes: "",
        stationname: "新的站点"
      },
      searchValue1: "",
      searchValue2: "",
      dialogImageUrl: '',
      jingliuOptions: [],
      basinOptions: [],
      deviceOptions: [],
      jingliu: {},
      basin: {},
      device: {},
      rules: {
        stationcode: [
          { required: true, message:'请输入站点编码', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{0,8}$/, message: '8位数字以内', trigger: 'blur' }
        ],
        stationname: [
          { required: true, message: '请输入站点名称', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 20个字符以内', trigger: 'blur' }
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
        // deviceid: [
        //   { required: true, message: '请输入三位数编码', trigger: 'blur' },
        //   // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
        //   // { pattern: /^\d{0,3}$/, message: '必须是3位数字', trigger: 'blur' }
        // ],
        // jingliu_id: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        // minor_drainage_basin_id: [
        //   { required: true, message: '请选择', trigger: 'change' }
        // ],
        deviceid: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    fetchDict("DeviceType").then(res => {
      this.options = []
      this.options.push({
        value: 0,
        label: '无'
      })
      for (var i = 0; i < res.length; ++i) {
        this.options.push({
          value: parseInt(res[i].value),
          label: res[i].label
        })
      }
    })
    getAllJingLiu().then(res => {
      // console.log(res)
      if (res.code === 200) {
        let data = res.data
        for (let i = 0; i < data.length; ++i) {
          this.jingliu[data[i].id] = data[i].code
          this.jingliuOptions.push({
            value: data[i].id,
            label: data[i].code
          })
        }
        this.jingliuOptions = this.jingliuOptions.sort(this.compare)
        this.jingliu[0] = '暂无'
        this.jingliuOptions.unshift({
          value: 0,
          label: '无'
        })
        console.log('jingliu', this.jingliu, this.jingliuOptions)
      }
    })
    getAlBasins().then(res => {
      // console.log(res)
      if (res.code === 200) {
        let data = res.data
        for (let i = 0; i < data.length; ++i) {
          this.basin[data[i].id] = data[i].code
          this.basinOptions.push({
            value: data[i].id,
            label: data[i].code
          })
        }
        this.basinOptions = this.basinOptions.sort(this.compare)
        this.basin[0] = '暂无'
        this.basinOptions.unshift({
          value: 0,
          label: '无'
        })
        // console.log('basin', this.basin, this.basinOptions)
      }
    })
    getDevices().then(res => {
      if (res.code === 200) {
        let data = res.data
        let deviceName
        for (let i = 0; i < data.length; ++i) {
          this.device[data[i].id] = data[i].deviceCode
          deviceName = data[i].id + 'deviceName';
          this.device[deviceName] = data[i].deviceName
          this.deviceOptions.push({
            value: data[i].id,
            label: data[i].deviceCode
          })
        }
        this.deviceOptions = this.deviceOptions.sort(this.compare)
        this.allDeviceOptions = this.deviceOptions
        // console.log('deviceOptions', this.deviceOptions)
      }
    })
    this.getData()
  },
  methods: {
      getStartDate(date) {
        if (date) {
            let temp_date = convertDateToYearMonthDay(date);
            return convertDateToYearMonth(temp_date);
        }
        return date;
    },
    showMinorDrainageBasin (id) {
      locateMinorDrainageBasin(id, 10).then(res => {
        if (res.code === 200) {
          this.$router.push({name: '/projectExecution/investigatorIndex', params: {page: res.data[0], idx: res.data[1]}})
        }
      })
    },
    showJingliu (id) {
      locateJingLiu(id, 10).then(res => {
        if (res.code === 200) {
          this.$router.push({name: '/projectExecution/supervisorReportCheck', params: {page: res.data[0], idx: res.data[1]}})
        }
      })
    },
    compare (obj1, obj2) {
      var val1 = obj1.label;
      var val2 = obj2.label;
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },
    searchDevice () {
      if ((this.searchCode == '') && (this.searchType == '')) {
        this.deviceOptions = this.allDeviceOptions
      } else {
        this.deviceOptions = []
        searchDeviceByCodeAndType(this.searchCode, this.searchType).then(res => {
          if (res.code === 200) {
            let data = res.data
            for (let i = 0; i < data.length; ++i) {
              this.deviceOptions.push({
                value: data[i].id,
                label: data[i].deviceCode
              })
            }
            this.deviceOptions = this.deviceOptions.sort(this.compare)
            this.$refs['deviceSelect'].focus()
          }
        })
      }
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
      this.searchCode = ''
      this.searchType = ''
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
      searchStation(this.searchValue1, this.searchValue2, this.sortValue, this.currentPage, 10).then(res => {
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      })
    },
    getJingLiuName (id) {
      return this.jingliu.hasOwnProperty(id) ? this.jingliu[id] : '暂无'
    },
    getBasinName (id) {
      return this.basin.hasOwnProperty(id) ? this.basin[id] : '暂无'
    },
    getDeviceCode (id) {
        return this.device.hasOwnProperty(id) ? this.device[id] : ''
    },
    getDeviceName (id) {
      let deviceName = id + 'deviceName'
      return this.device.hasOwnProperty(deviceName) ? this.device[deviceName] : ''
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
            modifyStation(this.newItem).then(res => {
              if (res.code === 200) {
                this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
                this.newItem = {}
                this.dialogProjectVisible = false
              }
            })
          } else {
            addStation(this.newItem).then(res => {
              if (res.code === 200) {
                this.getData()
                this.newItem = {}
                this.dialogProjectVisible = false
              } else {
                this.$message.error('站点编码已存在！');
              }
            })
          }
        } else {
          this.$message.error('请补充信息！');
          return false;
        }
      })
    },
    addNewItem (dataForm) {
      this.deviceOptions = this.allDeviceOptions
      this.newItem = {}
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
        deleteStation(this.fakeData[scope.$index].id).then(res => {
          if (res.code === 200) {
            this.getData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      .catch(_ => {})
    },
    modifyItem (scope, dataForm) {
      this.deviceOptions = this.allDeviceOptions
      this.isModify = true
      this.modifyIdx = scope.$index
      this.newItem = Object.assign({}, this.fakeData[scope.$index])
      try {
        this.fileList = JSON.parse(this.newItem.image)
        for (let i = 0; i < this.fileList.length; ++i) {
          this.fileMap[this.fileList[i].name] = this.fileList[i].url
        }
      } catch (err) {
        this.fileList = []
      }
      this.dialogProjectVisible = true
      this.dialogTitle = "编辑"
      if (this.$refs[dataForm]) {
        this.$refs[dataForm].clearValidate();
      }
    },
    searchByName () {
      this.currentPage = 0
      this.getData()
    }
  }
}
</script>

<style scoped>
img {
  display: inline-block;
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

/deep/.el-select .el-input {
  width: 170px;
}
/deep/.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/deep/.el-input-group {
  width: 396px;
}
.jingliu_link {
  padding-right: 10px;
  cursor: pointer;
  color: #1890FF;
}
</style>
