<template>
  <div class="login">
    <h5>医疗会议管理系统</h5>
    <el-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      class="demo-ruleForm"
      hide-required-asterisk
    >
      <el-form-item prop="phone_num">
        <el-input v-model="loginForm.phone_num" placeholder="请输入手机号">
          <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :type="passw"
          v-model="loginForm.password"
          placeholder="请输入登录密码"
        >
          <i slot="suffix" :class="icon" @click="showPass"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button round @click="onLogin">登录</el-button>
    <router-link to="/register" class="register">注册</router-link>
  </div>
</template>

<script>
import { login } from "@/api/login";
import { uuid, setCookie } from "@/utils/index";
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
    return {
      passw: "password",
      //用于更换Input中的图标
      icon: "el-input__icon el-icon-view",
      loginForm: {
        phone_num: "",
        password: ""
      },
      loginRules: {
        phone_num: [
          {
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
        ]
      }
    };
  },
  methods: {
    showPass() {
      //点击图标是密码隐藏或显示
      if (this.passw == "text") {
        this.passw = "password";
        //更换图标
        this.icon = "el-input__icon el-icon-view";
      } else {
        this.passw = "text";
        this.icon = "el-input__icon el-icon-key";
      }
    },
    onLogin() {
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          const reqid = uuid();
          await login({
            ...this.loginForm,
            reqid
          }).then(res => {
            if (res.data.status === 0) {
              this.$message.success("登录成功！");
              setCookie("loginType", 1);
              setCookie("userInfo", JSON.stringify(res.data.user));
              this.$router.push("/");
            } else {
              this.$message.error("用户不存在！");
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.login {
  position: relative;
  margin: 0 auto;
  h5 {
    margin-top: 50%;
    text-align: center;
    font-size: 30px;
  }
  .demo-ruleForm {
    padding: 0 30px;
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
  .register {
    color: #409eff;
    position: absolute;
    margin-top: 80px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
