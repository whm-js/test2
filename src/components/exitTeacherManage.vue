<template>
  <el-container>
    <el-header style="min-height:90px;height:auto;margin-top:30px;overflow: hidden;">
      <el-row :gutter="18">
        <el-col :span="3" style="padding-top:5px;text-align: right;">实际入科时间：</el-col>
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
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-steps :active="stepActive" simple style="margin-top: 20px">
        <el-step title="护理部岗前理论培训" ></el-step>
        <el-step title="科室岗前培训" ></el-step>
        <el-step title="护理部基础理论" ></el-step>
        <el-step title="基础技能" ></el-step>
        <el-step title="专业基础能力" ></el-step>
        <el-step title="专业技能能力" ></el-step>
        <el-step title="应急处理和急救能力" ></el-step>
        <el-step title="教育与培训能力" ></el-step>
        <el-step title="综合能力" ></el-step>
      </el-steps>

      <el-tabs v-model="tabActiveName" >
        <el-tab-pane label="" name="stepTab_0">
          <el-col class="cur-title">当前目录：<strong>护理部岗前理论培训</strong></el-col>
          <el-table :data="tableData3" height="250" border style="width: 100%">
            <el-table-column prop="index" label="序号"></el-table-column>
            <el-table-column prop="context" label="培训内容"></el-table-column>
            <el-table-column prop="date" label="培训日期"></el-table-column>
            <el-table-column prop="time" label="学时"></el-table-column>
            <el-table-column prop="pjDate" label="评价日期"></el-table-column>
            <el-table-column prop="score" label="得分"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_1">
          <el-col class="cur-title">当前目录：<strong>科室岗前培训</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_2">
          <el-col class="cur-title">当前目录：<strong>护理部基础理论</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_3">
          <el-col class="cur-title">当前目录：<strong>基础技能</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_4">
          <el-col class="cur-title">当前目录：<strong>专业基础能力</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_5">
          <el-col class="cur-title">当前目录：<strong>专业技能能力</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_6">
          <el-col class="cur-title">当前目录：<strong>应急处理和急救能力</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_7">
          <el-col class="cur-title">当前目录：<strong>教育与培训能力</strong></el-col>
        </el-tab-pane>
        <el-tab-pane label="" name="stepTab_8">
          <el-col class="cur-title">当前目录：<strong>综合能力</strong></el-col>
        </el-tab-pane>
      </el-tabs>
      <el-col style="margin-top:10px;">
        <el-button @click="pre" :style="{display:preHidden}">上一步</el-button>
        <el-button type="primary" @click="next" :style="{display:nextHidden}">下一步</el-button>
      </el-col>
    </el-main>

  </el-container>
</template>

<script>
import userInfo from "@/components/userInfos";
export default {
  name: '',
  components: { userInfo },
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

      preHidden:'none',
      nextHidden:'inline-block',
      stepActive:0,//当前操作的步骤页面
      tabActiveName:'stepTab_0',

      tableData3:[
        {
          index:1,
          context:'专科护理常规',
          date:'2017-10-8',
          time:10,
          pjDate:'2017-10-12',
          score:80
        },{
          index:1,
          context:'专科护理常规',
          date:'2017-10-8',
          time:10,
          pjDate:'2017-10-12',
          score:80
        },{
          index:1,
          context:'专科护理常规',
          date:'2017-10-8',
          time:10,
          pjDate:'2017-10-12',
          score:80
        }
      ]
    }
  },
  activated() {
    window.scrollTo(0, 0);
  },
  methods: {
    //上一步
    pre:function(){
      this.tabActiveName = 'stepTab_'+(this.stepActive-1);
      this.nextHidden = 'inline-block';
      if (this.stepActive-- ==1) {
        this.preHidden = 'none';
      };
    },
    //下一步
    next:function(){
      this.tabActiveName = 'stepTab_'+(this.stepActive+1);
      this.preHidden = 'inline-block';//显示上一步按钮
      if (this.stepActive++ == 7) {//当前显示最后一步，判断控制在倒数第二步
        this.nextHidden = 'none';
      };
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
td,th div{text-align: center;}
th{color:#333;text-align: center;}
.cur-title{
  height:40px;
  line-height: 40px;
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
.el-steps--simple {
    padding: 13px 4%;
}
.el-step.is-simple .el-step__main{
  min-width: 100px;
}
</style>
