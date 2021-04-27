<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!--        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <lang-select class="right-menu-item hover-effect" />-->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <span style="font-size: 20px">我的</span>
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/">-->
          <!--            <el-dropdown-item>-->
          <!--              {{ $t('navbar.dashboard') }}-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
          <!--          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
          <!--            <el-dropdown-item>-->
          <!--              {{ $t('navbar.github') }}-->
          <!--            </el-dropdown-item>-->
          <!--          </a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ trueName }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="changePassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--    <ChangePassword :changePasswordVisible="changePasswordVisible"></ChangePassword>-->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>



      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import ErrorLog from "@/components/ErrorLog";
  import Screenfull from "@/components/Screenfull";
  import SizeSelect from "@/components/SizeSelect";
  import LangSelect from "@/components/LangSelect";
  import Search from "@/components/HeaderSearch";

  import { modifyPassword} from '@/api/sysuser'


  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      LangSelect,
      Search
    },
    computed: {
      ...mapGetters(["sidebar", "name", "avatar", "device"])
    },
    data() {
      var validateOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("旧密码不能为空"));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === "" || !value) {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm.checkPass !== "") {
            this.$refs.ruleForm.validateField("checkPass");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "" || !value) {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        trueName: null,
        dialogVisible: false,
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldPass: [
            { validator: validateOldPass, trigger: 'blur' }
          ]
        }

      };
    },
    created() {
      this.trueName = this.$store.state.user.name;
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      async logout() {
        await this.$store.dispatch("user/logout");
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      },
      changePassword() {
        this.dialogVisible = true;
      },


      submitForm(formName) {
        this.dialogVisible = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            modifyPassword({oldPassword:this.ruleForm.oldPass,newPassword:this.ruleForm.pass}).then(response => {
              if(response.data === '成功')
                this.$notify({
                  title: '成功',
                  message: '密码修改成功',
                  type: 'success',
                  duration: 2000
                })
              else
                this.$notify({
                  title: '失败',
                  message: response.data,
                  type: 'warning',
                  duration: 4000
                })
            })
          } else {
            console.log('error submit!!');
          }
        });
        this.resetForm();
      },
      resetForm() {

        console.log("重置");
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.pass = '';
        this.ruleForm.checkPass= '';
        this.ruleForm.oldPass= '';
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
