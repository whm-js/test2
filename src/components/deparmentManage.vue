<template>
<div class="deparmentManage">
    <h3>科室管理</h3>
    <div class="select_domain">
        <span>科室名称: <el-input v-model="selectdeparmentName" placeholder="请输入科室名称" style="width:250px;"></el-input></span>
        <el-button icon="el-icon-search" style="margin-left:15px;">查询</el-button>
        <el-button>显示全部</el-button>
    </div>
    <div style="padding:20px;border-bottom:1px solid #ccc;">
        <el-button icon="el-icon-download">导出科室信息</el-button>
    </div>
    <div class="data_list">
        <el-main>
            <el-table :data="deparmentListData" stripe border style="width: 100%;">
            <el-table-column prop="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="deparmentName" label="科室名称"></el-table-column>
            <el-table-column prop="courseName" label="所属科片"></el-table-column>
            <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
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
    </div>
</div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      selectdeparmentName: "",
      deparmentListData:[
          {
              index:1,
              deparmentName:'儿科',
              courseName:'儿科'
          },{
              index:2,
              deparmentName:'妇科',   
              courseName:'妇科'           
          },{
              index:2,
              deparmentName:'妇科',   
              courseName:'妇科'           
          },{
              index:2,
              deparmentName:'妇科',   
              courseName:'妇科'           
          }
      ],
    };
  },
  methods:{
      handleEdit(index,row){

      },
      handleDelete(index,row){

      }
  }
};
</script>

<style>
h3 {margin-left: 20px;}
.deparmentManage {height: 100%;padding:10px;}
.select_domain{border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:20px;}
.data_list table th,td{text-align: center;}
</style>
