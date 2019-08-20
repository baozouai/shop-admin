<template>
  <!-- 容器 -->
  <el-row type="flex" justify="center" align="middle" class="login-container">
    <!-- 表单 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="uname">
        <el-input placeholder="请输入用户名" v-model="ruleForm.uname" clearable></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="upwd">
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="ruleForm.upwd"
          show-password
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 登录 -->
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <!-- 重置 -->
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
      <el-alert v-show="alertShow" class="login-wrong" title="用户名或密码错误" type="error" effect="dark"></el-alert>
    </el-form>
  </el-row>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  data() {
    return {
        // 表单
      ruleForm: {
        uname: "",
        upwd: ""
      },
      // 表单验证规则
      rules: {
        uname: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        upwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      },
    //   登录警告
    alertShow: false
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      // 先验证表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发起请求
          this.$axios({
            method: "post",
            url: "/admin/account/login ",
            data: this.ruleForm,
            // 处理跨域请求
            withCredential: true
          }).then(res => {
            // 解构赋值
            console.log(res);
            const {status, message} = res.data
            // console.log(message);
            if (status === 0) {
              // 登录成功
              // 跳转到Admin首页
              this.$store.commit('setUserInformation', {
                username: message.uname,
                realname: message.upwd
              })
              localStorage.setItem('realname', message.realname)
              localStorage.setItem('uname', message.uname)
              this.$router.push("/admin");
              this.$message({
                  showClose: true,
                  message: `欢迎回来! ${message.realname}`,
                  type:"success"
                })
            } else {
                // 否则弹框提示警告错误
                this.$message({
                  showClose: true,
                  message: message,
                  type:"error"
                })
            }
          });
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped style="less">
.login-container {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
}
.ruleForm {
  width: 350px;
  position: relative;
  padding: 50px 80px;
  border-radius: 20px;
  box-shadow: 0px 0px 12px 2px;
  background-color: #fff;
}
.login-wrong {
  width: 50%;
  position: absolute;
  left: 50%;
  top: -20%;
  transform: translateX(-50%);
}
</style>