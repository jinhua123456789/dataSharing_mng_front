<template>
  <div>
    <!--显示数据-->
    <div>
<!--      <h3>{{newScale}}</h3>-->
    </div>
    <el-form
      ref="scaleForm"
      :rules="rules"
      :model="newScale"
      label-position="left"
    >
      <el-form-item style="width: 500px" label="量表名称" prop="scaleName">
        <!--          prop的名字对应rules中的项，而且必须与绑定的model中的属性名成对应-->
        <el-input v-model="newScale.scaleName" />
      </el-form-item>
      <el-form-item style="width: 500px" label="量表类型" prop="scaleType">
        <el-select clearable v-model="newScale.scaleType"  placeholder="Please select">
          <el-option v-for="item in scaleTypeOptions" :key="item.key" :label="item.key" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item  label="量表介绍" prop="scaleInfo">
        <el-input v-model="newScale.scaleInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>
      <el-form-item  label="量表指导语" prop="scaleInstruction">
        <el-input v-model="newScale.scaleInstruction" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item  v-if="addAgeLimitVisible === true">
            <el-button type="primary" @click="addAgeLimit">增加年龄限制</el-button>
          </el-form-item>
          <el-form-item  v-if="addAgeLimitVisible === false">
            <el-button type="info" >增加年龄限制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  v-if="addGenderLimitVisible === true">
            <el-button type="primary" @click="addGenderLimit">增加性别限制</el-button>
          </el-form-item>
          <el-form-item  v-if="addGenderLimitVisible === false">
            <el-button type="info" @click="addGenderLimit">增加性别限制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  v-if="addTimeLimitVisible === true">
            <el-button type="primary" @click="addTimeLimit">增加答题时间限制</el-button>
          </el-form-item>
          <el-form-item  v-if="addTimeLimitVisible === false">
            <el-button type="info" @click="addTimeLimit">增加答题时间限制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  v-if="addGroupWarningVisible === true">
            <el-button type="primary" @click="addGroupWarning">增加总分团队预警百分比</el-button>
          </el-form-item>
          <el-form-item  v-if="addGroupWarningVisible === false">
            <el-button type="info" @click="addGroupWarning">增加团队总分预警百分比</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item style="width: 500px" v-if="formAgeVisible === true" label="适用年龄" >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item clearable prop="formAgeStart" >
              <el-input v-model.number="newScale.formAgeStart" />
            </el-form-item>
          </el-col>
          <el-col :span="1">至</el-col>
          <el-col :span="5">
            <el-form-item clearable prop="formAgeEnd" >
              <el-input v-model.number="newScale.formAgeEnd" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button @click.prevent="removeAgeLimit">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width: 500px" v-if="formGenderVisible === true" label="适用性别" >
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="formGender">
              <el-select clearable v-model="newScale.formGender" class="filter-item" placeholder="Please select">
                <el-option v-for="item in formGenderOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button @click.prevent="removeGenderLimit">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width: 500px" v-if="formTimeVisible === true" label="答题时间（分钟）" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="formTime" style="width: 100px">
              <el-input v-model.number="newScale.formTime" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button @click.prevent="removeTimeLimit">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width: 500px" v-if="formGroupWarningVisible === true" label="总分团队预警（%）" >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="groupWarning" style="width: 100px">
              <el-input v-model.number="newScale.groupWarning" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button @click.prevent="removeGroupWarning">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="intervalOne">
        <upload-excel-component  :on-success="handleSuccess" :before-upload="beforeUpload" />
      </div>
      <!--题干-->
      <el-form-item
        v-for="(evaluation, index) in newScale.evaluationList"
        :label="'题目'+(index+1)"
        :key="evaluation.evaluationId"
        class="intervalOne"
      >
        <el-row :gutter="20" class="intervalOne">
          <el-col :span="8" >
            <el-form-item :prop="'evaluationList.'+index+'.stem'" :rules="{required: true, message: '题目不能为空', trigger: 'blur'}">
              <el-input placeholder="题干" v-model="evaluation.stem"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="'evaluationList.'+index+'.evaluationType'" :rules="{required: true, message: '题目类型不能为空', trigger: 'change'}">
              <el-select v-model="evaluation.evaluationType"
                         placeholder="题目类型"
                         clearable
                         class="filter-item"
              >
                <el-option
                  v-for="item in evaluationOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeEvaluation(evaluation)">删除</el-button>
          </el-col>
          <el-col :span="4">
            <el-button  type="primary" @click.prevent="addChoice(evaluation)">新增选项</el-button>

          </el-col>
        </el-row>
        <!--          选项-->
        <el-form-item
          v-for="(choice, indexs) in evaluation.choiceList"
          :label="'选项'+(indexs+1)"
          :key="choice.number"
          class="intervalOne"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item  :prop="'evaluationList.'+index+'.choiceList.'+indexs+'.content'" :rules="{required: true, message: '选项不能为空', trigger: 'blur'}">
                <el-input  placeholder="选项内容" v-model="choice.content"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item  :prop="'evaluationList.'+index+'.choiceList.'+indexs+'.score'" :rules="[{required: true, message: '分数不能为空', trigger: 'blur'},{ type: 'number', message: '必须为数字'}]">
                <el-input   placeholder="分数" v-model.number="choice.score"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="removeChoice(evaluation,choice)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="addEvaluation">新增测评项</el-button>
      </el-form-item>
      <!--因子-->
      <el-form-item
        v-for="(factor, index) in newScale.factorList"
        :label="'因子'+(index+1)"
        :key="factor.factorId"
        class="intervalOne"
      >
        <el-row :gutter="20" class="intervalOne">
          <el-col :span="8">
            <el-form-item :prop="'factorList.'+index+'.factorName'" :rules="{required: true, message: '因子名称不能为空', trigger: 'blur'}">
              <el-input placeholder="因子名称" v-model="factor.factorName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="因子缩写" v-model="factor.factorAbbr"></el-input>
          </el-col>
          <el-col :span="4">
            <el-form-item :prop="'factorList.'+index+'.groupWarningThreshold'" :rules="[{ required: true, type: 'number', message: '必须为数字,若无需预警请填0'}]">
              <el-input placeholder="因子团队预警阈值" v-model.number="factor.groupWarningThreshold" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeFactor(factor)">删除</el-button>
          </el-col>
        </el-row>
        <el-form-item  class="intervalOne" label="因子介绍" :prop="'factorList.'+index+'.factorInfo'" :rules="{required: true, message: '因子介绍不能为空', trigger: 'blur'}">
          <el-input v-model="factor.factorInfo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item  class="intervalOne" label="选择关联题目" >

          <el-switch
            v-model = "factor.optionsFlag"
            active-text="选项"
            active-value= "1"
            inactive-text="题目"
            inactive-value= "0"
            @change="factor.relatedEvaluationList = []"
          >
          </el-switch>
          <el-form-item v-if="factor.optionsFlag == 0" >
            <el-transfer  v-model="factor.relatedEvaluationList" :data="newScale.evaluationList"></el-transfer>
          </el-form-item>
          <el-form-item v-if="factor.optionsFlag == 1" >
            <el-transfer  v-model="factor.relatedEvaluationList" :data="keyAndLabel"></el-transfer>
          </el-form-item>

        </el-form-item>

        <!--        添加因子得分解释-->
        <el-form-item
          v-for="(scoreDescription, indexs) in factor.factorScoreDescriptionList"
          :label="'得分解释'+(indexs+1)"
          :key="scoreDescription.scoreDescriptionId"
          class="intervalOne"
        >
          <!--            <el-form-item >-->
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item :prop="'factorList.'+index+'.factorScoreDescriptionList.'+indexs+'.startScore'" :rules="[{required: true, message: '起始分数不能为空', trigger: 'blur'},{ type: 'number', message: '必须为数字'}]">
                <el-input placeholder="得分解释起始分数" v-model.number="scoreDescription.startScore"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :prop="'factorList.'+index+'.factorScoreDescriptionList.'+indexs+'.endScore'" :rules="[{required: true, message: '结束分数不能为空', trigger: 'blur'},{ type: 'number', message: '必须为数字'}]">
                <el-input placeholder="得分解释结束分数" v-model.number="scoreDescription.endScore"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-switch
                v-model="scoreDescription.personalWarningFlag"
                active-text="开启预警"
                active-value="1"
                inactive-text="关闭预警"
                inactive-value="0"
              >
              </el-switch>
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="removeFactorScoreDescription(factor ,scoreDescription)">删除</el-button>
            </el-col>
          </el-row>
          <el-form-item  label=" 得分解释" :prop="'factorList.'+index+'.factorScoreDescriptionList.'+indexs+'.description'" :rules="{required: true, message: '得分解释不能为空', trigger: 'blur'}">
            <el-input v-model="scoreDescription.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
          </el-form-item>
          <!--            </el-form-item>-->
        </el-form-item>

        <el-button  type="primary" @click="addFactorScoreDescription(factor)">新增因子得分解释</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="addFactor">新增因子</el-button>
      </el-form-item>
      <!--        总分解释-->
      <el-form-item
        v-for="(scoreDescription, index) in newScale.scoreDescriptionList"
        :label="'总分解释'+(index+1)"
        :key="scoreDescription.scoreDescriptionId"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item :prop="'scoreDescriptionList.'+index+'.startScore'" :rules="[{required: true, message: '起始分数不能为空', trigger: 'blur'},{ type: 'number', message: '必须为数字'}]">
              <el-input placeholder="得分解释起始分数" v-model.number="scoreDescription.startScore"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :prop="'scoreDescriptionList.'+index+'.endScore'" :rules="[{required: true, message: '结束分数不能为空', trigger: 'blur'},{ type: 'number', message: '必须为数字'}]">
              <el-input placeholder="得分解释结束分数" v-model.number="scoreDescription.endScore"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-switch
              v-model="scoreDescription.personalWarningFlag"
              active-text="开启预警"
              active-value="1"
              inactive-text="关闭预警"
              inactive-value="0"
            >
            </el-switch>
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeScoreDescription(scoreDescription)">删除</el-button>
          </el-col>
        </el-row>
        <el-form-item  label=" 得分解释" :prop="'scoreDescriptionList.'+index+'.description'" :rules="{required: true, message: '得分解释不能为空', trigger: 'blur'}">
          <el-input v-model="scoreDescription.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="addScoreDescription">新增总分解释</el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="right">
      <el-button type="success" @click="submitScale()">
        提交
      </el-button>
      <el-button type="primary" @click="saveScale()">
        保存
      </el-button>
      <el-button type="info" @click="cancelScale()">
        取消
      </el-button>
    </div>
  </div>
