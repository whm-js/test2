<template slot-scope="">
  <el-form :data="UserData" label-position="left" inline class="demo-table-expand">
    <el-form-item label="账号：">
      <span>{{UserData.userName}}</span>
    </el-form-item>
    <el-form-item label="角色：">
      <span>{{UserData.role}}</span>
    </el-form-item>
    <el-form-item label="姓名：">
      <span>{{UserData.realName}}</span>
    </el-form-item>
    <el-form-item label="职级：">
      <span>{{UserData.workNo}}</span>
    </el-form-item>
    <el-form-item label="性别：">
      <span>{{UserData.sex}}</span>
    </el-form-item>
    <el-form-item label="职称：">
      <span>{{UserData.work}}</span>
    </el-form-item>
    <el-form-item label="学历：">
      <span>{{UserData.education}}</span>
    </el-form-item>
    <el-form-item label="来院时间：">
      <span>{{UserData.joinHospitalTime}}</span>
    </el-form-item>
    <el-form-item label="政治面貌：">
      <span>{{UserData.political}}</span>
    </el-form-item>
    <el-form-item label="出生年月：">
      <span>{{UserData.birthday}}</span>
    </el-form-item>
    <el-form-item label="毕业院校：">
      <span>{{UserData.finishSchool}}</span>
    </el-form-item>
    <el-form-item label="参加工作时间：">
      <span>{{UserData.joinWorkTime}}</span>
    </el-form-item>
    <el-form-item label="毕业时间：">
      <span>{{UserData.finishTime}}</span>
    </el-form-item>
    <el-form-item label="获取执业证书：">
      <span>{{UserData.certificateTime}}</span>
    </el-form-item>
    <el-form-item label="家庭地址：">
      <span>{{UserData.address}}</span>
    </el-form-item>
    <el-form-item label="获得职称时间：">
      <span>{{UserData.workTime}}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    UserData: Object
  },
  data () {
    return {
      curUserData:{}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
