<template>
  <el-container>

    <el-header style="min-height:190px;height:auto;margin-top:30px;overflow: hidden;">
      <el-row :gutter="12" type="flex">
        <el-col :span="3" style="padding-top:5px;padding-left:15px;margin-left:10px;text-align: center;">计划入科时间：</el-col>
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
            <el-option v-for="item in selDayArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">日</el-col>
        </el-col>
      </el-row>

      <el-row :gutter="22" type="flex" style="padding-bottom:20px;border-bottom: 1px solid #ccc;">
        <el-col :span="8" style="margin-left:60px;padding-left:0px;">
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">入科科室：</el-col>
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
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">入科状态：</el-col>
          <el-select :span="2" v-model="rotateStatusValue"  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in rotateStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button :span="3" type="primary" icon="el-icon-search" @click="queryRotatePlanInfos">查询</el-button>
          <el-button :span="3" type="primary" icon="el-icon-search" @click="queryAllRotatePlanInfos">显示全部</el-button>
        </el-col>
      </el-row>

      <el-row type="flex" :gutter="24">
        <el-col :span="12" style="margin-left:20px;">
          <el-button type="info" icon="el-icon-download" @click.native.prevent="exportData">导出学员</el-button>
        </el-col>
        <el-col :span="12">&nbsp;</el-col>
      </el-row>

    </el-header>

    <el-main>
      <el-table :data="studentListData" v-loading="loading" stripe border :max-height="innerHeight" id="datatable1">
        <el-table-column type="index" :index="getIndex" label="序号" width="50"></el-table-column>
        <el-table-column prop="UserName" label="账号"></el-table-column>
        <el-table-column prop="RealName" label="姓名"></el-table-column>
        <el-table-column prop="OriginalDepartmentName" label="原科室"></el-table-column>
        <el-table-column prop="DepartmentName" label="入科科室"></el-table-column>
        <el-table-column prop="PlanStartDate" label="计划入科时间"></el-table-column>
        <el-table-column prop="PlanEndDate" label="计划出科时间"></el-table-column>
        <el-table-column prop="RealityStartDate" label="实际入科时间"></el-table-column>
        <el-table-column prop="RealStatus" label="入科状态"></el-table-column>
        <el-table-column prop="operation" style="width:200px;" label="操作" width="220">
          <template slot-scope="scope">
              <el-button @click.native.prevent="showUserInfos(scope.$index, scope.row)" size="small">
                个人信息
              </el-button>
              <el-button @click.native.prevent="approvalOfEntry(scope.$index, scope.row)" size="small" v-show="scope.row.RotateStatus==0&&userLoginInfo.user.role=='护士长'">
                批准入科
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

    <!--弹窗展示批准入科信息-->
    <el-dialog title="批准入科" :visible.sync="entrydialogVisible">
      <el-form :model="entryForm" :data="entryUserData" id="entryForm">
        <el-form-item label="账号：">
          <span>{{entryUserData.UserName}}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span>{{entryUserData.RealName}}</span>
        </el-form-item>
        <el-form-item label="计划轮转日期：">
          <span>{{entryUserData.PlanStartDate}}至{{entryUserData.PlanEndDate}}</span>
        </el-form-item>
        <el-form-item label="实际入科日期：">
          <el-date-picker type="date" placeholder="选择日期" v-model="entryForm.realStartDate" ></el-date-picker>
        </el-form-item>
        <el-form-item label="导师：">
          <el-radio-group v-model="entryForm.baseTeacher">
            <el-radio label="张三" style="float: left;width: 90px;text-align: left;font-weight: normal;"></el-radio>
            <el-radio label="李四" style="float: left;width: 90px;text-align: left;font-weight: normal;"></el-radio>
            <el-radio label="王五" style="float: left;width: 90px;text-align: left;font-weight: normal;"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="entrydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="entrydialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getRotatePlanList, getDeparmentList } from "@/http/data";
import { mapGetters } from 'vuex';
import exportExcel from "@/excel";
import userInfo from "@/components/userInfos";

var curYear = new Date().getFullYear();
var curMonth = new Date().getMonth()+1;
var curDate = new Date().getDate()>=16 ? '16':'1';

export default {
  name: '',
  components: { userInfo },
  data () {
    return {
      innerHeight:window.innerHeight - 160,

      selYearValue:curYear,
      selYearArr: [curYear - 2,curYear - 1,curYear,curYear + 1,curYear + 2],
      selMonthValue:curMonth,
      selMonthArr: [1,2,3,4,5,6,7,8,9,10,11,12],
      selDayValue:curDate,
      selDayArr: [1,16],

      rotateStatusValue:'',
      rotateStatus:[
        {
          id:0,
          name:'未批准入科'
        },{
          id:1000,
          name:'已入科'
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

      entrydialogVisible:false,
      entryUserData:{},
      entryForm:{
        realStartDate:'',
        baseTeacher:''
      }

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
      var planStartDate = '';
      if(this.selYearValue&&this.selMonthValue&&this.selDayValue){
        planStartDate = this.selYearValue+'-'+this.selMonthValue+'-'+this.selDayValue;
      }
      getRotatePlanList(this.userLoginInfo.guid,this.curPage,this.pageSize,'', this.departmentValue, '', this.rotateStatusValue, '', planStartDate).then(res=>{
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
    //批准入科弹窗
    approvalOfEntry(index, row){
      this.entrydialogVisible = true;
      this.entryUserData = row;
      //设置实际入科时间的默认时间==计划入科时间
      this.entryForm.realStartDate = new Date(this.entryUserData.PlanStartDate);
    },
    //导出数据
    exportData() {
      //使用el-table,如果有操作那一栏table元素需要#datatable1 .el-table__fixed-right，没有的话就#datatable1
      exportExcel(document.querySelector("#datatable1"),'学员入科数据列表.xlsx');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
td,th div{text-align: center;}
th{color:#333;text-align: center;}

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
#entryForm label{
  width: 50%;
  text-align: right;
  font-weight: bold;
}
</style>