</template>

<script>
  import {  submitScale, saveScale, fetchSavedScaleByScaleId,  } from '@/api/scale'
  import UploadExcelComponent from './upload-excel'
  const scaleTypeOptions = [
    { key: 'scaleType1', display_name: '类型1'},
    { key: 'scaleType2', display_name: '类型2'},
    { key: 'scaleType3', display_name: '类型3'},
  ];

  const formGenderOptions = [
    { key: 'male', display_name: '男'},
    { key: 'female', display_name: '女'},
  ];

  const evaluationOptions = [
    { key: '1', display_name: '选择题'},
    { key: '2', display_name: '填空题'},
    { key: '3', display_name: '简答题'}
  ];

  export default {
      name: "newScale",
      props: {
        deletedScaleId:Number,
        closeScale: {
        type: Function
        }
      },
      components: { UploadExcelComponent },
      data() {
        return {
          tableData : [],

          scaleTypeOptions,
          formGenderOptions,
          evaluationOptions,
          evaluationAndChoiceFlag: false,
          keyAndLabel: [],
          tableKey: 0,
          evaluationKey: 2,
          addAgeLimitVisible: true,
          addGenderLimitVisible: true,
          addTimeLimitVisible: true,
          addGroupWarningVisible: true,
          addNewEvaluationVisible: false,
          formAgeVisible: false,
          formGenderVisible: false,
          formTimeVisible: false,
          formGroupWarningVisible: false,
          newScale: null,
          organizationId: undefined,
          organizationName: undefined,
          creatorId: undefined,
          creatorName: undefined,
          rules: {
            scaleType: [{ required: true, message: '量表类型必选', trigger: 'change' }],
            scaleInfo: [{ required: true, message: '量表介绍必填', trigger: 'blur' }],
            scaleName: [{ required: true, message: '量表名称必填', trigger: 'blur' }],
            scaleInstruction: [{ required: true, message: '量表指导语必填', trigger: 'blur' }],
            formAgeStart: [{ required: true, message: '请输入年龄', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],
            formAgeEnd: [{ required: true, message: '请输入年龄', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],
            formGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
            formTime: [{ required: true, message: '请填写答题时间', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],
            groupWarning: [{ required: true, message: '请填写团队预警百分比', trigger: 'blur' },{ type: 'number', message: '必须为数字'}],
          },
        }
      },
      created() {
        this.info();
        this.resetScale();
        this.getScale();
      },
      watch: {
        immediate: true,
        deletedScaleId() {
          this.getScale();
        }},
      methods:{
        //上传EXCEL
        beforeUpload(file) {
          const isLt1M = file.size / 1024 / 1024 < 1

          if (isLt1M) {
            return true
          }

          this.$message({
            message: 'Please do not upload files larger than 1m in size.',
            type: 'warning'
          })
          return false
        },
        handleSuccess({ results, header }) {
          this.tableData = results;
          this.handleExcelString();
        },
        //处理批量导入的字符串
        handleExcelString() {
          this.newScale.evaluationList = [];
          //判断题目数
          for (let i = 0; i < this.tableData.length; i++) {
            //装入题目的基本信息
            this.addEvaluation();
            // console.log(this.tableData[i][`选项${i+1}`])
            this.newScale.evaluationList[i].evaluationId = this.tableData[i]['题号'];
            this.newScale.evaluationList[i].stem = this.tableData[i]['题目'].toString();
            if (this.tableData[i]['题目类型'] == '选择题') {
              this.newScale.evaluationList[i].evaluationType = '1';
            } else if (this.tableData[i]['题目类型'] == '填空题') {
              this.newScale.evaluationList[i].evaluationType = '2';
            } else if (this.tableData[i]['题目类型'] == '简答题') {
              this.newScale.evaluationList[i].evaluationType = '3';
            }
            //判断是否为选择题
            if (this.tableData[i]['题目类型'] == '选择题') {
              //判断有几个选项
              let k = 0;
              while ( this.tableData[i][`选项${k+1}`] != null ) {
                // console.log(`题目${i+1}选项${k+1}`);
                k++;
              }
              //装入选项的基本信息
              for (let j = 0; j < k; j++) {
                this.addChoice(this.newScale.evaluationList[i]);
                this.newScale.evaluationList[i].choiceList[j].content = this.tableData[i][`选项${j+1}`].toString();
                this.newScale.evaluationList[i].choiceList[j].score = this.tableData[i][`分数${j+1}`];
              }
            }

          }
        },

        //初始化量表机构和创建人信息
        info() {
          this.organizationId = 0
          this.organizationName = null
          this.creatorId = 0
          this.creatorName = null
        },
        //根据deletedScaleId判断获得已保存的量表或重置量表
        getScale() {
          if (this.deletedScaleId == null || this.deletedScaleId == undefined) {
            this.resetScale();
          } else {
            this.listLoading = true;
            fetchSavedScaleByScaleId(this.deletedScaleId).then(response => {
              this.newScale = response.data;
            });
            setTimeout(() =>{
              this.listLoading = false;
            },1000);
          }
        },
        //重置添加的量表信息
        resetScale() {
          this.newScale = {
            scaleType: undefined,
            id: undefined,
            scaleName: undefined,
            scaleStatus: undefined,
            scaleInfo: undefined,
            scaleInstruction: undefined,
            createTime: undefined,
            modifyTime: undefined,
            formAgeStart: undefined,
            formAgeEnd: undefined,
            formGender: undefined,
            organizationId: undefined,
            organizationName: undefined,
            formTime: undefined,
            groupWarning: undefined,
            creatorId: undefined,
            creatorName: undefined,
            evaluationList: [
              {
                evaluationId:1,
                evaluationType:null,
                stem:null,
                choiceList: [],
                key: '题目1',
                label: '题目1'
              },
              {
                evaluationId:2,
                evaluationType:null,
                stem:null,
                choiceList: [],
                key: '题目2',
                label: '题目2'
              }
            ],
            factorList: [],
            scoreDescriptionList: []
          };
          this.$nextTick(() => {
            this.$refs['scaleForm'].clearValidate()
          })
        },
        //提交添加后的量表
        submitScale() {
          this.$refs['scaleForm'].validate((valid) => {
            if (valid) {
              this.newScale.scaleStatus = '1';
              this.newScale.organizationId = '0';
              this.newScale.organizationName = '总部';
              this.newScale.creatorId = '0';
              this.newScale.creatorName = '总部管理员';
              this.newScale.modifyTime = new Date();
              this.newScale.id = this.deletedScaleId;
              submitScale(this.newScale).then(() => {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetScale();
                this.cancelScale();
              })
            }
          })
        },
        //保存量表
        saveScale() {
          this.$refs['scaleForm'].validate((valid) => {
            if (valid) {
              this.newScale.scaleStatus = '0';
              this.newScale.organizationId = '0';
              this.newScale.organizationName = '总部';
              this.newScale.creatorId = '0';
              this.newScale.creatorName = '总部管理员';
              this.newScale.modifyTime = new Date();
              this.newScale.id = this.deletedScaleId;
              saveScale(this.newScale).then(() => {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetScale();
                this.cancelScale();
              })
            }
          })
        },
        //取消量表
        cancelScale() {
            this.closeScale();
        },


        //同步穿梭表中的key(题号和选项号)和label
        syncTransferKey() {
          this.keyAndLabel = [];
          for (let i = 0; i < this.newScale.evaluationList.length; i++) {
            for (let j = 0; j<this.newScale.evaluationList[i].choiceList.length; j++){
              this.keyAndLabel.push({
                key: `题目${i+1}选项${j+1}`,
                label: `题目${i+1}选项${j+1}`
              })
            }
          }
        },
        //年龄限制
        addAgeLimit() {
          this.formAgeVisible = true
          this.addAgeLimitVisible = false
        },
        removeAgeLimit() {
          this.formAgeVisible = false
          this.addAgeLimitVisible = true
          this.newScale.formAgeStart = undefined
          this.newScale.formAgeEnd = undefined
        },
        //性别限制
        addGenderLimit() {
          this.formGenderVisible = true
          this.addGenderLimitVisible = false
        },
        removeGenderLimit() {
          this.formGenderVisible = false
          this.addGenderLimitVisible = true
          this.newScale.formGender = undefined
        },
        //时间限制
        addTimeLimit() {
          this.formTimeVisible = true
          this.addTimeLimitVisible = false
        },
        removeTimeLimit() {
          this.formTimeVisible = false
          this.addTimeLimitVisible = true
          this.newScale.formTime = undefined
        },
        //团队预警
        addGroupWarning() {
          this.formGroupWarningVisible = true
          this.addGroupWarningVisible = false
        },
        removeGroupWarning() {
          this.formGroupWarningVisible = false
          this.addGroupWarningVisible = true
          this.newScale.groupWarning = undefined
        },
        //测评项
        addEvaluation() {
          this.newScale.evaluationList.push({
            evaluationId:null,
            evaluationType:null,
            stem:null,
            choiceList: [],
            key: null,
            label: null
          })
          for (let i = 0; i < this.newScale.evaluationList.length; i++) {
            var index = this.newScale.evaluationList[i].evaluationId = i+1;
            this.newScale.evaluationList[i].key = `题目${ i+1 }`;
            this.newScale.evaluationList[i].label = `题目${ i+1 }`;
          }
          this.syncTransferKey();
        },
        removeEvaluation(evaluation) {
          var index = this.newScale.evaluationList.indexOf(evaluation)
          if (index !== -1) {
            this.newScale.evaluationList.splice(index, 1)
            for (let i = 0; i < this.newScale.evaluationList.length; i++) {
              var index = this.newScale.evaluationList[i].evaluationId = i+1;
              this.newScale.evaluationList[i].key = `题目${ i+1 }`;
              this.newScale.evaluationList[i].label = `题目${ i+1 }`;
            }
          }
          this.syncTransferKey();
        },
        //选项
        addChoice(item) {
          item.choiceList.push({
            content:null,
            score:null,
            number:null,
            key: null,
            label: null
          })
          for (let i = 0; i < item.choiceList.length; i++) {
            var index = item.choiceList[i].number = i+1;
            item.choiceList[i].key = `题目${ item.evaluationId }选项${item.choiceList[i].number.toString()}`;
            item.choiceList[i].label = `题目${ item.evaluationId }选项${ item.choiceList[i].number }`
          }
          this.syncTransferKey();
        },
        removeChoice(evaluation,choice) {
          var index = evaluation.choiceList.indexOf(choice)
          if (index !== -1) {
            evaluation.choiceList.splice(index, 1)
          }
          this.syncTransferKey();
        },
        // 因子
        addFactor() {
          this.newScale.factorList.push({
            factorId: null,
            factorName: null,
            factorAbbr: null,
            factorInfo: null,
            scoreTransferFlag: '0',
            groupWarningThreshold: null,
            defaultFlag: '0',
            scoreDescriptionFlag: '0',
            referenceFactorFlag: '0',
            relatedEvaluationList: [],
            optionsFlag: '0',
            factorScoreDescriptionList: [],
          })
          for (let i = 0; i < this.newScale.factorList.length; i++) {
            var index = this.newScale.factorList[i].factorId = i+1;
          }
        },
        removeFactor(factor) {
          var index = this.newScale.factorList.indexOf(factor)
          if (index !== -1) {
            this.newScale.factorList.splice(index, 1)
            for (let i = 1; i < this.newScale.factorList.length; i++) {
              var index = this.newScale.factorList[i].factorId = i;
            }
          }
        },
        //因子得分解释
        addFactorScoreDescription(factor) {
          factor.factorScoreDescriptionList.push({
            scoreDescriptionId: null,
            startScore: null,
            endScore: null,
            description: null,
            personalWarningFlag: null
          })
          for (let i = 0; i < factor.factorScoreDescriptionList.length; i++) {
            var index = factor.factorScoreDescriptionList[i].scoreDescriptionId = i+1;
          }
        },
        removeFactorScoreDescription(factor, scoreDescription) {
          var index = factor.factorScoreDescriptionList.indexOf(scoreDescription)
          if (index !== -1) {
            factor.factorScoreDescriptionList.splice(index, 1)
          }
        },
        //总得分解释
        addScoreDescription() {
          this.newScale.scoreDescriptionList.push({
            scoreDescriptionId: null,
            startScore: null,
            endScore: null,
            description: null,
            personalWarningFlag: null,
          })
          for (let i = 0; i < this.newScale.scoreDescriptionList.length; i++) {
            var index = this.newScale.scoreDescriptionList[i].scoreDescriptionId = i+1;
          }
        },
        removeScoreDescription(scoreDescription) {

          var index = this.newScale.scoreDescriptionList.indexOf(scoreDescription)
          if (index !== -1) {
            this.newScale.scoreDescriptionList.splice(index, 1)
            for (let i = 0; i < this.newScale.scoreDescriptionList.length; i++) {
              var index = this.newScale.scoreDescriptionList[i].scoreDescriptionId = i+1;
            }
          }
        },
      }
    }
</script>

<style scoped>
  .intervalOne {
    padding-bottom: 20px;
  }
</style>
