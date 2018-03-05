<template>
  <el-container>
    <el-header style="height:190px;margin-top:30px;overflow: hidden;">
      <el-row :gutter="20">
        <el-col :span="3" style="padding-top:5px;text-align: right;">计划出科时间：</el-col>
        <el-col :span="3">
        <el-select v-model="selYearValue"  placeholder="请选择" style="width:100px;">
            <el-option v-for="item in selYearArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span>年</span>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selMonthValue"  placeholder="请选择" style="width:100px;">
            <el-option v-for="item in selMonthArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span>月</span>
        </el-col>
        <el-col :span="3">
          <el-select v-model="selDayValue"  placeholder="请选择" style="width:100px;">
            <el-option v-for="item in selDayArr" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <span>日</span>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="padding-bottom:20px;border-bottom: 1px solid #ccc;">
        <el-col :span="6" style="margin-left:60px;">
          <span style="float: left;padding:5px 10px 0px 0px;">出科科室：</span>
          <el-select v-model="departmentValue" filterable  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in departmentData"
              :key="item.departmentId"
              :label="item.departmentName"
              :value="item.departmentName">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span style="float: left;padding:5px 10px 0px 0px;">出科状态：</span>
          <el-select v-model="rotateStatusValue"  placeholder="请选择" style="width:180px;">
            <el-option
              v-for="item in rotateStatus"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" style="margin-left:20px;">
          <el-button type="info" icon="el-icon-download">导出学员</el-button>
        </el-col>
        <el-col :span="12">&nbsp;</el-col>
      </el-row>

    </el-header>
    <el-main>
      <el-table :data="studentListData" stripe border :max-height="innerHeight">
        <el-table-column prop="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column prop="department" label="出科科室"></el-table-column>
        <el-table-column prop="planEndDate" label="计划出科时间"></el-table-column>
        <el-table-column prop="evaluate" label="护士长评价"></el-table-column>
        <el-table-column prop="realEndDate" label="实际出科时间"></el-table-column>
        <el-table-column prop="rotateStatus" label="出科状态"></el-table-column>
        <el-table-column prop="operation" label="操作" width="320">
          <template slot-scope="scope">
              <el-button @click.native.prevent="showUserInfos(scope.$index, scope.row)" size="small">
                个人信息
              </el-button>
              <el-button  size="small">
               轮转手册
              </el-button>
              <el-button @click.native.prevent="approvalOfExit(scope.$index, scope.row)" size="small">
                批准出科
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!--弹窗展示个人信息-->
    <el-dialog title="查看个人信息" :visible.sync="showUserdialogVisible">
      <template slot-scope="">
        <el-form :data="userData" label-position="left" inline class="demo-table-expand">
          <el-form-item label="账号：">
            <span>{{userData.userName}}</span>
          </el-form-item>
          <el-form-item label="角色：">
            <span>{{userData.role}}</span>
          </el-form-item>
          <el-form-item label="姓名：">
            <span>{{userData.realName}}</span>
          </el-form-item>
          <el-form-item label="职级：">
            <span>{{userData.workNo}}</span>
          </el-form-item>
          <el-form-item label="性别：">
            <span>{{userData.sex}}</span>
          </el-form-item>
          <el-form-item label="职称：">
            <span>{{userData.work}}</span>
          </el-form-item>
          <el-form-item label="学历：">
            <span>{{userData.education}}</span>
          </el-form-item>
          <el-form-item label="来院时间：">
            <span>{{userData.joinHospitalTime}}</span>
          </el-form-item>
          <el-form-item label="政治面貌：">
            <span>{{userData.political}}</span>
          </el-form-item>
          <el-form-item label="出生年月：">
            <span>{{userData.birthday}}</span>
          </el-form-item>
          <el-form-item label="毕业院校：">
            <span>{{userData.finishSchool}}</span>
          </el-form-item>
          <el-form-item label="参加工作时间：">
            <span>{{userData.joinWorkTime}}</span>
          </el-form-item>
          <el-form-item label="毕业时间：">
            <span>{{userData.finishTime}}</span>
          </el-form-item>
          <el-form-item label="获取执业证书：">
            <span>{{userData.certificateTime}}</span>
          </el-form-item>
          <el-form-item label="家庭地址：">
            <span>{{userData.address}}</span>
          </el-form-item>
          <el-form-item label="获得职称时间：">
            <span>{{userData.workTime}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <!--弹窗展示批准入科信息-->
    <el-dialog title="批准出科" :visible.sync="exitdialogVisible">
      <el-form :model="exitForm" :data="userData">
        <el-row style="margin-bottom:0px;">
        <el-col :span="6">
          <el-form-item label="学员：">
            <span>{{userData.realName}}（{{userData.userName}}）</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="科室：">
            <span>{{userData.departmentName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="指导老师：">
            <span>{{userData.teacherName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轮转时间：">
            <span>{{userData.planStartDate}}-{{userData.planEndDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
        <el-form-item label="个人总结：" id="personalSummary">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :value="userData.personalSummary" readonly style="background: #eee;"></el-input>
        </el-form-item>

        <el-form-item label="科室评价：">
          <el-input type="textarea" placeholder="请填写护士长评语，评价包括医德医风、职业素养、人文关怀、沟通技巧、理论学习、临床实践能力的日常表现等" :autosize="{ minRows: 4, maxRows: 6}" v-model="exitForm.departmentEvaluation"></el-input>
        </el-form-item>
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exitdialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      innerHeight:window.innerHeight - 160,

      DateTimes: 0,
      dateStrArr: [],
      selYearValue:'',
      selYearArr: [2016,2017,2018,2019],
      selMonthValue:'',
      selMonthArr: [1,2,3,4,5,6,7,8,9,10,11,12],
      selDayValue:'',
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
          name:'未审批'
        },{
          id:2,
          name:'未入科'
        },{
          id:100,
          name:'未申请出科'
        },{
          id:101,
          name:'老师未填写评语'
        },{
          id:102,
          name:'科主任未审核'
        },{
          id:200,
          name:'已出科'
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
          userName:'18888888888',
          realName:'李四',
          department:'妇产科',
          planEndDate:'2018-1-30',
          evaluate:'优秀',
          realEndDate:'2018-3-30',
          rotateStatus:'已出科',
          operation:'个人信息 轮转手册 出科详情'
        },{
          index:1,
          userName:'18888888888',
          realName:'李四',
          department:'妇产科',
          planEndDate:'2018-1-30',
          evaluate:'优秀',
          realEndDate:'2018-3-30',
          rotateStatus:'已出科',
          operation:'个人信息 轮转手册 出科详情'
        },{
          index:1,
          userName:'18888888888',
          realName:'李四',
          department:'妇产科',
          planEndDate:'2018-1-30',
          evaluate:'优秀',
          realEndDate:'2018-3-30',
          rotateStatus:'已出科',
          operation:'个人信息 轮转手册 出科详情'
        },{
          index:1,
          userName:'18888888888',
          realName:'李四',
          department:'妇产科',
          planEndDate:'2018-1-30',
          evaluate:'优秀',
          realEndDate:'2018-3-30',
          rotateStatus:'已出科',
          operation:'个人信息 轮转手册 出科详情'
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
        planEndDate:'2018-3-30',
        personalSummary:'22222222222222222222222',
        departmentName:'妇产科',
        teacherName:'王五'
      },

      exitdialogVisible:false,
      exitForm:{
        departmentEvaluation:'',
        evaluation:'',
        result:''
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
    //批准出科弹窗
    approvalOfExit(index, row){
      this.exitdialogVisible = true;
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
