<template>
  <el-container>
    <el-header style="min-height:190px;height:auto;margin-top:30px;overflow: hidden;">
      <el-row :gutter="12">
        <el-col :span="3" style="padding-top:5px;padding-left:15px;margin-left:10px;text-align: center;">计划出科时间：</el-col>
        <el-col :span="3">
        <el-select :span="2" v-model="selYearValue" @change="getRotatePlanList"  placeholder="请选择" style="float:left;width:100px;margin-left:3px;">
            <el-option v-for="item in selYearArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">年</el-col>
        </el-col>
        <el-col :span="3">
          <el-select :span="2" v-model="selMonthValue" @change="getRotatePlanList"  placeholder="请选择" style="float:left;width:100px;">
            <el-option v-for="item in selMonthArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">月</el-col>
        </el-col>
        <el-col :span="3">
          <el-select :span="2" v-model="selDayValue" @change="getRotatePlanList"  placeholder="请选择" style="float:left;width:100px;">
            <el-option v-for="item in selDayArr" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">日</el-col>
        </el-col>
      </el-row>

      <el-row :gutter="22" style="padding-bottom:20px;border-bottom: 1px solid #ccc;">
        <el-col :span="8" style="margin-left:60px;padding-left: 0px;">
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">出科科室：</el-col>
          <el-select :span="2" v-model="departmentValue" filterable  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in departmentData"
              :key="item.depart_id"
              :label="item.depart_name"
              :value="item.depart_name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">出科状态：</el-col>
          <el-select :span="2" v-model="rotateStatusValue"  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in rotateStatus"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button :span="3" type="primary" icon="el-icon-search" @click="queryRotatePlanInfos">查询</el-button>
          <el-button :span="3" type="primary" icon="el-icon-search" @click="queryAllRotatePlanInfos">显示全部</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12" style="margin-left:20px;">
          <el-button type="info" icon="el-icon-download">导出学员</el-button>
        </el-col>
        <el-col :span="12">&nbsp;</el-col>
      </el-row>

    </el-header>
    <el-main>
      <el-table :data="studentListData" stripe border :max-height="innerHeight">
        <el-table-column type="index" :index="getIndex" label="序号" width="50"></el-table-column>
        <el-table-column prop="UserName" label="账号"></el-table-column>
        <el-table-column prop="RealName" label="姓名"></el-table-column>
        <el-table-column prop="DepartmentName" label="出科科室"></el-table-column>
        <el-table-column prop="PlanEndDate" label="计划出科时间"></el-table-column>
        <el-table-column prop="RealityEndDate" label="实际出科时间"></el-table-column>
        <el-table-column prop="Remark" label="护士长评价"></el-table-column>
        <el-table-column prop="RealStatus" label="出科状态"></el-table-column>
        <el-table-column prop="operation" label="操作" width="320">
          <template slot-scope="scope">
              <el-button @click.native.prevent="showUserInfos(scope.$index, scope.row)" size="small">
                个人信息
              </el-button>
              <el-button @click.native.prevent="showRotationManual(scope.$index, scope.row)"  size="small">
               轮转手册
              </el-button>
              <el-button @click.native.prevent="approvalOfExit(scope.$index, scope.row)" size="small" v-show="scope.row.RotateStatus==200&&userLoginInfo.user.role=='护理部'">
                出科详情
              </el-button>
              <el-button @click.native.prevent="approvalOfExit(scope.$index, scope.row)" size="small" v-show="(scope.row.RotateStatus==103||scope.row.RotateStatus==104)&&userLoginInfo.user.role=='护士长'">
                审核出科
              </el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination style="float:right;padding-top:20px;" v-show="showpage" 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="curPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
      </el-pagination>
    </el-main>

    <!--弹窗展示个人信息-->
    <el-dialog title="查看个人信息" :visible.sync="showUserdialogVisible">
      <userInfo :UseID="userId"></userInfo>
    </el-dialog>

    <!--弹窗展示审核出科信息-->
    <el-dialog :title="exitdialogTitle" :visible.sync="exitdialogVisible">
      <el-form :model="exitForm" :data="exitUserData">
        <el-row style="margin-bottom:0px;">
        <el-col :span="6">
          <el-form-item label="学员：">
            <span>{{exitUserData.RealName}}（{{exitUserData.UserName}}）</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="科室：">
            <span>{{exitUserData.DepartmentName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="指导老师：">
            <span>{{exitUserData.CoachingName?exitUserData.CoachingName:'-'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轮转时间：">
            <span>{{exitUserData.RealityStartDate}}至{{exitUserData.RealityEndDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
        <el-form-item label="个人总结：" id="personalSummary">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :value="exitUserData.personalSummary" readonly style="background: #eee;"></el-input>
        </el-form-item>
        <template v-if="hidden=='none'">
          <el-form-item label="科室评价：" id="departmentEvaluation">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :value="exitUserData.departmentEvaluation" readonly style="background: #eee;"></el-input>
          </el-form-item>
          <el-row :gutter="10" type="flex">
            <el-col :span="5">护士长评价：</el-col>
            <el-col :span="5">优秀</el-col>
          </el-row>
        </template>
        <template v-else>
          <el-form-item label="科室评价：">
            <el-input type="textarea" placeholder="请填写护士长评语，评价包括医德医风、职业素养、人文关怀、沟通技巧、理论学习、临床实践能力的日常表现等" :autosize="{ minRows: 4, maxRows: 6}" v-model="exitForm.departmentEvaluation"></el-input>
          </el-form-item>
        </template>

        <el-col :style="{display:hidden}">
        <el-form-item label="评价：">
          <el-radio-group v-model="exitForm.evaluation">
            <el-radio label="优秀" style="font-weight: normal;"></el-radio>
            <el-radio label="良好" style="font-weight: normal;"></el-radio>
            <el-radio label="合格" style="font-weight: normal;"></el-radio>
            <el-radio label="不合格" style="font-weight: normal;"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否批准出科：">
          <el-radio-group v-model="exitForm.result">
            <el-radio label="是" style="font-weight: normal;"></el-radio>
            <el-radio label="否" style="font-weight: normal;"></el-radio>
          </el-radio-group>
        </el-form-item>
        </el-col>
      </el-form>
      <div :style="{display:hidden}" slot="footer" class="dialog-footer">
        <el-button @click="exitdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exitdialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--弹窗展示轮转手册-->
    <el-dialog title="轮转手册" :visible.sync="rotationdialogVisible">
      <el-tabs type="border-card">
        <el-tab-pane label="护理部核心能力培训">
          <template>
            <el-tabs type="card" v-model="tabActiveName">
              <el-tab-pane label="岗前教育" name="first">岗前教育</el-tab-pane>
              <el-tab-pane label="基础理论培训" name="second">基础理论培训</el-tab-pane>
              <el-tab-pane label="基础技能量化培训" name="third">基础技能量化培训</el-tab-pane>
            </el-tabs>
          </template>
        </el-tab-pane>
        <el-tab-pane label="其它理论培训">其它理论培训</el-tab-pane>
        <el-tab-pane label="其它技能培训">其它技能培训</el-tab-pane>
        <el-tab-pane label="读书笔记/护理个案/护理查房/讲课">读书笔记/护理个案/护理查房/讲课</el-tab-pane>
      </el-tabs>
    </el-dialog>

  </el-container>
</template>

<script>
import { getRotatePlanList, getDeparmentList } from "@/http/data";
import { mapGetters } from 'vuex';
import userInfo from "@/components/userInfos";

var curYear = new Date().getFullYear();
var curMonth = new Date().getMonth()+1;
var curDate = new Date().getDate() <=15 ? '15':new Date().getDate();

export default {
  name: '',
  components: { userInfo },
  data () {
    return {
      innerHeight:window.innerHeight - 160,
      tabActiveName:'first',
      hidden:'none',
      exitdialogTitle:'',

      DateTimes: 0,
      dateStrArr: [],
      selYearValue:curYear,
      selYearArr: [curYear - 2,curYear - 1,curYear,curYear + 1,curYear + 2],
      selMonthValue:curMonth,
      selMonthArr: [1,2,3,4,5,6,7,8,9,10,11,12],
      selDayValue:curDate,
      selDayArr: [
        {
          id:15,
          name:'15'
        },{
          id:16,
          name:'月底'
        }
      ],

      rotateStatusValue:'',
      rotateStatus:[
        {
          id:0,
          name:'未入科'
        },{
          id:100,
          name:'未申请出科'
        },{
          id:101,
          name:'导师未审核'
        },{
          id:102,
          name:'导师审核不通过'
        },{
          id:103,
          name:'护士长未审核'
        },{
          id:104,
          name:'护士长审核不通过'
        },{
          id:200,
          name:'已出科'
        }
      ],

      departmentValue:'',
      departmentData:[],

      loading:true,//加载
      showpage:false,//是否分页显示
      curPage:1,//当前页数
      pageSize:10,//每页显示条数
      total:100,//总数
      studentListData:[],

      showUserdialogVisible: false,
      userId:0,

      exitdialogVisible:false,
      exitUserData:{},
      exitForm:{
        departmentEvaluation:'',
        evaluation:'',
        result:''
      },

      rotationdialogVisible:false
    }
  },
  activated() {
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  created(){
      this.getRotatePlanList();
      this.getDeparmentList();
  },
  methods: {
    //获取数据列表的序号
    getIndex(index) {
      return (this.curPage-1)*10+index+1;
    },
    //获取护士学员入科数据列表
    getRotatePlanList(){
      var that=this;
      var planEndDate = '';
      if(this.selYearValue&&this.selMonthValue&&this.selDayValue){
        planEndDate = this.selYearValue+'-'+this.selMonthValue;
        planEndDate = this.getMonthEndDate(planEndDate, 'end');
      }
      getRotatePlanList(this.userLoginInfo.guid,this.curPage,this.pageSize,'', this.departmentValue, '', this.rotateStatusValue, planEndDate, '').then(res=>{
          that.loading=false;
          that.studentListData=res.datas.items;
            //获取总数
            that.total=res.datas.count;
            if(that.total>10){that.showpage=true;}
      });
    },
    //分页控件，每页显示的条数
    handleSizeChange(size){
        this.pageSize=size;
        this.getRotatePlanList();
    },
    //分页控件，当前页数
    handleCurrentChange(val) {
      this.curPage=val;
      this.getRotatePlanList();
    },
    //获取科室信息
    getDeparmentList(){
        var that=this;
        getDeparmentList(this.userLoginInfo.guid,this.curPage,10000).then(res=>{
            that.departmentData=res.datas.items;
        });
    },
    //获取每个月的月底所对应的日期
    getMonthEndDate(val,tag){
      var dateStr=val;
      if(dateStr===''||!dateStr||tag===''||!tag){
          return '';
      }
      var _date = new Date(dateStr);
      var curYear =  _date.getFullYear();
      var curMonth =  _date.getMonth()+1;
      var curDate =_date.getDate();
      var isLeapYear=false;
      if(tag==='start'){
          curDate=1;
      }
      if(tag==='end'){
          var solarMonth=[1,3,5,7,8,10,12];
          var lunarMonth=[2,4,6,9,11];
          if(curYear%100===0){
              if(curYear%400===0){
                  isLeapYear=true;
              }
          }else{
              if(curYear%4===0){
                  isLeapYear=true;
              }
          }
          for(var i=0;i<solarMonth.length;i++){
              if(curMonth===solarMonth[i]){
                  curDate=31
                  break;
              }
          }
          for(var i=0;i<lunarMonth.length;i++){
              if(curMonth===2){
                  if(isLeapYear){
                      curDate=29;
                  }else{
                      curDate=28;
                  }
                  break
              }
              if(curMonth===lunarMonth[i]){
                  curDate=30;
                  break;
              }
          }
      }
      curMonth=curMonth>10?curMonth:'0'+curMonth;
      curDate=curDate>10?curDate:'0'+curDate;
      dateStr=curYear+'-'+curMonth+'-'+curDate;
      return dateStr;
    },
    //根据条件查询轮转数据
    queryRotatePlanInfos(){
      this.getRotatePlanList();
    },
    //显示全部轮转信息
    queryAllRotatePlanInfos(){
      this.curPage = 1;
      this.selYearValue = '';
      this.selMonthValue = '';
      this.selDayValue = '';
      this.departmentValue = '';
      this.rotateStatusValue = '';
      this.getRotatePlanList();
    },
    //查看个人信息弹窗
    showUserInfos(index, row) {
      this.showUserdialogVisible = true;
      this.userId = row.UserId;
    },
    //批准出科弹窗
    approvalOfExit(index, row){
      this.exitdialogVisible = true;
      this.exitdialogTitle = row.RotateStatus=='200' ? '出科详情':'审核出科';
      this.hidden = row.RotateStatus=='200' ? 'none':'block';
      this.exitUserData = row;
    },
    //展示轮转手册
    showRotationManual(index, row){
      this.rotationdialogVisible = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
td,th div{text-align: center;}
th{color:#333;text-align: center;}

.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
.el-form label{
  font-weight: bold;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 110px;
  color: #99a9bf;
  text-align: right !important;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
#personalSummary textarea{
  background: #eee;
}
.el-form .el-form-item label{
  font-weight: bold;
}
</style>
