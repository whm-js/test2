<template>
  <div class="nurseManage">
    <h3>护士管理</h3>
    <div class="select_domain">
        <span>账号: <el-input v-model="selectusername" placeholder="请输入账号" style="width:200px;"></el-input></span>
        <span style="padding-left:40px;">姓名: <el-input v-model="selectrealname" placeholder="请输入姓名" style="width:200px;"></el-input></span>
        <el-button icon="el-icon-search" style="margin-left:15px;">查询</el-button>
        <el-button @click="getnurseListAll">显示全部</el-button>
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
                <el-table-column prop="status" label="状态" width="50" style="color:red;"></el-table-column>
                <el-table-column prop="operation" label="操作" width="315">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status=='正常'"
                        size="mini"
                        @click="editnurseStatus(scope.$index, scope.row)">停用</el-button>
                        <el-button v-else
                        size="mini"
                        @click="editnurseStatus(scope.$index, scope.row)">启用</el-button>
                        <el-button
                        size="mini"
                        @click="editnursePwd(scope.$index, scope.row)">重置密码</el-button>
                        <el-button
                        size="mini"
                        @click="editnurseInfo(scope.$index, scope.row)">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="deletenurse(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination style="float:right;padding-top:20px;" v-show="showpage" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="currentPageSize"
            layout="sizes, prev, pager, next"
            :total="total">
        </el-pagination>
        </el-main>
    </div>
    <el-dialog id="userinfohtml" title="查看详细信息"  :visible.sync="dialognurseinfo" style="cursor: pointer;">
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>角色：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.role?nurseinfoOne.role:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>账号：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.user_name?nurseinfoOne.user_name:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span>出生年月：</span></el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.birthday?nurseinfoOne.birthday:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>姓名：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.real_name?nurseinfoOne.real_name:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span>年级批次：</span></el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.batch?nurseinfoOne.batch:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>手机号码：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.telephone?nurseinfoOne.telephone:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>学历：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.education?nurseinfoOne.education:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>性别：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.sex?'男':'女'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>毕业院校：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.school?nurseinfoOne.school:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>科室：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.depart_name?nurseinfoOne.depart_name:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>毕业年份：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.graduated_year?nurseinfoOne.graduated_year:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>专业：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.profession?nurseinfoOne.profession:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>参加工作年份：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.job_year?nurseinfoOne.job_year:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>职级：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.level?nurseinfoOne.level:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>来院年份：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.join_year?nurseinfoOne.join_year:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="4" :offset="2" class="textalign"><span>护士执业证书：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.certificate?'有':'无'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>获取证书时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.certificate_date?nurseinfoOne.certificate_date:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>职称：</span></el-col>
            <el-col :span="6" class="left">{{nurseinfoOne.title?nurseinfoOne.title:'-'}}</el-col>
            <el-col :span="4" class="textalign"><span></span>获取职称时间：</el-col>
            <el-col :span="4" class="left">{{nurseinfoOne.title_date?nurseinfoOne.title_date:'-'}}</el-col>
        </el-row>
        <el-row :gutter="20" type="flex">
            <el-col :span="3" :offset="3" class="textalign"><span>家庭地址：</span></el-col>
            <el-col :span="16" class="left">{{nurseinfoOne.address?nurseinfoOne.address:'-'}}</el-col>
        </el-row>
    </el-dialog>
    <el-dialog id="edithtml" :title="dialogTitle" :visible.sync="dialogFormVisible" style="width:100% !important">
        <el-row :gutter="24" type="flex">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>角色：</span></el-col>
            <el-col :span="6">
               <template>
                        <el-select v-model="nurseInfo.role" placeholder="请选择" @change="changroleselect">
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
               <el-input v-model="nurseInfo.user_name" placeholder="请输入账号" @blur="usernameVerify($event)"></el-input>
               <div class="redPrompt" v-show="showusernameVerif">{{txtusernameVerify}}</div>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>出生时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.birthday"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      @change="changebirthday">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>姓名：</span></el-col>
            <el-col :span="6">
               <el-input v-model="nurseInfo.real_name" placeholder="请输入姓名"></el-input>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>年纪批次：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.batch" placeholder="请输入年级批次"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="3" :offset="1" class="textalign"><font>*</font><span>手机号码：</span></el-col>
            <el-col :span="6">
               <el-input :maxlength='11' v-model="nurseInfo.telephone" placeholder="请输入手机号码" @blur="telephoneVerify($event)"></el-input>
               <div class="redPrompt" v-show="showtelephoneVerif">{{txttelephoneVerify}}</div>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>学历：</span></el-col>
            <el-col :span="6">
                <template>
                        <el-select v-model="nurseInfo.education" placeholder="请选择学历" @change="changeducationselect">
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
                <template>
                    <el-radio-group v-model="nurseInfo.sex" @change="changeSexvalue">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>毕业学校：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.school" placeholder="请输入毕业学校"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>科室：</span></el-col>
            <el-col :span="6">
               <template>
                <el-select v-model="nurseInfo.depart_name" placeholder="请选择科室" @change="changdeparmentselect">
                    <el-option
                    v-for="item in deparmentOprations"
                    :key="item.depart_id"
                    :label="item.depart_name"
                    :value="item.depart_id">
                    </el-option>
                </el-select>
            </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>毕业年份：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.graduated_year" placeholder="请输入毕业年份，如：2018"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>专业：</span></el-col>
            <el-col :span="6" class="radiolist">
                <template>
                    <el-radio v-model="nurseInfo.profession" label="护理" @change="changeProfessionvalue">护理</el-radio>
                    <el-radio v-model="nurseInfo.profession" label="助产" @change="changeProfessionvalue">助产</el-radio>
                </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>来院年份：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.join_year" placeholder="请输入来院年份，如：2018"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>职级：</span></el-col>
            <el-col :span="6">
               <template>
                    <el-select v-model="nurseInfo.level" placeholder="请选择职级" @change="changlevelselect">
                        <el-option
                        v-for="item in levelOprations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>参加工作年份：</span></el-col>
            <el-col :span="6">
                <el-input v-model="nurseInfo.job_year" placeholder="请输入参加工作年份，如：2018"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="4"  class="textalign"><font>*</font><span>护士执业证书：</span></el-col>
            <el-col :span="6" class="radiolist">
                <template>
                    <el-radio-group v-model="nurseInfo.certificate" @change="changeCertificatevalue">
                        <el-radio :label="1">有</el-radio>
                        <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                </template>
            </el-col>
            <el-col :span="4" :offset="2" class="textalign"><span>获得证书时间：</span></el-col>
            <el-col :span="6">
                <el-date-picker
                      v-model="nurseInfo.certificate_date"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      @change="changecertificatedate">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="2" :offset="2" class="textalign"><font>*</font><span>职称：</span></el-col>
            <el-col :span="6">
               <el-select v-model="nurseInfo.title" placeholder="请选择职称" @change="changtitleselect">
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
                      v-model="nurseInfo.title_date"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      @change="changetitledate">
                    </el-date-picker>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="3" :offset="1" class="textalign"><span>家庭住址：</span></el-col>
            <el-col :span="18">
               <el-input v-model="nurseInfo.address" placeholder="请输入家庭住址" style="width:500px"></el-input>
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
import { getNurseinfoList,setenableNurseinfo,resetNursepwd,deleteNurseinfo,updateNurseinfo,addNurseinfo,getDeparmentList } from "@/http/data";
import { mapGetters } from 'vuex';
export default {
  name: '',
  data () {
    return {
        selectusername:'',
        selectrealname:'',
        aaaaa:0,
        nurseListData:[],//获取所有护士信息，接口返回
        nurseinfoOne:{},//行点击中显示护士详细信息
        dialogFormVisible:false,//编辑弹出框
        dialognurseinfo:false,//护士详细信息
        nurseInfo: {},//编辑数据时的数据绑定
        haschangeinfo:{},//编辑前数据保存，对比是否有修改
        formLabelWidth: '120px',
        dialogTitle:'新增护士信息',
        addoredit:1,//1--新增，0--修改
        showpage:false,
        currentPage:1,//当前页数
        currentPageSize:10,//每页显示条数
        total:100,//数据总数
        //角色列表
        roleOprations:[{value: '0',label: '请选择'}, {value: '1',label: '护士'}, {value: '2',label: '护士长'}, {value: '3',label: '护士导师'}],
        //学历列表
        educationOprations:[{value:'0',label:'请选择'},{value:'1',label:'本科生'},{value:'2',label:'硕士生'},{value:'3',label:'博士生'}],
        //科室列表
        deparmentOprations:{},
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
        return (this.currentPage-1)*10+index+1;
      },
      //性别转换
      sexmothod(nurseListData){
          return nurseListData.sex?'男':'女';
      },
      //性别radio选项变更数据
      changeSexvalue(value){
          this.nurseInfo.sex=value;
      },
      //专业radio选项变更数据
      changeProfessionvalue(value){
          this.nurseInfo.profession=value;
      },
      //护士执业证书radio选项变更数据
      changeCertificatevalue(value){
          this.nurseInfo.certificate=value;
      },
      //角色下拉框变更
      changroleselect(value){
          for(var i=0;i<this.roleOprations.length;i++){
              if(this.roleOprations[i].value==value){
                  this.nurseInfo.role=this.roleOprations[i].label;
              }
          }
      },
      //职级下拉框变更
      changlevelselect(value){
          for(var i=0;i<this.levelOprations.length;i++){
              if(this.levelOprations[i].value==value){
                  this.nurseInfo.level=this.levelOprations[i].label;
              }
          }
      },
      //职称下拉框变更
      changtitleselect(value){
          for(var j=0;j<this.titlenameOprations.length;j++){
              if(this.titlenameOprations[j].value==value){
                  this.nurseInfo.title=this.titlenameOprations[j].label;
              }
          }
      },
      //学历下拉框变更
      changeducationselect(value){
          for(var j=0;j<this.educationOprations.length;j++){
              if(this.educationOprations[j].value==value){
                  this.nurseInfo.education=this.educationOprations[j].label;
              }
          }
      },
      //科室下拉框变更
      changdeparmentselect(value){
          this.nurseInfo.depart_id=value;
      },
      //出生日期change
      changebirthday(val){
          this.nurseInfo.birthday=val;
      },
      //获取职称时间change
      changetitledate(val){
          this.nurseInfo.title_date=val;
      },
      //获取证书时间change
      changecertificatedate(val){
          this.nurseInfo.certificate_date=val;
      },
      //弹出框title
      adddialog(){
          this.dialogFormVisible = true;
          this.dialogTitle="新增护士信息";
          this.addoredit=1;
          this.nurseInfo={};
      },
      //编辑框
      editnurseInfo(index,row){
          this.dialogFormVisible = true;
          this.dialogTitle="编辑护士信息";
          this.addoredit=0;
          this.nurseInfo=row;
          if(this.nurseInfo.graduated_year==0){this.nurseInfo.graduated_year='';}
          if(this.nurseInfo.join_year==0){this.nurseInfo.join_year='';}
          if(this.nurseInfo.job_year==0){this.nurseInfo.job_year='';}
          if(this.nurseInfo.batch==0){this.nurseInfo.batch='';}
      },
      //获取护士信息列表
      getnurseList(){
          var that=this;
          getNurseinfoList(this.userLoginInfo.guid,this.currentPage,this.currentPageSize).then(res=>{
              that.nurseListData=res.datas.items;
                //获取总数
                that.total=res.datas.count;
                if(that.total>10){that.showpage=true;}
          })
      },
      //显示全部
      getnurseListAll(){
          this.currentPage=1;
          this.currentPageSize=10;
          this.getnurseList();
      },
      //分页控件，每页显示的条数
      handleSizeChange(size){
          this.currentPageSize=size;
          this.getnurseList();
      },
      //分页控件，当前页数
      handleCurrentChange(val) {
        this.currentPage=val;
        this.getnurseList();
      },
      //获取科室信息
      getDeparmentList(){
          var that=this;
          getDeparmentList(this.userLoginInfo.guid,this.currentPage,10000).then(res=>{
              that.deparmentOprations=res.datas.items;
          });
      },
      //表格行点击事件，判断event.target.nodeName
      //event.target.nodeName值有：DIV， INPUT，SPAN， BUTTON
      clickuserinfo(row,event){
          var nodeName=event.target.nodeName;
          if(event.target.nodeName=='DIV'){
            this.nurseinfoOne=row;
            if(this.nurseinfoOne.graduated_year==0){this.nurseinfoOne.graduated_year='';}
            if(this.nurseinfoOne.join_year==0){this.nurseinfoOne.join_year='';}
            if(this.nurseinfoOne.job_year==0){this.nurseinfoOne.job_year='';}
            if(this.nurseinfoOne.batch==0){this.nurseinfoOne.batch='';}
            this.dialognurseinfo=true;
          }
      },
      //停用/启用账号
      editnurseStatus(index,row){
          // 不弹出详细信息框
          var that=this;
          this.dialognurseinfo=false;
          var status=row.status;//获取当前选中的账号状态
          var userid=row.id;//获取当前选中的账号ID
          var enablestatus=1;
          if(row.status=='正常') {enablestatus=0;status='停用';}
          else{enablestatus=1;status='启用';}
          setenableNurseinfo(row.id,this.userLoginInfo.guid,enablestatus).then(res=>{
              that.$message({
                showClose: true,
                message: '已将'+row.user_name+'('+row.real_name+')'+status+'',
                type:'success'
            });
            that.getnurseList();
          });
      },
      //重置账号密码
      editnursePwd(index,row){
          var that=this;
          // 不弹出详细信息框
          this.dialognurseinfo=false;
            resetNursepwd(row.id,this.userLoginInfo.guid).then(res=>{
                that.$message({
                    showClose: true,
                    message: '已将'+row.user_name+'('+row.real_name+')密码重置为：123456'+'',
                    type:'success'
                });
            });
      },
      //新增/编辑信息框中的确定按钮事件
      editUserinfo(){
          //点击编辑按钮，不弹出详细信息框
          this.dialognurseinfo=false;
          var that=this;
          if(this.nurseInfo.user_name=='undefined' || this.nurseInfo.user_name==null){
              this.showusernameVerif=true;
              this.txtusernameVerify='请输入2-11位英文、数字账号！';
              //return;
          }
          var parems={
                username:this.nurseInfo.user_name,
                realname:this.nurseInfo.real_name,
                role:this.nurseInfo.role,
                deparmentid:this.nurseInfo.depart_id,
                profression:this.nurseInfo.profession,
                level:this.nurseInfo.level,
                education:this.nurseInfo.education?this.nurseInfo.education:'',
                school:this.nurseInfo.school?this.nurseInfo.school:'',
                graduatedyear:this.nurseInfo.graduated_year?this.nurseInfo.graduated_year:'',
                certificate:this.nurseInfo.certificate,
                certificatedate:this.nurseInfo.certificate_date?this.nurseInfo.certificate_date:'',
                title:this.nurseInfo.title,
                titledate:this.nurseInfo.title_date?this.nurseInfo.title_date:'',
                address:this.nurseInfo.address?this.nurseInfo.address:'',
                joinyear:this.nurseInfo.join_year?this.nurseInfo.join_year:'',
                jobyear:this.nurseInfo.job_year?this.nurseInfo.job_year:'',
                birthday:this.nurseInfo.birthday?this.nurseInfo.birthday:'',
                telephone:this.nurseInfo.telephone,
                sex:this.nurseInfo.sex,
                batch:this.nurseInfo.batch?this.nurseInfo.batch:'',
                guid:this.userLoginInfo.guid
              };
              console.log(parems);
          if(this.addoredit==1){
              //添加
              addNurseinfo(parems).then(res=>{
                    that.$message({
                        showClose: true,
                        message: res.message,
                        type:'success'
                    });
                this.dialogFormVisible=false;
                that.getnurseList();
              });
          }else{
              //编辑
              parems.userid=this.nurseInfo.id;
              updateNurseinfo(parems).then(res=>{
                  that.$message({
                        showClose: true,
                        message: res.message,
                        type:'success'
                });
                this.dialogFormVisible=false;
                that.getnurseList();
              });
          }
      },
      //删除账号信息
      deletenurse(index,row){
          this.dialognurseinfo=false;
          var that=this;
          deleteNurseinfo(row.id,this.userLoginInfo.guid).then(res=>{
              that.$message({
                    showClose: true,
                    message: '已将'+row.user_name+'('+row.real_name+')删除',
                    type:'success'
                });
                that.getnurseList();
          });
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
      //手机号码验证
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
  },
  created(){
      this.getnurseList();
      this.getDeparmentList();
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  }
}
</script>

<style>
h3 {margin-left: 20px;}
.nurseManage table{cursor: pointer;}
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
#edithtml .redPrompt{margin-left: 5px;margin-bottom: -25px;color:red;width:150%;}
#edithtml font{color:red;padding-right:5px;font-weight: bolder;font-size: 20px;}

.nurseManage .left{text-align: left;}
</style>
