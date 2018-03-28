<template>
  <div id="login">
    <el-container style="height:100%;">
      <el-header>
        <div>英腾护士</div>
      </el-header>
      <el-main>
        <div style="width: 400px;height: 300px;margin: 50px auto;text-align: center;background-color: #ccc;padding-top: 40px;">
          <el-form style="width: 320px;margin-left: 40px;" :label-position="'left'" :model="loginForm" :rules="rules" ref="loginForm" label-width="60px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="name">
              <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>
          </el-form>

          <el-button @click.native="loginClick" style="width:320px;" type="primary">登录</el-button>
        </div>
      </el-main>
      <el-footer>
        <div style="text-align:center;">
          Copyright © 2015-2018 英腾教育 备案信息：桂ICP备13003351号-2
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { userLogin } from "@/http/data";
import { mapActions } from 'vuex'
var that
export default {
  name: "App",
  data () {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions({ setUserLoginInfo: 'setUserLoginInfo' }),
    loginClick () {
      userLogin(this.loginForm.username, this.loginForm.password).then(res => {
        // console.log(res);
        that.setUserLoginInfo(res.datas);
        that.$router.push('/')
      });
    }
  },
  created () {
    that = this
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}
#login {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 100%;
  /* margin-top: 60px; */
}
</style>
