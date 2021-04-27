<template>
  <div>
    <div class="app-container" v-show="!ifShowWeirTankDetail">
      <div class="filter-container">
        <el-input placeholder="流域控制站编号" style="width: 200px;" class="filter-item" v-model="searchValue1" />
        <el-input placeholder="流域控制站名称" style="width: 200px;" class="filter-item" v-model="searchValue2" />
        <el-input placeholder="流域控制站位置" style="width: 200px;" class="filter-item" v-model="searchValue3" />
        <el-input placeholder="流域控制站建站年份" style="width: 200px;" class="filter-item" v-model="searchValue4" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchByCode()">查询</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
        <el-button v-waves class="filter-item" type="primary"><a type="primary" :href="currentUrl">下载</a></el-button>
      </div>
      <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="流域控制站编号" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="text">{{row.code }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="流域控制站名称" min-width="130px">
          <template slot-scope="{row}">
            <el-button type="text">{{ row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="位置描述" min-width="120px">
          <template slot-scope="{row}">
            <el-button type="text">{{ row.location }}</el-button>
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
        <el-table-column align="center" label="所属小流域" min-width="120px">
          <template slot-scope="{row}">
            <span>{{getBasinName(row.minorDrainageBasinId)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="控制面积（km²）" min-width="120px">
          <template slot-scope="{row}">
            <span>{{row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="堰/槽类型编号" min-width="120px">
          <template slot-scope="{row}">
            <span>{{row.weirTypeCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="堰/槽类型名称" min-width="120px">
          <template slot-scope="{row}">
            <span>{{row.weirTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="堰槽参数" min-width="120px">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="goWeirTankDetailPage(row.id)">管理</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代表雨量站编号" min-width="120px">
          <template slot-scope="{row}">
            <span>{{row.RepresentStationCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="建设时间（年/月）" min-width="100px">
          <template slot-scope="{row}">
            <span>{{row.setupTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" min-width="120px">
          <template slot-scope="{row}">
            <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="说明" min-width="120px">
          <template slot-scope="{row}">
            <span>{{row.note}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作 " align="center" width="180">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="modifyItem(scope,'dataForm')">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="currentPage + 1"
                     v-if="totalElements"
                     background
                     :page-size="10"
                     layout="prev, pager, next"
                     :total="totalElements"
                     @current-change="onPageChange">
      </el-pagination>
      <el-dialog :close-on-click-modal="false"
                 title="图片"
                 :visible.sync="dialogFormVisible"
                 align="center"
                 width="60%">
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="(item, idx) in imgList" :key="idx">
            <img :src="item" style="height:400px;max-width:100%;">
          </el-carousel-item>
        </el-carousel>
      </el-dialog>
      <el-dialog :close-on-click-modal="false"
                 :title="dialogTitle"
                 :visible.sync="dialogProjectVisible"
                 top="0"
                 @close="beforeDialogClose">
        <el-form :model="newItem" :rules="rules" ref="dataForm" label-position="left" label-width="100px" style="width: 450px; margin-left:50px;">
          <el-form-item label="流域控制站编号" prop="code" v-if="isModify">
            <el-input v-model="newItem.code" maxlength="15" placeholder="请输入站点编码" disabled/>
          </el-form-item>
          <el-form-item label="流域控制站编号" prop="code" v-else>
            <el-input v-model="newItem.code" maxlength="15" placeholder="请输入站点编码" />
          </el-form-item>
          <el-form-item label="流域控制站名称" prop="name">
            <el-input v-model="newItem.name" placeholder="请输入站点名称" />
          </el-form-item>
          <el-form-item label="位置描述" prop="location">
            <el-input v-model="newItem.location" placeholder="请输入站点位置" />
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
          <el-form-item label="所属小流域" prop="minor_drainage_basin_id">
            <el-select v-model="newItem.minorDrainageBasinId" placeholder="请选择">
              <el-option v-for="item in basinOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="控制面积（km²）" prop="area">
            <el-input v-model="newItem.area" placeholder="请输入海拔,单位：m(米)" />
          </el-form-item>
          <el-form-item label="图片" prop="">
            <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed" :file-list="fileList" list-type="picture-card" :action="pathToUploadImage" :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange" :on-remove="handleRemove" multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="堰槽类型" prop="equipmentType">
            <el-select v-model="weirTypeValue" placeholder="请选择" multiple>
              <el-option v-for="item in weirType" :key="item.weirTypeId" :label="item.weirTypeName" :value="item.weirTypeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="代表雨量站编号" prop="RepresentStationCode">
            <el-input v-model="newItem.RepresentStationCode" placeholder="" />
          </el-form-item>
          <el-form-item label="说明" prop="note">
            <el-input v-model="newItem.note" placeholder="" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onComfirm('dataForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <weir-tank-detail v-if="ifShowWeirTankDetail"
                      :watershedManagementStationId.sync="watershedManagementStationId"
                      v-on:backToMainPageAndHideWeirTankDetail="getWeirTankDetailDisplayParam">
    </weir-tank-detail>
  </div>
</template>

<script>
import pathToUploadImage from '@/api/projectExcution'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getAllMinorDrainageBasinController, deleteMinorDrainageBasinController,
    addMinorDrainageBasinController, modifyMinorDrainageBasinController, getWeirType,
    searchMinorDrainageBasinController, getAlBasins, fetchDict } from '@/api/projectExcution'
import WeirTankDetail from "./weirTankDetail";

export default {
  name: "soilTempreture",
  components: {WeirTankDetail, Pagination },
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
    return {
      watershedManagementStationId: '',
      currentUrl:process.env.VUE_APP_BUSINESS_API + 'exportPageInfo/weirAndTroughInfo',
      weirType: [],
      weirTypeValue: '',
      ifShowWeirTankDetail: false,
      weirTypeDict: {},
      pathToUploadImage: '',
      imgList: [],
      fileList: [],
      fileMap: {},
      totalElements: 0,
      currentPage: 0,
      dialogFormVisible: false,
      tableKey: 0,
      newItem: {
        code: '',
        name: '',
        location: '',
        longitude: '',
        latitude: '',
        altitude: '',
        setupTime: '',
        currentFacility: '',
      },
      fakeData: [
      ],
      details: "",
      // dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      value: '',
      defaultVal: {
        yearOfBuild: "",
        latitude: 0,
        longitude: 0,
        altitude: 0,
        currentFacility: "",
        location: "",
        name: "",
        minorDrainageBasinId: "1"
      },
      searchValue1: "",
      searchValue2: "",
      searchValue3: "",
      searchValue4: "",
      basinOptions: [],
      basin: {},
      searchState: false,
      options: [
        {
          value: 1,
          label: '三角形薄壁堰'
        },
        {
          value: 2,
          label: '矩形薄壁堰'
        },
        {
          value: 3,
          label: '梯形薄壁堰'
        }
      ],
      rules: {
        code: [
          { required: true, message:'请输入站点编码', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{8}$/, message: '必须是8位数字', trigger: 'blur' }
        ],
        name: [
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
        location: [
          { required: true, message: '请输入测流设备', trigger: 'blur' },
        ],
        // setupTime:[
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // currentFacility:[
        //   { required: true, message: '请输入测流设备', trigger: 'blur' },
        //   { min: 0, max: 100, message: '长度在 20个字符以内', trigger: 'blur' }
        // ]
      }
    }
  },
  created () {
    fetchDict("WeirType").then(res => {
      this.options = []
      for (var i = 0; i < res.length; ++i) {
        this.weirTypeDict[res[i].value] = res[i].label
        this.options.push({
          value: parseInt(res[i].value),
          label: res[i].label
        })
      }
    })
    let compare = function (obj1, obj2) {
      var val1 = obj1.label;
      var val2 = obj2.label;
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }
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
        this.basinOptions = this.basinOptions.sort(compare)
        // console.log('basin', this.basin, this.basinOptions)
      }
    })
    this.getData();
    this.getWeirType();
  },
  methods: {
    getWeirTankDetailDisplayParam (data) {
        this.ifShowWeirTankDetail = data;
    },
    goWeirTankDetailPage (itemId) {
        this.watershedManagementStationId = itemId;
        this.ifShowWeirTankDetail = true;
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
    getBasinName (id) {
      return this.basin.hasOwnProperty(id) ? this.basin[id] : ''
    },
    onPageChange (page) {
      this.currentPage = page - 1
      this.getData()
    },
    getData () {
      // if (this.searchState) {
      searchMinorDrainageBasinController(this.searchValue1, this.searchValue2, this.searchValue3,
          this.searchValue4, this.currentPage, 10).then(res => {
        // console.log(res, 'res')
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          let data = res.data.content
          this.fakeData = []
          for (let i = 0; i < data.length; ++i) {
            if (!data[i].status) {
              if (data[i].yearOfBuild) {
                data[i].setupTime = this.toString(data[i].yearOfBuild)
              } else {
                data[i].yearOfBuild = ""
              }
              this.fakeData.push(data[i])
            }
          }
        }
      })
    },
    getWeirType() {
        getWeirType().then(res => {
            this.weirType = res.data;
        })
    },
    getTypeName (type) {
      // return {
      //   1: '三角形薄壁堰',
      //   2: '矩形薄壁堰',
      //   3: '梯形薄壁堰'
      // }[type]
      return this.weirTypeDict[type]
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
            if (this.checkDate()) {
              console.log(this.newItem, 'modifyItem')
              modifyMinorDrainageBasinController(this.newItem).then(res => {
                console.log(res)
                if (res.code === 200) {
                  this.fakeData[this.modifyIdx] = this.newItem
                  this.newItem = {}
                  this.dialogProjectVisible = false
                }
              })
            }
          } else {
            if ((this.newItem.code === undefined) || (this.newItem.code === "")) {
              this.$message.error('站点编码不能为空！');
            } else {
              if (this.checkDate()) {
                for (let key in this.defaultVal) {
                  if (this.newItem[key] === undefined) {
                    this.newItem[key] = this.defaultVal[key]
                  }
                }
                console.log(this.newItem, 'newItem')
                addMinorDrainageBasinController(this.newItem).then(res => {
                  console.log(res)
                  if (res.code === 200) {
                    // this.fakeData.push(this.newItem)
                    this.getData()
                    this.newItem = {}
                    this.dialogProjectVisible = false
                  } else {
                    this.$message.error('站点编码已存在！');
                  }
                })
              }
            }
          }
        } else {
          this.$message.error('请补充信息！');
          return false;
        }
      })
    },
    addNewItem (dataForm) {
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
        deleteMinorDrainageBasinController(this.fakeData[scope.$index].id, 1).then(res => {
          console.log(res)
          if (res.code === 200) {
            // let obj = this.fakeData[scope.$index]
            // obj.status = 1
            // this.fakeData.splice(scope.$index, 1, obj)
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
    checkDate () {
      let setupTime = this.newItem.setupTime
      console.log('setupTime', setupTime)
      if (setupTime === "" || setupTime === undefined || setupTime === null) {
        // this.newItem.yearOfBuild = new Date()
        // console.log(this.newItem.yearOfBuild)
      } else {
        if (isNaN(setupTime)) {
          let tmp = Date.parse(setupTime)
          if (isNaN(tmp)) {
            this.$message.error("日期格式错误！")
            return false
          } else {
            this.newItem.yearOfBuild = new Date(tmp)
          }
        } else {
          this.$message.error("日期格式错误！")
          return false
        }
        this.newItem.setupTime = this.toString(this.newItem.yearOfBuild)
      }
      return true
    },
    checkDate () {
      let setupTime = this.newItem.setupTime
      if (setupTime === "" || setupTime === undefined || setupTime === null) {
        // this.newItem.yearOfBuild = new Date()
        // console.log(this.newItem.yearOfBuild)
      } else {
        if (isNaN(setupTime)) {
          let tmp = Date.parse(setupTime)
          if (isNaN(tmp)) {
            this.$message.error("日期格式错误！")
            return false
          } else {
            this.newItem.yearOfBuild = new Date(tmp)
          }
        } else {
          this.$message.error("日期格式错误！")
          return false
        }
        this.newItem.setupTime = this.toString(this.newItem.yearOfBuild)
      }
      return true
    },
    searchByCode () {
      this.currentPage = 0
      // this.searchState = (!this.searchValue1.length && !this.searchValue2.length && !this.searchValue3.length && !this.searchValue4.length) ? false : true
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
</style>
