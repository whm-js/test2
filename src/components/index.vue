<template>
  <div class="index">
    <el-container style="height:100%;">
      <el-header style="background-color:#409EFF;">
        <span style="text-align:left;font-size:24px;line-height:60px;">英腾护士培训智能管理系统</span>
        <el-button @click.native="logout" type="text" style="float:right;color:white;margin-top: 10px;">退出登录</el-button>
        <span v-if="userLoginInfo.user" style="float:right;color:white;line-height:60px;margin-right:20px;">{{userLoginInfo.user.real_name}}</span>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="pathIndex" @select="handleSelect" style="height:100%;" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>系统首页</span>
              </template>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">基础数据</span>
              </template>
              <el-menu-item index="/deparmentManage">科室管理</el-menu-item>
              <el-menu-item index="/nurseManage">护士信息</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">个人信息</span>
              </template>
              <el-menu-item index="/personal">个人信息</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>轮转计划(护理部)</span>
              </template>
              <el-menu-item index="/selectFromDepartment">按科室查看</el-menu-item>
              <el-menu-item index="/selectFromPeople">按人员查看</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">轮转记录</span>
              </template>
              <el-menu-item index="/trainManage">培训管理</el-menu-item>
              <el-menu-item index="/entryManage">入科管理</el-menu-item>
              <el-menu-item index="/exitManage">出科管理</el-menu-item>
              <el-menu-item index="/exitTeacherManage">出科管理（导师）</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="padding:0;min-width:800px;">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import { userLogin, getUserInfo } from "@/http/data";
import { mapGetters, mapActions } from 'vuex'
var that;
export default {
  name: "App",
  data () {
    return {
      pathIndex: '/deparmentManage',
      routerPath: "",
      username: "",
      password: "",
      logindialog: false
    };
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  methods: {
    ...mapActions({
      setSignOut:'setSignOut'
    }),
    handleSelect (key, keyPath) {
      if (this.routerPath !== key) this.routerPath = key;
      this.$router.push(key);
    },
    logout () {
      this.setSignOut()
      // this.removeRotateInfoArr()
      this.$router.push('/login')
    }
  },
  created () {
    that = this;
    // this.$router.push('/login')
  },
  activated () {
    if (!this.userLoginInfo.hasOwnProperty('guid')) {
      this.$router.push('/login')
    }
    var path = this.$route.path;
    if (path === '/') {
      this.pathIndex = '/deparmentManage'
      this.$router.push('/deparmentManage')
    } else {
      this.pathIndex = path
    }

  }
};
</script>

<style>
.index {
  height: 100%;
}
.index .el-menu {
  border-right: 0px;
}
</style>
