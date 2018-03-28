<template slot-scope="">
  <el-row id="userInfos">
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>角色：</span></el-col>
        <el-col :span="5" class="left">{{UserData.role?UserData.role:'-'}}</el-col>
        <el-col :span="5" class="left"></el-col>
        <el-col :span="5" class="left"></el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>账号：</span></el-col>
        <el-col :span="5" class="left">{{UserData.user_name?UserData.user_name:'-'}}</el-col>
        <el-col :span="5" class="right"><span>出生年月：</span></el-col>
        <el-col :span="5" class="left">{{UserData.birthday?UserData.birthday:'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>姓名：</span></el-col>
        <el-col :span="5" class="left">{{UserData.real_name?UserData.real_name:'-'}}</el-col>
        <el-col :span="5" class="right"><span>年级批次：</span></el-col>
        <el-col :span="5" class="left">{{UserData.batch?(UserData.batch=='0'?'-':UserData.batch):'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>手机号码：</span></el-col>
        <el-col :span="5" class="left">{{UserData.telephone?UserData.telephone:'-'}}</el-col>
        <el-col :span="5" class="right"><span></span>学历：</el-col>
        <el-col :span="5" class="left">{{UserData.education?UserData.education:'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>性别：</span></el-col>
        <el-col :span="5" class="left">{{UserData.sex?'男':'女'}}</el-col>
        <el-col :span="5" class="right"><span></span>毕业院校：</el-col>
        <el-col :span="5" class="left">{{UserData.school?UserData.school:'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>科室：</span></el-col>
        <el-col :span="5" class="left">{{UserData.depart_name?UserData.depart_name:'-'}}</el-col>
        <el-col :span="5" class="right"><span></span>毕业年份：</el-col>
        <el-col :span="5" class="left">{{UserData.graduated_year?(UserData.graduated_year=='0'?'-':UserData.graduated_year):'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>专业：</span></el-col>
        <el-col :span="5" class="left">{{UserData.profession?UserData.profession:'-'}}</el-col>
        <el-col :span="5" class="right"><span></span>参加工作年份：</el-col>
        <el-col :span="5" class="left">{{UserData.job_year?(UserData.job_year=='0'?'-':UserData.job_year):'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>职级：</span></el-col>
        <el-col :span="5" class="left">{{UserData.level?UserData.level:'-'}}</el-col>
        <el-col :span="5" class="right"><span></span>来院年份：</el-col>
        <el-col :span="5" class="left">{{UserData.join_year?(UserData.join_year=='0'?'-':UserData.join_year):'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>护士执业证书：</span></el-col>
        <el-col :span="5" class="left">{{UserData.certificate?'有':'无'}}</el-col>
        <el-col :span="5" class="right"><span></span>获取证书时间：</el-col>
        <el-col :span="5" class="left">{{UserData.certificate_date?UserData.certificate_date:'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>职称：</span></el-col>
        <el-col :span="5" class="left">{{UserData.title?UserData.title:'-'}}</el-col>
        <el-col :span="5" class="right"><span></span>获取职称时间：</el-col>
        <el-col :span="5" class="left">{{UserData.title_date?UserData.title_date:'-'}}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="3" class="right"><span>家庭地址：</span></el-col>
        <el-col :span="15" class="left">{{UserData.address?UserData.address:'-'}}</el-col>
    </el-row>
  </el-row>
</template>

<script>
import { getUserInfos } from "@/http/data";
import { mapGetters } from 'vuex';
export default {
  name: '',
  props: {
    UseID: [Number, String]
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  data () {
    return {
      UserData:{}
    }
  },
  created(){
      this.getUserData();
  },
  methods: {
    getUserData(){
      var that = this;
      getUserInfos(this.userLoginInfo.guid,this.UseID).then(res=>{
          that.UserData=res.datas;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#userInfos .left{text-align: left;}
#userInfos .right{text-align: right;font-weight: bold;}
</style>
