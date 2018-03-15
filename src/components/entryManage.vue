<template>
  <el-container>

    <el-header style="min-height:190px;height:auto;margin-top:30px;overflow: hidden;">
      <el-row :gutter="12" type="flex">
        <el-col :span="3" style="padding-top:5px;padding-left:15px;margin-left:10px;text-align: center;">计划入科时间：</el-col>
        <el-col :span="3">
        <el-select :span="2" v-model="selYearValue"  placeholder="请选择" style="float:left;width:100px;margin-left:3px;">
            <el-option v-for="item in selYearArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">年</el-col>
        </el-col>
        <el-col :span="3">
          <el-select :span="2" v-model="selMonthValue"  placeholder="请选择" style="float:left;width:100px;">
            <el-option v-for="item in selMonthArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">月</el-col>
        </el-col>
        <el-col :span="3">
          <el-select :span="2" v-model="selDayValue"  placeholder="请选择" style="float:left;width:100px;">
            <el-option v-for="item in selDayArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-col :span="1" style="float:left;padding-top:8px;">日</el-col>
        </el-col>
      </el-row>

      <el-row :gutter="22" type="flex" style="padding-bottom:20px;border-bottom: 1px solid #ccc;">
        <el-col :span="9" style="margin-left:60px;padding-left:0px;">
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">入科科室：</el-col>
          <el-select :span="3" v-model="departmentValue" filterable  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in departmentData"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <el-col :span="6" style="float: left;padding:5px 10px 0px 0px;">入科状态：</el-col>
          <el-select :span="3" v-model="rotateStatusValue"  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in rotateStatus"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
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
      <el-table :data="studentListData" stripe border :max-height="innerHeight" id="datatable1">
        <el-table-column prop="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="oldDepartment" label="原科室"></el-table-column>
        <el-table-column prop="department" label="入科科室"></el-table-column>
        <el-table-column prop="planStartDate" label="计划入科时间"></el-table-column>
        <el-table-column prop="planEndDate" label="计划出科时间"></el-table-column>
        <el-table-column prop="realStartDate" label="实际入科时间"></el-table-column>
        <el-table-column prop="rotateStatus" label="入科状态"></el-table-column>
        <el-table-column prop="operation" style="width:200px;" label="操作" width="120">
          <template slot-scope="scope">
              <el-button @click.native.prevent="showUserInfos(scope.$index, scope.row)" size="small">
                个人信息
              </el-button>
              <el-button @click.native.prevent="approvalOfEntry(scope.$index, scope.row)" size="small" style="display: none;">
                批准入科
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!--弹窗展示个人信息-->
    <el-dialog title="查看个人信息" :visible.sync="showUserdialogVisible">
      <userInfo :UserData="userData"></userInfo>
    </el-dialog>

    <!--弹窗展示批准入科信息-->
    <el-dialog title="批准入科" :visible.sync="entrydialogVisible">
      <el-form :model="entryForm" :data="userData" id="entryForm">
        <el-form-item label="账号：">
          <span>{{userData.userName}}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span>{{userData.realName}}</span>
        </el-form-item>
        <el-form-item label="计划轮转日期：">
          <span>{{userData.planStartDate}}-{{userData.planEndDate}}</span>
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
import exportExcel from "@/excel";
import userInfo from "@/components/userInfos";
var curYear = new Date().getFullYear();

export default {
  name: '',
  components: { userInfo },
  data () {
    return {
      innerHeight:window.innerHeight - 160,

      DateTimes: 0,
      dateStrArr: [],
      selYearValue:'',
      selYearArr: [curYear - 2,curYear - 1,curYear,curYear + 1,curYear + 2],
      selMonthValue:'',
      selMonthArr: [1,2,3,4,5,6,7,8,9,10,11,12],
      selDayValue:'',
      selDayArr: [1,16],

      rotateStatusValue:'',
      rotateStatus:[
        {
          id:2,
          name:'未批准入科'
        },{
          id:100,
          name:'已入科'
        }
      ],

      departmentValue:'',
      departmentData:[
        {
          departmentId:1,
          departmentName:'儿科'
        },{
          departmentId:2,
          departmentName:'内科'
        },{
          departmentId:3,
          departmentName:'神经内科'
        },{
          departmentId:4,
          departmentName:'全科'
        },{
          departmentId:5,
          departmentName:'妇产科'
        }

      ],

      studentListData:[
        {
          index:1,
          userName:'13333333333',
          realName:'张三',
          oldDepartment:'内科',
          department:'妇产科',
          planStartDate:'2017-10-1',
          planEndDate:'2018-1-30',
          realStartDate:'2017-11-1',
          rotateStatus:'未批准入科'
        },{
          index:1,
          userName:'13333333333',
          realName:'张三',
          oldDepartment:'内科',
          department:'妇产科',
          planStartDate:'2017-10-1',
          planEndDate:'2018-1-30',
          realStartDate:'2017-11-1',
          rotateStatus:'已入科'
        },{
          index:1,
          userName:'13333333333',
          realName:'张三',
          oldDepartment:'内科',
          department:'妇产科',
          planStartDate:'2017-10-1',
          planEndDate:'2018-1-30',
          realStartDate:'2017-11-1',
          rotateStatus:'已入科'
        },{
          index:1,
          userName:'13333333333',
          realName:'张三',
          oldDepartment:'内科',
          department:'妇产科',
          planStartDate:'2017-10-1',
          planEndDate:'2018-1-30',
          realStartDate:'2017-11-1',
          rotateStatus:'已入科'
        }
      ],

      showUserdialogVisible: false,
      userData:{
        userName:'145709',
        role:'护士',
        realName:'张三',
        workNo:'N 0',
        sex:'男',
        work:'护士',
        education:'本科生',
        joinHospitalTime:'2015-2-4',
        political:'党员',
        birthday:'1990-1-1',
        finishSchool:'北京大学',
        joinWorkTime:'2014-6-1',
        finishTime:'2013-6',
        certificateTime:'2016-5-4',
        address:'广西柳州市城中区',
        workTime:'2016-9',
        planStartDate:'2017-12-1',
        planEndDate:'2018-3-30'
      },

      entrydialogVisible:false,
      entryForm:{
        realStartDate:'',
        baseTeacher:''
      }

    }
  },
  activated() {
    window.scrollTo(0, 0);
  },
  methods: {
    //查看个人信息弹窗
    showUserInfos(index, row) {
      this.showUserdialogVisible = true;
    },
    //批准入科弹窗
    approvalOfEntry(index, row){
      this.entrydialogVisible = true;
    },
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
