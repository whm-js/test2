<template>
<div class="deparmentManage">
    <h3>科室管理</h3>
    <div class="select_domain">
        <span>科室名称: <el-input v-model="selectdeparmentName" placeholder="请输入科室名称" style="width:250px;"></el-input></span>
        <el-button icon="el-icon-search" style="margin-left:15px;">查询</el-button>
        <el-button @click="getDeparmentListAll">显示全部</el-button>
    </div>
    <div style="padding:20px;border-bottom:1px solid #ccc;">
        <el-button icon="el-icon-download">导出科室信息</el-button>
    </div>
    <div class="data_list">
        <el-main>
            <el-table :data="deparmentListData" stripe border style="width: 100%;">
                <el-table-column type="index" :index="indexmothod" label="序号" width="50"></el-table-column>
                <el-table-column prop="depart_name" label="科室名称"></el-table-column>
                <el-table-column prop="range_name" label="所属科片"></el-table-column>
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
    <el-dialog id='editdeparment' title="编辑科室信息" :visible.sync="dialogFormVisible">
        <el-row :gutter="24" type="flex">
            <el-col :span="4" :offset="5" class="textalign"><font>*</font><span>科室名称：</span></el-col>
            <el-col :span="8"><span style="line-height:42px;">{{deparmentinfo.depart_name}}</span></el-col>
        </el-row>
        <el-row style="padding-top:20px;">
            <el-col :span="4" :offset="5" class="textalign"><span>所属科片：</span></el-col>
            <el-col :span="8">
                <template>
                    <el-select v-model="deparmentinfo.range_name" placeholder="请选择" @change="changroleselect">
                        <el-option
                        v-for="item in rangeOprations"
                        :key="item.range_id"
                        :label="item.range_name"
                        :value="item.range_id">
                        </el-option>
                    </el-select>
                </template>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editdeparmentinfo">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import { getDeparmentList,getRangeList,updateDeparment,deleteDeparment} from "@/http/data";
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';
export default {
  name: "",
  data() {
    return {
      selectdeparmentName: "",
      deparmentListData:[],
      dialogFormVisible:false,
      deparmentinfo:{},
      rangeOprations:{},
      changeRangid:1,//更新的科片ID
      showpage:false,
      currentPage:1,//当前页数
      currentPageSize:10,//每页显示条数
      total:100,//数据总数
    };
  },
  methods:{
      //获取所有科室信息
      getDeparmentList(){
          var that=this;
          getDeparmentList(this.userLoginInfo.guid,this.currentPage,this.currentPageSize).then(res=>{
              that.deparmentListData=res.datas.items;
              that.total=res.datas.count;
              if(that.total>10){ that.showpage=true;}
          });
      },
      //显示全部
      getDeparmentListAll(){
          this.currentPage=1;
          this.currentPageSize=10;
          this.getDeparmentList();
      },
      //获取科片信息
      getRangeList(){
          var that=this;
          getRangeList(this.userLoginInfo.guid).then(res=>{
              that.rangeOprations=res.datas;
          });
      },
      //序号
      indexmothod(index) {
        return (this.currentPage-1)*10+index+1;
      },
      //分页控件，每页显示的条数
      handleSizeChange(size){
          this.currentPageSize=size;
          this.getDeparmentList();
      },
      //分页控件，当前页数
      handleCurrentChange(val) {
        this.currentPage=val;
        this.getDeparmentList();
      },
      //下拉框数据变更
      changroleselect(value){
          this.changeRangid=value;
      },
      handleEdit(index,row){
          this.dialogFormVisible=true;
          this.deparmentinfo=row; 
          this.changeRangid=row.range_id;
      },
      //编辑科室信息
      editdeparmentinfo(){
          var that=this;
          var id=this.changeRangid;
          console.log('id is:'+id+'range_id is:'+this.deparmentinfo.range_id);
          if(id!=this.deparmentinfo.range_id){
            updateDeparment(this.userLoginInfo.guid,this.deparmentinfo.depart_id,this.deparmentinfo.depart_name,this.changeRangid).then(res=>{
                Message.success(res.message);
                that.dialogFormVisible=false;
                that.getDeparmentList();
            });
          }else{
              that.dialogFormVisible=false;
          }
      },
      handleDelete(index,row){
          var deparmenname=row.depart_name;
          this.$confirm('确定删除科室名称：'+ deparmenname +'?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                deleteDeparment(this.userLoginInfo.guid,row.depart_id).then(res=>{
                    if(res.code==0){
                        this.$message({
                            type: 'success',
                            message: '已将科室名称：'+deparmenname+'删除！'
                        });
                        that.getDeparmentList();
                    }else{
                        that.$message({
                                showClose: true,
                                message: res.message,
                            });
                    }
                });
            }).catch(() => {
                
            });
      },
  },
  created(){
      this.getDeparmentList();
      this.getRangeList();
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  activated() {
  },
};
</script>

<style>
h3 {margin-left: 20px;}
.deparmentManage {height: 100%;padding:10px;}
.select_domain{border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:20px;}
.data_list table th,td{text-align: center;}
.deparmentManage .textalign{text-align: right;padding-right: 0px!important;line-height: 40px;}
.deparmentManage font{color:red;padding-right:5px;font-weight: bolder;font-size: 20px;}
</style>
