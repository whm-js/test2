<template>
  <div class="selectFromDepartment">
    <el-container>
      <el-header style="background-color:#67C23A;">
        <!-- <el-input style="width:300px;margin-top: 10px;" placeholder="输入科室搜索" v-model="seachValue" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input> -->
        <el-autocomplete class="inline-input" value-key="depart_name" v-model="seachValue" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" style="width:300px;margin-top: 10px;">
          <el-button slot="append" icon="el-icon-search" @click.native="seachClick(seachValue)"></el-button>
        </el-autocomplete>
        <el-button style="margin-left:30px;" @click.native.prevent="downfile">
          导出
        </el-button>
      </el-header>
      <el-main>
        <el-table :data="selectData.items" stripe border :max-height="innerHeight" ref='datatable' id="datatable1" style="width: 100%;">
          <!-- <el-table-column prop="date" label="序号" width="180">
          </el-table-column> -->
          <el-table-column type="index" label="序号" width="50" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="month" label="月份">
          </el-table-column>
          <el-table-column prop="quantity" label="轮转人数">
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="selectPeople(scope.$index, scope.row)" size="small">
                查看轮转人员
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="float:right;" v-show="showpage" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[12, 24, 36, 48, 60]" :page-size="currentPageSize" layout="sizes, prev, pager, next" :total="total">
        </el-pagination>

      </el-main>
    </el-container>

    <el-dialog title="科室轮转人员详情" :visible.sync="dialogTableVisible">

      <el-dialog width="50%" title="调整计划" :visible.sync="innerdialogVisible" append-to-body>
        <el-row>
          <el-col :span="24">
            <div style="width:100%;height:40px;">
              <span style="margin-left: 50px;float: left;">姓名：{{selectPeoplePlanData.real_name}}</span>
              <span style="margin-right: 50px;float: right;">账号：{{selectPeoplePlanData.user_name}}</span>
            </div>
          </el-col>
        </el-row>
        <el-table :data="selectPeoplePlanData.plans" height="400" border stripe>
          <el-table-column property="depart_name" label="轮转科室">
            <template slot-scope="scope">
              <span>{{ scope.row.depart_name }}({{scope.row.plan_duration}}个月)</span>
            </template>
          </el-table-column>
          <el-table-column label="轮转时段">
            <template slot-scope="scope">
              <span>{{ scope.row.plan_start }} - {{scope.row.plan_end}}</span>
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="innerdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="innerdialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-row>
        <el-col :span="24">
          <div style="width:100%;height:40px;">
            <span style="margin-left: 50px;float: left;">轮转时间：{{selectMonth.month}}</span>
            <span style="margin-right: 50px;float: right;">轮转科室：{{seachValue}}</span>
          </div>
        </el-col>
      </el-row>
      <el-table :data="selectPeopleDatas" height="400" border stripe id="aaaa">
        <el-table-column property="user_name" label="账号"></el-table-column>
        <el-table-column property="real_name" label="护士姓名"></el-table-column>
        <el-table-column label="轮转时间">
          <template slot-scope="scope">
            <span>{{ scope.row.plan_start }} - {{scope.row.plan_end}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="selectPlan(scope.$index, scope.row)" size="small">
              查看计划
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import exportExcel from "@/excel";
import { getDeparmentList, departmentstatistic, usersindepartment, userstatistic } from '../http/data'
import { mapGetters } from 'vuex'
var that;
export default {
  name: "",
  created () {
    that = this;
    getDeparmentList(this.userLoginInfo.guid, 1, 100).then(res => {
      that.restaurants = res.datas.items
      // that.showpage = true;
    })
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  data () {
    return {
      innerHeight: window.innerHeight - 195,
      dialogTableVisible: false,
      innerdialogVisible: false,
      seachValue: "",
      selectMonth: {},
      selectPeopleData: {},
      selectData: [],
      restaurants: [],
      selectPeopleDatas: [],
      selectPeoplePlanData: [],
      showpage: false,
      currentPage: 1,
      currentPageSize: 12,
      total: 100,
    };
  },
  methods: {
    indexMethod (index) {
      return index + 1;
    },
    selectPeople (index, row) {
      // console.log(row)
      this.selectMonth = row
      usersindepartment(this.userLoginInfo.guid, row.department_id, row.month).then(res => {
        that.selectPeopleDatas = res.datas
        // console.log(that.selectPeopleData)
      })
      this.dialogTableVisible = true;
    },
    selectPlan (index, row) {
      console.log(row)
      // this.selectPeopleData = row
      userstatistic(this.userLoginInfo.guid, row.id).then(res => {
        console.log(res.datas)
        that.selectPeoplePlanData = res.datas
      })
      this.innerdialogVisible = true;
    },
    downfile () {
      exportExcel(document.querySelector("#datatable1"), "aaa.xlsx");
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.depart_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect (item) {
      // console.log(item);
      departmentstatistic(this.userLoginInfo.guid, item.depart_name, this.currentPage, this.currentPageSize).then(res => {
        that.selectData = res.datas
        that.total = that.selectData.count
        that.showpage = true;
        // console.log(that.selectData)
      })
    },
    seachClick (seachvalue) {
      departmentstatistic(this.userLoginInfo.guid, seachvalue, this.currentPage, this.currentPageSize).then(res => {
        that.selectData = res.datas
        that.total = that.selectData.count
        that.showpage = true;
        // console.log(that.selectData)
      })
    },
    //分页控件，每页显示的条数
    handleSizeChange (size) {
      this.currentPageSize = size;
      this.seachClick(this.seachValue);
    },
    //分页控件，当前页数
    handleCurrentChange (val) {
      this.currentPage = val;
      this.seachClick(this.seachValue);
    }
  },
  mounted () {
    window.onresize = () => {
      that.innerHeight = window.innerHeight - 195;
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.selectFromDepartment {
  height: 100%;
}
</style>
