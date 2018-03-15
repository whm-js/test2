<template>
  <div class="nurseManage">
    <h3>护士管理</h3>
    <div class="select_domain">
        <span>账号: <el-input v-model="selectusername" placeholder="请输入账号" style="width:200px;"></el-input></span>
        <span style="padding-left:40px;">姓名: <el-input v-model="selectrealname" placeholder="请输入姓名" style="width:200px;"></el-input></span>
        <el-button icon="el-icon-search" style="margin-left:15px;">查询</el-button>
        <el-button>显示全部</el-button>
    </div>
    <div style="padding:20px;border-bottom:1px solid #ccc;">
        <el-button icon="el-icon-plus" @click="adddialog">新增</el-button>
        <el-button icon="el-icon-download">导出</el-button>
    </div>
    <div class="nursedata_list">
        <el-main>
            <el-table :data="nurseListData" stripe border style="width: 100%;" @row-click="clickuserinfo">
                <el-table-column type="index" :index="indexmothod" label="序号" width="50"></el-table-column>
                <el-table-column prop="user_name" label="账号"></el-table-column>
                <el-table-column prop="real_name" label="姓名"></el-table-column>
                <el-table-column prop="sex" :formatter="sexmothod" label="性别" width="50" show-overflow-tooltip></el-table-column>
                <el-table-column prop="role" label="角色" width="90"></el-table-column>
                <el-table-column prop="depart_name" label="科室"></el-table-column>
                <el-table-column prop="education" label="学历" width="100"></el-table-column>
                <el-table-column prop="status" label="状态" width="50"></el-table-column>
                <el-table-column prop="operation" label="操作" width="315">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">启用</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">重置密码</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <!--el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage2"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="sizes, prev, pager, next"
        :total="1000">
        </el-pagination-->
    </div>
    <el-dialog id="userinfohtml" title="查看详细信息"  :visible.sync="dialognurseinfo" style="cursor: pointer;">
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>角色：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.role}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>账号：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.user_name}}</el-col>
            <el-col :span="4" class="textalign"><span>出生年月：</span></el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.birthday}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>姓名：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.real_name}}</el-col>
            <el-col :span="4" class="textalign"><span>年级批次：</span></el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.batch}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>手机号：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.telephone}}</el-col>
            <el-col :span="4" class="textalign"><span></span>学历：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.education}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>性别：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.sex?'男':'女'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>毕业院校：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.school}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>科室：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.depart_name}}</el-col>
            <el-col :span="4" class="textalign"><span></span>毕业年份：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.graduated_year}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>专业：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.profession}}</el-col>
            <el-col :span="4" class="textalign"><span></span>参加工作时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.job_year}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>职级：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.level}}</el-col>
            <el-col :span="4" class="textalign"><span></span>来院时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.join_year}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="4" :offset="2" class="textalign"><span>护士执业证书：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.certificate?'有':'无'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>获取证书时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.certificate_date}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>职称：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.title}}</el-col>
            <el-col :span="4" class="textalign"><span></span>获取职称时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.title_date
}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>家庭地址：</span></el-col>
            <el-col :span="16" class="left">{{nurseinfoOne.address}}</el-col>
        </el-row>
    </el-dialog>
    <el-dialog id="edithtml" :title="dialogTitle" :visible.sync="dialogFormVisible" style="width:100% !important">
        <el-row :gutter="24" type="flex">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>角色：</span></el-col>
            <el-col :span="6">
               <template>
                        <el-select v-model="nurseInfo.gradebatch" placeholder="请选择">
                            <el-option
                            v-for="item in roleOprations"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>账号：</span></el-col>
            <el-col :span="6">
               <el-input v-model="nurseInfo.username" placeholder="请输入账号" @blur="usernameVerify($event)"></el-input>
               <div class="redPrompt" v-show="showusernameVerif">{{txtusernameVerify}}</div>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>出生时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>姓名：</span></el-col>
            <el-col :span="6">
               <el-input v-model="nurseInfo.realname" placeholder="请输入姓名"></el-input>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>年纪批次：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.realname" placeholder="请输入"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="4" :offset="1" class="textalign"><font>*</font><span>手机号码：</span></el-col>
            <el-col :span="6">
               <el-input v-model="nurseInfo.telephone" placeholder="请输入" @blur="telephoneVerify($event)"></el-input>
               <div class="redPrompt" v-show="showtelephoneVerif">{{txttelephoneVerify}}</div>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>学历：</span></el-col>
            <el-col :span="6">
                <template>
                        <el-select v-model="nurseInfo.education" placeholder="请选择">
                            <el-option
                            v-for="item in educationOprations"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>性别：</span></el-col>
            <el-col :span="6" class="radiolist">
               <el-radio v-model="nurseInfo.sex" label="1">男</el-radio>
               <el-radio v-model="nurseInfo.sex" label="2">女</el-radio>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>毕业学校：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.graduationschool" placeholder="请输入"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>科室：</span></el-col>
            <el-col :span="6">
               <template>
                <el-select v-model="nurseInfo.deparmentname" placeholder="请选择">
                    <el-option
                    v-for="item in deparmentOprations"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>毕业年份：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.graduationyears" placeholder="请输入"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>专业：</span></el-col>
            <el-col :span="6" class="radiolist">
               <el-radio v-model="nurseInfo.sex" label="1">护理</el-radio>
               <el-radio v-model="nurseInfo.sex" label="2">助产</el-radio>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>来院时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>职级：</span></el-col>
            <el-col :span="6">
               <template>
                    <el-select v-model="nurseInfo.level" placeholder="请选择">
                        <el-option
                        v-for="item in levelOprations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>参加工作时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="4"  class="textalign"><font>*</font><span>护士执业证书：</span></el-col>
            <el-col :span="6" class="radiolist">
               <el-radio v-model="nurseInfo.sex" label="1">有</el-radio>
                <el-radio v-model="nurseInfo.sex" label="2">无</el-radio>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>获得证书时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>职称：</span></el-col>
            <el-col :span="6">
               <el-select v-model="nurseInfo.titlename" placeholder="请选择">
                        <el-option
                        v-for="item in titlenameOprations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>获得职称时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="4" :offset="1" class="textalign"><span>家庭住址：</span></el-col>
            <el-col :span="18">
               <el-input v-model="nurseInfo.realname" placeholder="请输入" style="width:500px"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="24" :offset="1">
                <span>提示：带 * 为必填项，账号登录密码默认为123456; 如需修改密码，可登录后在“个人信息页面”左上角“修改密码”处修改。</span>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserinfo">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNurseinfoList } from "@/http/data";
