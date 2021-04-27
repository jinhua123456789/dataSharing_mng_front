<template>
  <div class="app-container">
    <div class="filter-container" v-show="showMain">
      <el-input placeholder="设备编码" style="width: 200px;" class="filter-item" v-model="searchValue" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchByCode()">查询</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addNewItem('dataForm')">新增</el-button>
      <el-table :key="tableKey" :data="fakeData" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="设备编码" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="text">{{row.deviceCode }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备名称" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="text">{{row.deviceName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备类型" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="text">{{ getTypeName(row.deviceType) }}</el-button>
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

        <!-- <el-table-column align="center" label="海拔" min-width="80px">
          <template slot-scope="{row}">
            <span>{{row.altitude}}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column align="center" label="设备状态" min-width="80px">
          <template slot-scope="{row}">
            <span>{{getStatusName(row.status)}}</span>
          </template>
        </el-table-column> -->

        <el-table-column align="center" label="安装时间" min-width="100px">
          <template slot-scope="{row}">
            <span>{{toString(row.applyTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="维护记录" min-width="120px">
          <template slot-scope="{row}">
            <el-button type="primary" @click="showRecord(row)">查看与编辑</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="图片" min-width="120px">
          <template slot-scope="{row}">
            <el-button type="primary" @click="showImgs(row.image)">查看图片</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="说明" min-width="100px">
          <template slot-scope="{row}">
            <el-button type="primary" @click="dialogVisible = true;details=row.details">查看说明</el-button>

            <el-dialog :close-on-click-modal="false" title="说明" :visible.sync="dialogVisible" width="30%">
              <el-form>
                <el-form-item>
                  <el-input type="textarea" v-model="details" placeholder="请输入内容" rows="8" disabled></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </div>
            </el-dialog>

          </template>
        </el-table-column>
        <el-table-column label="操作 " align="center" width="200">
          <template slot-scope="scope">
            <!-- <el-button size="small" type="primary" @click="getInFetchList(row.id)"
            >查看</el-button> -->
            <el-button size="small" type="primary" @click="modifyItem(scope,'dataForm')">编辑</el-button>
            <!-- <el-button v-if="!scope.row.status" size="small" type="danger" @click="deleteItem(scope)"
            >删除</el-button> -->
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
    </div>

    <div class="filter-container" v-show="!showMain">
      <div class="link"><i class="el-icon-d-arrow-left icon" @click="goBack()">返回</i></div>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addRecordItem()">新增维护记录</el-button>
      <el-table :data="recordData" border fit highlight-current-row style="width: 100%;">
        <el-table-column align="center" label="记录人" min-width="80px">
          <template slot-scope="{row}">
            <el-button type="text">{{row.userName }}</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" label="维护人" min-width="80px">
          <template slot-scope="{row}">
            <span>{{row.repairmanName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="记录时间" min-width="100px">
          <template slot-scope="{row}">
            <span>{{toString(row.repairTime)}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="维护内容" min-width="100px">
          <template slot-scope="{row}">
            <el-button type="primary" @click="dialogRepairContentVisible = true;repairContent=row.repairContent">查看</el-button>

            <el-dialog :close-on-click-modal="false" title="维护内容" :visible.sync="dialogRepairContentVisible" width="30%">
              <el-form>
                <el-form-item>
                  <el-input type="textarea" v-model="repairContent" rows="8" disabled></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogRepairContentVisible = false">确 定</el-button>
              </div>
            </el-dialog>

          </template>
        </el-table-column>
        <el-table-column label="操作 " align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="modifyRecordItem(scope,'dataForm')">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRecordItem(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="currentRecordPage + 1" v-if="totalRecordElements" background :page-size="10" layout="prev, pager, next" :total="totalRecordElements" @current-change="onRecordPageChange">
      </el-pagination>
    </div>

    <el-dialog :close-on-click-modal="false" title="图片" :visible.sync="dialogFormVisible" align="center" width="60%">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item, idx) in imgList" :key="idx">
          <img :src="item" style="height:400px;max-width:100%;">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <div>
      <el-dialog :close-on-click-modal="false"
                 :title="dialogTitle"
                 :visible.sync="dialogProjectVisible"
                 top="0"
                 @close="beforeDialogClose">
        <el-form :model="newItem" :rules="rules" ref="dataForm" label-position="left" label-width="110px" style="width: 450px; margin-left:50px;">
          <el-form-item label="设备编码" prop="deviceCode" v-if="isModify">
            <el-input v-model="newItem.deviceCode" placeholder="请输入设备编码" disabled/>
          </el-form-item>
          <el-form-item label="设备编码" prop="deviceCode" v-else>
            <el-input v-model="newItem.deviceCode" placeholder="请输入设备编码" />
          </el-form-item>
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="newItem.deviceName" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="newItem.deviceType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经度（°）" prop="longitude">
            <el-input v-model="newItem.longitude" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度（°）" prop="latitude">
            <el-input v-model="newItem.latitude" placeholder="请输入纬度" />
          </el-form-item>
          <!-- <el-form-item label="海拔" prop="altitude">
                <el-input v-model="newItem.altitude" />
              </el-form-item> -->
          <!-- <el-form-item label="设备状态" prop="equipmentType">
                <el-select v-model="newItem.status" placeholder="请选择">
                  <el-option
                    v-for="item in optionsStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
          <el-form-item label="安装时间" prop="applyTime">
            <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="newItem.applyTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="图片" prop="">
            <el-upload ref="uploadImg" :before-upload="beforeUpload" :limit="5" :on-exceed="onExceed" :file-list="fileList" list-type="picture-card" :action="pathToUploadImage" :on-success="afterUpload" :auto-upload="true" :on-change="onImgChange" :on-remove="handleRemove" multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="说明" prop="details">
            <el-input type="textarea" rows="5" v-model="newItem.details" placeholder="请输入.." />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectVisible = false">取 消</el-button>
          <el-button type="primary" @click="onComfirm('dataForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogRecordVisible">
      <el-form ref="tmp" label-position="left" label-width="120px" style="width: 450px; margin-left:50px;">
        <el-form-item label="维护设备编码" prop="repairmanName">
          <el-input v-model="repaireDeviceCode" disabled/>
        </el-form-item>
        <el-form-item label="维护人" prop="repairmanName">
          <el-input v-model="newItem.repairmanName" placeholder="请输入维护人" />
        </el-form-item>

        <el-form-item label="维护日期" prop="repairTime">
          <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd" v-model="newItem.repairTime" style="width: 100%;"></el-date-picker>
        </el-form-item>

        <el-form-item label="维护内容" prop="repairContent">
          <el-input type="textarea" rows="5" v-model="newItem.repairContent" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRecordComfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pathToUploadImage from '@/api/projectExcution'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getInfo } from '@/api/user'
import { getAllDevices, deleteDevice, addDevice, modifyDevice, searchDevice, fetchDict, getAllRecord, addRecord, deleteRecord, modifyRecord } from '@/api/projectExcution'

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
      userId: "",
      deviceId: "",
      repaireDeviceCode: "",
      dialogRecordVisible: false,
      currentRecordPage: 0,
      totalRecordElements: 0,
      recordData: [],
      dialogRepairContentVisible: false,
      repairContent: '',
      showMain: true,
      deviceTypeDict: {},
      pathToUploadImage,
      imgList: [],
      fileList: [],
      fileMap: {},
      totalElements: 0,
      currentPage: 0,
      dialogFormVisible: false,
      tableKey: 0,
      newItem: {
        deviceCode: '',
        deviceType: '',
        longitude: '',
        latitude: '',
        applyTime: '',
        details: ''
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
      options: [
        {
          value: 1,
          label: '盖度测量设备'
        },
        {
          value: 2,
          label: '小区径流观测设备'
        },
        {
          value: 3,
          label: '小流域泥沙观测设备'
        },
        {
          value: 4,
          label: '风蚀观测设备'
        },
        {
          value: 5,
          label: '水分观测设备'
        },
        {
          value: 6,
          label: '温度观测设备'
        }],
      optionsStatus: [{
        value: 0,
        label: '在使用'
      }, {
        value: 1,
        label: '已废弃'
      }],
      value: '',
      defaultVal: {
        applyTime: "",
        details: "",
        // deviceCode: "",
        deviceType: 1,
        image: "",
        latitude: 0,
        longitude: 0,
        status: 0,
      },
      searchValue: "",
      rules: {
        deviceCode: [
          { required: true, message:'请输入设备编码', trigger: 'blur' },
          // { type: 'number', message: '必须为阿拉伯小写数字', trigger: 'blur' },
          // { pattern: /^\d{8}$/, message: '必须是8位数字', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message:'请输入设备名称', trigger: 'blur' },
        ],
        deviceType: [
          { required: true, message: '请选择', trigger: 'change' }
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
        // setupTime:[
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
      }
    }
  },
  created () {
    getInfo().then(res => {
      if (res.code === 200) {
        this.userId = res.data.userId
      }
    })
    fetchDict("DeviceType").then(res => {
      this.options = []
      for (var i = 0; i < res.length; ++i) {
        this.deviceTypeDict[res[i].value] = res[i].label
        this.options.push({
          value: parseInt(res[i].value),
          label: res[i].label
        })
      }
    })
    this.getData()
  },
  methods: {
    getRecordData() {
      console.log("in getRecordData")
      getAllRecord(this.deviceId, this.currentRecordPage, 10).then(res => {
        console.log(res)
        // if(res.code == 200) {
          this.totalRecordElements = res.totalElements
          this.recordData = res.content
        // }
      })
    },
    showRecord (row) {
      this.repaireDeviceCode = row.deviceCode
      this.deviceId = row.id
      this.getRecordData()
      this.showMain = false
    },
    goBack () {
      this.showMain = true
    },
    addRecordItem () {
      this.newItem = {}
      this.isModify = false
      this.dialogRecordVisible = true
      this.dialogTitle = "新增"
    },
    modifyRecordItem (scope) {
      this.isModify = true
      this.modifyIdx = scope.$index
      this.newItem = Object.assign({}, this.recordData[scope.$index])
      this.dialogRecordVisible = true
      this.dialogTitle = "编辑"
    },
    deleteRecordItem (scope) {
      this.$confirm('您确定要删除这条数据吗？')
      .then(_ => {
        deleteRecord(this.recordData[scope.$index].id, this.deviceId).then(res => {
          if (res.code === 200) {
            this.getRecordData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      .catch(_ => {})
    },
    onRecordComfirm () {
      if (this.isModify) {
        modifyRecord(this.newItem).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.recordData.splice(this.modifyIdx, 1, Object.assign({}, this.newItem))
            this.newItem = {}
            this.dialogRecordVisible = false
          }
        })
      } else {
        console.log(this.newItem, 'newItem')
        this.newItem.recorderId = this.userId
        this.newItem.deviceId = this.deviceId
        addRecord(this.newItem).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.getRecordData()
            this.newItem = {}
            this.dialogRecordVisible = false
          } else {
            this.$message.error('内部错误');
          }
        })
      }
    },
    onRecordPageChange (page) {
      this.currentRecordPage = page - 1
      this.getRecordData()
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
      searchDevice(this.searchValue, this.currentPage, 10).then(res => {
        if (res.code === 200) {
          this.totalElements = res.data.totalElements
          this.fakeData = res.data.content
        }
      })
      // getAllDevices(this.currentPage, 10).then(res => {
      //   // console.log(res, 'res')
      //   if (res.code === 200) {
      //     this.totalElements = res.data.totalElements
      //     let data = res.data.content
      //     this.fakeData = []
      //     for (let i = 0; i < data.length; ++i) {
      //       if (!data[i].status) {
      //         if (data[i].applyTime) {
      //           // data[i].applyTime = this.toString(data[i].applyTime)
      //           data[i].setupTime = this.toString(data[i].applyTime)
      //         } else {
      //           data[i].applyTime = ""
      //         }
      //         this.fakeData.push(data[i])
      //       }
      //     }
      //   }
      // })
    },
    getdata (val) {
      this.newItem.setupTime = val;
      console.log(this.newItem.setupTime);
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
            // if (this.checkDate()) {
              console.log(this.newItem, 'modifyItem')
              modifyDevice(this.newItem).then(res => {
                console.log(res)
                if (res.code === 200) {
                  this.fakeData[this.modifyIdx] = this.newItem
                  this.newItem = {}
                  this.dialogProjectVisible = false
                }
              })
            // }
          } else {
            if ((this.newItem.deviceCode === undefined) || (this.newItem.deviceCode === "")) {
              this.$message.error('设备编码不能为空！');
            } else {
              // if (this.checkDate()) {
                // for (let key in this.defaultVal) {
                //   if (this.newItem[key] === undefined) {
                //     this.newItem[key] = this.defaultVal[key]
                //   }
                // }
                console.log(this.newItem, 'newItem')
                addDevice(this.newItem).then(res => {
                  console.log(res)
                  if (res.code === 200) {
                    // this.fakeData.push(this.newItem)
                    this.getData()
                    this.newItem = {}
                    this.dialogProjectVisible = false
                  } else {
                    this.$message.error('设备编码已存在！');
                  }
                })
              // }
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
        deleteDevice(this.fakeData[scope.$index].id, 1).then(res => {
          // console.log(res)
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
    getTypeName (type) {
      // return {
      //   1: '盖度测量设备',
      //   2: '小区径流观测设备',
      //   3: '小流域泥沙观测设备',
      //   4: '风蚀观测设备',
      //   5: '水分观测设备',
      //   6: '温度观测设备'
      // }[type]
      return this.deviceTypeDict[type]
    },
    getStatusName (type) {
      return {
        0: '在使用',
        1: '已废弃'
      }[type]
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
        // this.newItem.applyTime = new Date()
        // console.log(this.newItem.applyTime)
      } else {
        if (isNaN(setupTime)) {
          let tmp = Date.parse(setupTime)
          if (isNaN(tmp)) {
            this.$message.error("日期格式错误！")
            return false
          } else {
            this.newItem.applyTime = new Date(tmp)
            // this.newItem.applyTime = tmp / 1000
          }
        } else {
          this.$message.error("日期格式错误！")
          return false
        }
        this.newItem.setupTime = this.toString(this.newItem.applyTime)
      }
      return true
    },
    checkDate () {
      let setupTime = this.newItem.setupTime
      if (setupTime === "" || setupTime === undefined || setupTime === null) {
        // this.newItem.applyTime = new Date()
        // console.log(this.newItem.applyTime)
      } else {
        if (isNaN(setupTime)) {
          let tmp = Date.parse(setupTime)
          if (isNaN(tmp)) {
            this.$message.error("日期格式错误！")
            return false
          } else {
            this.newItem.applyTime = new Date(tmp)
          }
        } else {
          this.$message.error("日期格式错误！")
          return false
        }
        this.newItem.setupTime = this.toString(this.newItem.applyTime)
      }
      return true
    },
    searchByCode () {
      this.currentPage = 0
      this.getData()
      // if (!this.searchValue.length) {
      //   // this.$message.error('搜索内容不能为空！');
      //   this.currentPage = 0
      //   this.getData()
      //   return
      // }
      // searchDevice(this.searchValue).then(res => {
      //   console.log(res)
      //   if (res.code === 200) {
      //     if (res.data) {
      //       this.fakeData = [res.data]
      //       this.totalElements = 1
      //     } else {
      //       this.fakeData = []
      //       this.totalElements = 0
      //     }
      //   }
      // })
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
.link {
  color: #379AFF;
  margin: 0 0 20px;
  cursor: pointer;
}
</style>
