<template>
  <div class="selectFromPeople">
    <el-container>
      <el-header style="background-color:#67C23A;">
        <el-autocomplete class="inline-input" value-key="real_name" v-model="seachValue" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" style="width:300px;margin-top: 10px;">
          <el-button slot="append" icon="el-icon-search" @click.native="seachClick"></el-button>
        </el-autocomplete>
        <el-button style="margin-left:30px;" @click.native.prevent="downfile">
          导出
        </el-button>
      </el-header>
      <el-main>
        <el-table :data="selectPeoplePlanData.plans" stripe border :max-height="innerHeight" ref='datatable' id="datatable_people" style="width: 100%;">
          <!-- <el-table-column prop="date" label="序号" width="180">
          </el-table-column> -->
          <el-table-column type="index" label="序号" width="100" :index="indexMethod">
          </el-table-column>
          <el-table-column label="轮转科室">
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

      </el-main>
    </el-container>

  </div>
</template>

<script>
import exportExcel from "@/excel";
import { getNurseinfoList, userstatistic } from '../http/data'
import { mapGetters } from 'vuex'
var that;
export default {
  name: '',
  created () {
    that = this;
    getNurseinfoList(this.userLoginInfo.guid, 1, 100).then(res => {
      that.restaurants = res.datas.items
    })
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  data () {
    return {
      innerHeight: window.innerHeight - 160,
      seachValue: "",
      seachID: -1,
      restaurants: [],
      selectPeopleDatas: [],
      selectPeoplePlanData: []
    };
  },
  methods: {
    indexMethod (index) {
      return index + 1;
    },
    selectPlan (index, row) {

      userstatistic(this.userLoginInfo.guid, row.id).then(res => {
        that.selectPeoplePlanData = res.datas
      })

    },
    downfile () {
      exportExcel(document.querySelector("#datatable_people"), "aaa.xlsx");
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
      this.seachID = item.id
      userstatistic(this.userLoginInfo.guid, item.id).then(res => {
        that.selectPeoplePlanData = res.datas
      })
    },
    seachClick () {
      userstatistic(this.userLoginInfo.guid, this.seachID).then(res => {
        that.selectPeoplePlanData = res.datas
      })
    }
  },
  mounted () {
    window.onresize = () => {
      that.innerHeight = window.innerHeight - 160;
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.selectFromPeople{
  height: 100%;
}
</style>