export default {
  name: '',
  data () {
    return {
        selectusername:'',
        selectrealname:'',
        nurseListData:[],//获取所有护士信息，接口返回
        nurseinfoOne:{},//行点击中显示护士详细信息
        dialogFormVisible:false,//编辑弹出框
        dialognurseinfo:false,//护士详细信息
        nurseInfo: {
          username:'',
          realname:'',
          role:'',
          sex:'1',
          telephone:'',
          deparmentname:'',
          level:'',
          isnursezhengshu:'',
          titlename:'',
          address:'',
          birthday:'',
          education:'',
          gradebatch:'',
          graduationschool:'',
          graduationyears:'',
          comedate:'',
          jobdate:'',
          titledate:'',
          zhengshudare:'',
        },
        formLabelWidth: '120px',
        dialogTitle:'新增护士信息',
        //角色列表
        roleOprations:[{value: '0',label: '请选择'}, {value: '1',label: '护士'}, {value: '2',label: '护士长'}, {value: '3',label: '导师'}],
        //学历列表
        educationOprations:[{value:'0',label:'请选择'},{value:'1',label:'本科生'},{value:'2',label:'硕士生'},{value:'3',label:'博士生'}],
        //科室列表
        deparmentOprations:[{value:'0',label:'请选择'},{value:'1',label:'妇科'},{value:'2',label:'儿科'}],
        //职级
        levelOprations:[{value:'0',label:'NO'},{value:'1',label:'N1'},{value:'2',label:'N2'},{value:'3',label:'N3'},{value:'4',label:'N4'}],
        //职称--专业技术职称
        titlenameOprations:[{value:'0',label:'请选择'},{value:'1',label:'护士'},{value:'2',label:'护师'},{value:'3',label:'中级主管护师'},{value:'4',label:'副主任护师'},{value:'5',label:'主任护师'}],
        txtusernameVerify:'请输入账号',
        showusernameVerif:false,
        txtrealnameVerify:'请输入姓名',
        showrealnameVerify:false,
        txttelephoneVerify:'请输入手机号码',
        showtelephoneVerif:false,
    }
  },
  methods:{
      //序号
      indexmothod(index) {
        return index + 1;
      },
      //性别转换
      sexmothod(nurseListData){
          return nurseListData.sex?'男':'女';
      },
      //弹出框title
      adddialog(){
          this.dialogFormVisible = true;
          this.dialogTitle="新增护士信息";
      },
      handleEdit(index,row){
          this.dialogFormVisible = true;
          this.dialogTitle="编辑护士信息";
      },
      //获取护士信息列表
      getnurseList(){
          var that=this;
          getNurseinfoList(4,0,20).then(res=>{
              if(res.code==0){
                  that.nurseListData=res.datas;
              }
          })
      },
      //表格行点击时间
      clickuserinfo(row){
          //根据行点击中返回的row，获取到当前行的数据ID，进行对比，得到当前数据的信息
          for(var i=0;i<this.nurseListData.length;i++){
              if(this.nurseListData[i].id==row.id){
                  this.nurseinfoOne=this.nurseListData[i];
                  console.log(this.nurseinfoOne);
                  this.dialognurseinfo=true;
              }
          }
      },
      //用户名验证
      usernameVerify(e){
          var userNameReg = /^(\d|[a-zA-Z]|-){2,11}$/;
          if(!(userNameReg.test(e.target.value)) || e.target.value==''){
              this.showusernameVerif=true;
              this.txtusername='请输入2-11位英文、数字账号！';
          }else{
              this.showusernameVerif=false;
              this.txtusername='';
          }
      },
      //姓名验证
      realnameVerify(e){
          if(e.target.value==''){
              this.showrealnameVerify=true;
              this.txtusernameVerify='请输入2-20位中英文、数字姓名！';
          }else{
              this.showrealnameVerify=false;
              this.txtusernameVerify='';
          }
      },
      //手机号验证
      telephoneVerify(e){
            var telephoneReg=/^1\d{10}$/;
          if(!(telephoneReg.test(e.target.value))||e.target.value==''){
              this.showtelephoneVerif=true;
              this.txttelephoneVerify='请输入正确的手机号码！';
          }else{
                this.showtelephoneVerif=false;
                this.txttelephoneVerify='';
          }
      },
      //编辑信息
      editUserinfo(){
          this.dialogFormVisible=false;
      },
      
  },
  created(){
      this.getnurseList();
  }
}
</script>

<style>
h3 {margin-left: 20px;}
.nurseManage{height: 100%;padding:10px;}
.nursedata_list table th,td{text-align: center;}
.el-dialog{width:70%!important}
/*#edithtml input{width:200px!important;}*/
#edithtml .el-dialog__body{padding-top:8px;}
#edithtml .el-row{margin-top:25px;}
#userinfohtml .el-row{margin-top:10px;}
#edithtml .el-select,.el-date-editor,el-input{width:200px!important;}
.nurseManage .textalign{text-align: right;padding-right: 0px!important;}
#edithtml .textalign span{line-height: 40px;}
#edithtml .radiolist{line-height: 40px;}
#edithtml .redPrompt{margin-left: 5px;margin-bottom: -25px;color:red;}
#edithtml font{color:red;padding-right:5px;font-weight: bolder;font-size: 20px;}

.nurseManage .left{text-align: left;}
</style>
