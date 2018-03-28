<template>
  <el-container v-cloak>
    <el-header style="height:50px;line-height: 50px;"><strong>培训管理</strong></el-header>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="护理部核心能力培训">
          <template>
            <el-tabs type="card" v-model="tabActiveName" @tab-click="handleClick">
              <el-tab-pane v-for="data in tabMenuData" :label="data.name" :name="data.id+'@'+data.name" :key="data.id">
                <el-col class="cur-title">
                当前目录：<strong>{{curTabName}}</strong>
                <el-button @click.native.prevent="addNew(data.id)" class="add-btn" size="small">新增培训内容</el-button>
                </el-col>
                <el-table :data="tabContextDataList" height="550" border style="width: 100%">
                  <el-table-column type="index" :index="getIndex" label="序号" width="80"></el-table-column>
                  <el-table-column prop="content" label="培训内容"></el-table-column>
                  <el-table-column prop="status" :formatter="getStatus" label="状态"></el-table-column>
                  <el-table-column prop="operation" label="操作">
                    <template slot-scope="operation">
                    <el-button @click.native.prevent="update(operation.$index, operation.row)" size="small">
                      修改
                    </el-button>
                    <el-button @click.native.prevent="disable(operation.$index, operation.row)"  size="small">
                     {{operation.row.status?'停用':'启用'}}
                    </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <!--弹窗展示新增培训内容信息-->
    <el-dialog :title="updatedialogTitle" :visible.sync="updatedialogVisible">
      <el-form :model="trainForm" style="padding-left:20px;">
        <el-form-item label="培训内容：">
          <el-input type="text" placeholder="请输入培训内容" v-model="trainForm.trainContext" style="width:200px;"></el-input>
        </el-form-item>
        <el-row :gutter="13" v-show="tipMsg!=''">
          <el-col :span="3">&nbsp;</el-col>
          <el-col :span="10" style="color:red;">{{tipMsg}}</el-col>
        </el-row>
        

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewContext">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
import { getTrainingContentList, getDemandInfos, setTrainingContentEnable, addTrainingContent, updateTrainingContent } from "@/http/data";
import { mapGetters } from 'vuex';
export default {
  name: '',
  data () {
    return {
      loading:true,//加载
      //tab菜单列表数据
      tabMenuData:[],
      //tab页签内容数据
      tabContextDataList:[],

      tabActiveName:'',
      curTabName:'',
      curDemandId:0,

      updatedialogVisible:false,
      trainForm:{
        trainContext:''
      },
      updateDemandId:0,
      updatedialogTitle:'',
      tipMsg:'',//新增内容、修改内容文本框为空的提示语
      operation:''//操作标记：修改update，新增add

    }
  },
  computed: {
    ...mapGetters([
      'userLoginInfo'
    ])
  },
  created(){
    this.getDemandInfos();
  },
  methods: {
    //获取tab菜单头部列表
    getDemandInfos(){
      var that=this;
      getDemandInfos(this.userLoginInfo.guid).then(res=>{
          that.loading=false;
          that.tabMenuData=res.datas[0].demands;

          //设定第一个tab处于选中状态
          that.tabActiveName = that.tabMenuData[0].id+'@'+that.tabMenuData[0].name;
          that.curTabName = that.tabMenuData[0].name;
          that.curDemandId = that.tabMenuData[0].id;
          this.getTrainingContentList();
      });
    },
    //获取tab内容：培训内容列表
    getTrainingContentList(){
      var that=this;
      getTrainingContentList(this.userLoginInfo.guid,this.curDemandId).then(res=>{
          that.loading=false;
          that.tabContextDataList=res.datas;
      });
    },
    //获取数据列表的序号
    getIndex(index) {
      return index+1;
    },
    //获取状态
    getStatus(tabContextDataList){
        return tabContextDataList.status?'启用':'停用';
    },
    //新增
    addNew(){
      this.trainForm.trainContext = '';
      this.updatedialogTitle = '新增培训内容';
      this.updatedialogVisible = true;
      this.operation = 'add';
    },
    //新增 保存到数据库
    addNewContext(){
      var that=this;
      if (!this.trainForm.trainContext) {
        this.tipMsg = '培训内容不能为空！';
        return;
      };
      if (this.operation == 'add') {
        addTrainingContent(this.userLoginInfo.guid, this.curDemandId, this.trainForm.trainContext).then(res=>{
            that.updatedialogVisible = false;
            that.$message({
              type: 'success',
              message: '新增成功!'
            });
            that.getTrainingContentList();
        });
      }else if (this.operation == 'update') {
        updateTrainingContent(this.userLoginInfo.guid, this.updateDemandId, this.trainForm.trainContext).then(res=>{
            that.updatedialogVisible = false;
            that.$message({
              type: 'success',
              message: '修改成功!'
            });
            that.getTrainingContentList();
        });
      };
    },
    //修改
    update(index, row) {
      this.updatedialogTitle = '修改培训内容';
      this.updatedialogVisible = true;
      this.trainForm.trainContext = row.content;
      this.operation = 'update';
      this.updateDemandId = row.serial_id;
    },
    //停用、启用
    disable(index, row){
      this.disabledialogVisible = true;
      var status = row.status==0 ? '启用':'停用';
      var statusScope = row.status==0 ? '1':'0';
      var serialId = row.serial_id;

      this.$confirm('确定 '+status+'“'+row.content+'”培训内容?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that=this;
        setTrainingContentEnable(this.userLoginInfo.guid, serialId, statusScope).then(res=>{
            that.$message({
              type: 'success',
              message: status+'成功!'
            });
            that.getTrainingContentList();
        });
      }).catch(() => {
        /*this.$message({
          type: 'info',
          message: '已取消'+status
        }); */         
      });
    },
    handleClick(tab, event) {
      this.tabActiveName = tab.name;
      this.curTabName = tab.label;
      this.curDemandId = tab.name.split('@')[0];
      this.getTrainingContentList();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
[v-cloak] {
  display: none !important;
}
.selectFromDepartment{
  height: 100%;
}

td,th div{text-align: center;}
th{color:#333;text-align: center;}
.cur-title{
  height:40px;
  line-height: 40px;
}
.add-btn{margin-left:20px;}
</style>
