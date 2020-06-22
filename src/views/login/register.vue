<template>
  <div class="register">
    <h5>会议平台绑定</h5>
    <el-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      class="demo-ruleForm"
      label-width="80px"
      label-position="right"
      hide-required-asterisk
    >
      <el-form-item prop="name" label="姓名">
        <el-input v-model="loginForm.name" placeholder="请输入姓名">
        </el-input>
      </el-form-item>
      <el-form-item label="大区" prop="area">
        <el-select v-model="loginForm.area" placeholder="请选择大区">
          <el-option label="东北" value="东北"></el-option>
          <el-option label="华北" value="华北"></el-option>
          <el-option label="华中" value="华中"></el-option>
          <el-option label="中南" value="中南"></el-option>
          <el-option label="华西" value="华西"></el-option>
          <el-option label="华南" value="华南"></el-option>
          <el-option label="华东" value="华东"></el-option>
          <el-option label="东南" value="东南"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="phone_num" label="手机号">
        <el-input v-model="loginForm.phone_num" placeholder="请输入手机号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="登录密码">
        <el-input v-model="loginForm.password" placeholder="请输入登录密码">
        </el-input>
      </el-form-item>
      <el-form-item label="上传名片">
        <template>
          <input class="filesUpload" type="file" title=" " accept="image/*" @change="onFilesUpload($event)" />
          <i v-if="!uploadCover" class="el-icon-picture-outline"></i>
          <img v-else :src="uploadCover" alt="" height="50">
        </template>
      </el-form-item>
    </el-form>
    <el-button round @click="onRegister">注册</el-button>
    <router-link to="/login" class="login">去登录</router-link>
  </div>
</template>

<script>
import { register, getCosToken, cosUpload } from "@/api/login";
import { uuid } from "@/utils/index";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[34578]\d{9}$$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (phoneReg.test(value)) {
          callback();
        } else {
          callback(new Error("电话号码格式不正确"));
        }
      }
    };
    var checkFile = (rule, value, callback) => {
      if (!this.uploadCover) {
        return callback(new Error("请上传名片"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        reqid: '',
        name: '',
        area: '',
        card: '',
        card_file_name: '',
        phone_num: "",
        password: ""
      },
      loginRules: {
        phone_num: [
          {
            required: true,
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        area: [
          {
            required: true,
            message: "请选择大区",
            trigger: "change"
          }
        ]
      },
      uploadCover: ''
    };
  },
  methods: {
    onRegister() {
      this.$refs['loginForm'].validate(async (valid) => {
        if (valid) {
          if(!this.loginForm.card) {
            this.$message.warn('请上传名片');
            return false;
          }
          await register({
            ...this.loginForm,
          }).then(res => {
            if(res.data.status === 0) {
              this.$message.success('注册成功！')
            } else if(res.data.status === 7008) {
              this.$message.warn('用户已存在，请直接登录')
            } else {
              this.$message.error(res.data.message)
            }
          });
        } else {
          return false;
        }
      });
    },
    async onFilesUpload(e) {
      const files = event.target.files[0];
      if (!event || !window.FileReader) { return } // 看支持不支持FileReader
      const reader = new FileReader()
      reader.readAsDataURL(files)
      reader.onloadend = () => {
        this.uploadCover = reader.result;
      }
      const reqid = uuid();
      const suffix = files.name.split('.')[1];
      this.loginForm.card_file_name = files.name;
      this.loginForm.reqid = reqid;
      const file_name = reqid+ '.' +suffix;
      this.loginForm.card = file_name;
      await getCosToken({
        reqid,
        method: 1,
        file_name
      }).then(async res => {
        const {url, token} = res.data.detail;
        await cosUpload({
          url,
          token
        })
      })
    }
  }
};
</script>

<style lang="scss">
.register {
  position: relative;
  margin: 0 auto;
  h5 {
    margin-top: 20%;
    text-align: center;
    font-size: 30px;
  }
  .demo-ruleForm {
    padding: 0 30px;
    .el-icon-picture-outline {
      font-size: 35px;
    }
    .filesUpload {
      position: absolute;
      height: 38px;
      opacity: 0;
    }
  }
  .el-button {
    position: absolute;
    margin-top: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;
    border-color: #409eff;
    color: #409eff;
  }
  .el-input {
    width: 80%;
  }
  .el-select {
    width: 100%;
  }
  .login {
    color: #409eff;
    position: absolute;
    margin-top: 80px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
