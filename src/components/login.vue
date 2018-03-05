<template>
  <div id="login">
    <el-container style="height:100%;">
      <el-header>
        <div>英腾护士</div>
      </el-header>
      <el-main>
        <div style="width:400px;height:400px;margin: 50px auto;">
<el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="name">
    <el-input v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="name">
    <el-input v-model="loginForm.password"></el-input>
  </el-form-item>
</el-form>
        </div>
        </el-main>
      <el-footer>
        <div style="text-align:center;">
          Copyright © 2015-2018 广西英腾教育 备案信息：桂ICP备13003351号-2
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return{
      loginForm:{
        username:"",
        password:""
      },
      rules:{
        username:[{required: true, message: '请输入用户名', trigger: 'blur'}],
        password:[{required: true, message: '请输入密码', trigger: 'blur'}]
      }
    }
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
