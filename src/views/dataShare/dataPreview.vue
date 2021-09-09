<template>
  <div style="display: flex;justify-content: center;">
    <div class="content_wrap">
      <div class="content_head">
        <h6 class="content_title">{{ArticleTitle}}</h6>
        <div class="content_details">
          <p>作者：{{ArticleAuthor}}</p>
        </div>
        <div class="content_details">
          <p>上传时间：{{ArticleTime}}</p>
          <p>上传机构：{{ArticleFrom}}</p>
          <!--          <p>浏览量：{{ArticleViewTimes}}</p>
                    <p>下载量：{{ArticleDownloadTimes}}</p>-->
        </div>
      </div>
      <div class="content_details2">
        <div>
          <p class="littleTitle">关键词</p>
          <br>
          <p style="white-space:pre;text-indent: 2em">{{keyWord}}</p>
        </div>
        <br>
        <br>
        <div>
          <p class="littleTitle" style="white-space:pre;">摘 要</p>
          <br>
          <div style="width: 100%;text-align: left;text-indent: 2em;line-height:32px">
            {{abstract}}
          </div>
        </div>
        <br>
        <br>
        <div>
          <p class="littleTitle" style="white-space:pre;">数据状态</p>
          <br>
          <div style="width: 100%;text-align: left;text-indent: 2em;line-height:32px;">
            {{dataStatus}} ; {{statusCheck}}
          </div>
        </div>
        <br>
        <br>
        <div>
          <p class="littleTitle" style="white-space:pre;">申请理由</p>
          <br>
          <div style="width: 100%;text-align: left;text-indent: 2em;line-height:32px">
            {{reason}}
          </div>
        </div>
        <br>
        <br>
        <div>
          <p class="littleTitle" style="white-space:pre;">数据下载</p>
          <br>
          <div style="display: flex;width: 100%">
            <p style="white-space:pre;text-indent: 2em;width: auto;">{{fileName}} ({{fileSize}}) </p>
            <!--<el-button type="text" @click="dialogFormVisible = true">下载</el-button>-->
            <el-button type="text" @click="clickSubmit()">下载</el-button>
            <br>
          </div>
          <br>
          <div style="width: 100%;display: flex;">
            <div style="width: 50%;text-indent: 2em" v-if="percentageNum > 0">
              <el-progress :text-inside="true" :stroke-width="15" :percentage="percentageNum"
                           status="success"></el-progress>
            </div>
          </div>
        </div>
      </div>


      <el-dialog title="下载数据" :visible.sync="dialogFormVisible">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          class="demo-ruleForm"
          size="medium">
          <el-form-item label="负责人" prop="manager" :label-width="formLabelWidth">
            <el-input v-model="form.manager" autocomplete="off"
                      placeholder="请输入项目负责人"></el-input>
          </el-form-item>
          <el-form-item label="使用项目" prop="project" :label-width="formLabelWidth" style="margin-top:25px">
            <el-input v-model="form.project" autocomplete="off"
                      placeholder="请输入项目名称"></el-input>
          </el-form-item>
          <el-form-item label="目的" prop="purpose" :label-width="formLabelWidth" style="margin-top:25px">
            <el-input v-model="form.purpose" autocomplete="off"
                      placeholder="请输入下载目的"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="height: 30px; width: 70px;" @click="dialogFormVisible = false">取 消</el-button>
          <el-button style="height: 30px; width: 70px;" type="primary" @click="clickSubmit('form')">确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dataPreview",
    data() {
      return {
        showSub: false,
        ArticleTitle: '', //数据名称
        ArticleAuthor: '', //作者
        ArticleFrom: '', //上传机构
        ArticleTime: '', //上传时间
        ArticleViewTimes: '', //浏览次数
        ArticleDownloadTimes: '', //下载次数
        keyWord: '', //关键词
        fileName: '', //文件名
        fileSize: '', //数据大小
        abstract: '', //摘要
        reason: '', //申请理由
        dialogFormVisible: false,
        percentageNum: 0,
        size: 0,
        dataStatus: '', //数据状态
        statusCheck: '', //审核状态
        form: {
          manager: '',
          project: '',
          purpose: '',
        },
        formLabelWidth: '120px',
        rules: {
          manager: [{required: true, message: '请输入项目负责人名称', trigger: 'change'}],
          project: [{required: true, message: '请输入使用数据的项目名称', trigger: 'change'}],
          purpose: [{required: true, message: '请输入下载目的', trigger: 'change'}],
        },
      }
    },
    methods: {
      goTo(id) {
        //直接跳转
        // this.$router.push({'/listPage');

        //带参数跳转
        // alert(1)
        this.$router.push({path: '/listPage', query: {blockId: id}});
      },
      getArticle() {
        var that = this;
        /*that.blockContents = []*/
        this.$axios({
          method: 'post',
          url: '/dataShare/application/preview',
          contentType: 'application/json; charset=UTF-8', // 解决415错误
          headers: {'Content-Type': 'application/json;charset=UTF-8'},
          dataType: 'json',
          data: JSON.stringify({aid: that.$route.query.id})
        }).then(res => {
          console.log(res.data)
          that.ArticleTitle = res.data[0]
          that.ArticleAuthor = res.data[1]
          that.ArticleFrom = res.data[2]
          that.ArticleTime = res.data[3]
          that.keyWord = res.data[4]
          that.fileName = res.data[5]
          that.fileSize = res.data[6]
          that.abstract = res.data[7]
          that.size = parseInt(res.data[8])
          that.reason = res.data[9]
          if (that.$route.query.status === 'up') {
            that.dataStatus = '上线'
          } else
            that.dataStatus = '下线'

          if (that.$route.query.statusCheck === 'undo') {
            that.statusCheck = '待审核'
          } else if (that.$route.query.statusCheck === 'yes') {
            that.statusCheck = '审核通过'
          } else if (that.$route.query.statusCheck === 'no') {
            that.statusCheck = '审核不通过'
          }

        }).catch(error => {
          alert(error)
          console.log(error)
        })
      },
      clickSubmit() {
        if(this.$route.query.check === 1){ // 如果该条数据存在侵权行为
          this.$message({
            message: '该条数据可能侵权，不允许下载',
            type: 'warning'
          });
          return;
        }
        else{
          var that = this;
          var submit = { // JSON数据    名称-值对
            'rid': this.$route.query.id,
            'email': '',
            'type': 'admin',
          }
          this.$axios({
            method: 'post',
            url: '/dataShare/download/downloadFile',
            contentType: 'application/json; charset=UTF-8', // 解决415错误
            headers: {'Content-Type': 'application/json;charset=UTF-8;application/octet-stream'},
            dataType: 'json',
            data: JSON.stringify(submit),
            responseType: 'arraybuffer',
            onDownloadProgress(progress) {
              that.percentageNum = (progress.loaded / that.size) * 100
            }
          }).then((res) => {
            if (!res) {
              this.$message.error("下载模板文件失败");
              return false;
            }
            console.log(res)
            //const blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            const blob = new Blob([res.data])
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob);

            let contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
            let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
            let result = patt.exec(contentDisposition);
            let filename = decodeURI(result[1]);
            downloadElement.style.display = 'none';
            downloadElement.href = href;
            //window.open(href)
            downloadElement.download = filename; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
            if (that.percentageNum === 100) {
              this.$message({
                message: '文件' + filename + '下载完成！',
                type: 'success'
              });
              that.percentageNum = 0
            } else {
              this.$message.error('文件下载失败！');
              that.percentageNum = 0
            }
          }).catch(error => {
            alert(error)
            console.log(error)
          })
          this.dialogFormVisible = false
        }
      }
    },

    mounted() {
      this.getArticle()
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: "Microsoft YaHei";
  }

  .content_wrap {
    border: solid 1px #d3d3d3;
    /*margin: 5px 40px 0px 10px; !*上*!*/
    align-items: center;
    width: 75%;
    padding: 40px;
    display: inline-grid;
    background-color: #ffffff;
  }

  .content_head {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: solid 1px #d3d3d3;
    margin-bottom: 25px;
  }

  .content_title {
    font-size: 26px;
    margin-bottom: 15px;
  }

  .littleTitle {
    color: #006fcb;
    font-weight: bold;
  }

  .content_details {
    display: flex;
    justify-content: center;
    color: #9b9b9b;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .content_details2 {
    align-items: center;
    width: 85%;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .content_details p {
    margin: 0 10px;
  }

  .footer-bottom {
    height: 110px;
    margin-top: 20px;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    height: 80px;
    background: #333333;
    color: #ffffff;
    text-align: center;
  }

  .footer-content p:nth-child(1) {
    padding-top: 20px;
    font-size: 24px;
  }

  .footer-content p:nth-child(2) {
    font-size: 14px;
  }

  .content_img {
  }

  .footer-script {
    height: 30px;
    background: #1a1a1a;
    color: #ffffff;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    font-weight: lighter;
  }
</style>
