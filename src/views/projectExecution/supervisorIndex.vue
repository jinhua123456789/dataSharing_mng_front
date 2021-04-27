<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="风蚀场名称" style="width: 200px;" class="filter-item" v-model="searchValue" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="serchByValue()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
    </div>

    <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="站点编号" min-width="80px">
        <template slot-scope="{row}">
          <el-button type="text">{{row.windFieldCode }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="站点名称" min-width="80px">
        <template slot-scope="{row}">
          <el-button type="text">{{row.windFieldName }}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="经度" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="纬度" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.latitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="海拔" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.altitude}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备编码" min-width="100px">
        <template slot-scope="{row}">
          <span>{{getDeviceName(row.deviceId)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="土地利用率" min-width="80px">
        <template slot-scope="{row}">
          <span>{{row.ultilization}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属径流小区" min-width="120px">
        <template slot-scope="{row}">
          <span>{{getJingLiuName(row.jingliuId)}}</span>
          <el-button v-if="row.jingliuId" type="text" @click="showJingliu(row.jingliuId)"><i class="el-icon-view el-icon--right"></i></el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所属小流域" min-width="120px">
        <template slot-scope="{row}">
          <span>{{getBasinName(row.minorDrainageBasinId)}}</span>
          <el-button v-if="row.minorDrainageBasinId" type="text" @click="showMinorDrainageBasin(row.minorDrainageBasinId)"><i class="el-icon-view el-icon--right"></i></el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设立时间" min-width="100px">
        <template slot-scope="{row}">
          <span>{{row.yearOfBuild}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" min-width="120px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="说明" min-width="100px">
        <template slot-scope="{row}">
          <el-button type="primary" @click="dialogVisible = true">查看说明</el-button>

          <el-dialog title="说明" :visible.sync="dialogVisible" width="30%">
            <el-form >
              <el-form-item>
                <el-input type="textarea" v-model="row.explanation" placeholder="请输入内容" rows="8"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
          </el-dialog>

        </template>
      </el-table-column> -->
      <el-table-column label="操作 " align="center" width="200">
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

    <div>
      <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogProjectVisible" top="0" @close="beforeDialogClose">
        <el-form :model="newItem" :rules="rules" ref="dataForm" label-position="left" label-width="100px" style="width: 680px; margin-left:20px;">
          <el-form-item label="站点编号" prop="windFieldCode" v-if="isModify">
            <el-input v-model="newItem.windFieldCode" maxlength="15" placeholder="请输入站点编号" disabled/>
          </el-form-item>
          <el-form-item label="站点编号" prop="windFieldCode" v-else>
            <el-input v-model="newItem.windFieldCode" maxlength="15" placeholder="请输入站点编号" />
          </el-form-item>
          
          <el-form-item label="站点名称" prop="windFieldName">
            <el-input v-model="newItem.windFieldName" placeholder="请输入站点名称" />
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
          <el-form-item label="设备" prop="deviceId">
            <el-select v-model="newItem.deviceId" placeholder="请选择" ref="deviceSelect" :filterable="true">
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
          <el-form-item label="土地利用率" prop="">
            <el-input v-model="newItem.ultilization" placeholder="请输入,单位：%(百分制)" />
          </el-form-item>
          <el-form-item label="所属径流小区" prop="jingliuId">
            <el-select v-model="newItem.jingliuId" placeholder="请选择">
              <el-option v-for="item in jingliuOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属小流域" prop="minorDrainageBasinId">
            <el-select v-model="newItem.minorDrainageBasinId" placeholder="请选择">
              <el-option v-for="item in basinOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="设立时间" prop="yearOfBuild">
            <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="newItem.yearOfBuild" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="图片" prop="">
            <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed" :file-list="fileList" list-type="picture-card" :action="pathToUploadImage" :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange" :on-remove="handleRemove" multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
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
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getAllWindFieldSite, modifyWindFieldSite, deleteWindFieldSite, addWindFieldSite, searchWindFieldSiteByName, getAllJingLiu, getAlBasins, getDevices, fetchDict, searchDeviceByCodeAndType, locateMinorDrainageBasin, locateJingLiu } from '@/api/projectExcution'

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
    return {
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
      dialogFormVisible: false,
      tableKey: 0,
      newItem: {
        windFieldCode: '',
        windFieldName: '',
        longitude: '',
        latitude: '',
        altitude: '',
        deviceId: ''
      },
      fakeData: [
      ],
      // dialogFormVisible: false,
      dialogVisible: false,
      dialogProjectVisible: false,
      isModify: false,
      modifyIdx: 0,
      dialogTitle: "新增",
      searchValue: "",
      searchState: false,
      defaultVal: {
        altitude: 0,
        deviceId: 1,
        explaination: "",
        image: "",
        latitude: 0,
        longitude: 0,
        ultilization: "0%",
        windFieldName: "新的风蚀场",
        windFieldCode: ""
      },
      rules: {
        windFieldCode: [
          { required: true, message:'请输入站点编码', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{8}$/, message: '必须是8位数字', trigger: 'blur' }
        ],
        windFieldName: [
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
        deviceId: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      deviceOptions: [],
      device: {},
      jingliuOptions: [],
      basinOptions: [],
      jingliu: {},
      basin: {},
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
        // console.log('jingliu', this.jingliu, this.jingliuOptions)
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
      // console.log(res)
      if (res.code === 200) {
        let data = res.data
        for (let i = 0; i < data.length; ++i) {
          this.device[data[i].id] = data[i].deviceCode
          this.deviceOptions.push({
            value: data[i].id,
            label: data[i].deviceCode
          })
        }
        this.deviceOptions = this.deviceOptions.sort(this.compare)
        this.allDeviceOptions = this.deviceOptions
        // console.log('device', this.device, this.deviceOptions)
      }
    })
    this.getData()
  },
  methods: {
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
    getDeviceName (id) {
      return this.device.hasOwnProperty(id) ? this.device[id] : ''
    },
    getJingLiuName (id) {
      return this.jingliu.hasOwnProperty(id) ? this.jingliu[id] : '暂无'
    },
    getBasinName (id) {
      return this.basin.hasOwnProperty(id) ? this.basin[id] : '暂无'
    },
    onPageChange (page) {
      this.currentPage = page - 1
      this.getData()
    },
    getData () {
      if (this.searchState) {
        searchWindFieldSiteByName(this.searchValue, this.currentPage, 10).then(res => {
          // console.log(res)
          if (res.code === 200) {
            this.totalElements = res.data.totalElements
            this.fakeData = res.data.content
          }
        })
        return
      }
      getAllWindFieldSite(this.currentPage, 10).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      })
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
            modifyWindFieldSite(this.newItem).then(res => {
              console.log(res)
              if (res.code === 200) {
                // this.fakeData[this.modifyIdx] = Object.assign({}, this.newItem)
                this.fakeData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
                this.newItem = {}
                this.dialogProjectVisible = false
              }
            })
          } else {
            if ((this.newItem.windFieldCode === undefined) || (this.newItem.windFieldCode === "")) {
              this.$message.error('站点编号不能为空！');
            } else {
              // for (let key in this.defaultVal) {
              //   if (this.newItem[key] === undefined) {
              //     this.newItem[key] = this.defaultVal[key]
              //   }
              // }
              console.log(this.newItem, 'newItem')
              addWindFieldSite(this.newItem).then(res => {
                console.log(res)
                if (res.code === 200) {
                  // this.fakeData.push(this.newItem)
                  this.getData()
                  this.newItem = {}
                  this.dialogProjectVisible = false
                } else {
                  // this.newItem = tmp
                  this.$message.error('站点编码已存在！');
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
        deleteWindFieldSite(this.fakeData[scope.$index].id).then(res => {
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
    serchByValue () {
      this.currentPage = 0
      this.searchState = (!this.searchValue.length) ? false : true
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

/deep/.el-select .el-input {
  width: 170px;
}
/deep/.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/deep/.el-input-group {
  width: 406px;
}
</style>
