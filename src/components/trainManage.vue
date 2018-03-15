<template>
  <el-container v-cloak>
    <el-header style="height:50px;line-height: 50px;"></el-header>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="护理部核心能力培训">
          <template>
            <el-tabs type="card" v-model="tabActiveName" @tab-click="handleClick">
              <el-tab-pane v-for="data in tabMenuData" :label="data.menuName" :name="data.menuId" :key="data.menuId">
                <el-col class="cur-title">
                当前目录：<strong>{{curTabName}}</strong>
                <el-button @click.native.prevent="addNew()" class="add-btn" size="small">新增培训内容</el-button>
                </el-col>
                <el-table :data="tableData3" height="250" border style="width: 100%">
                  <el-table-column prop="index" label="序号" width="80"></el-table-column>
                  <el-table-column prop="context" label="培训内容"></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                  <el-table-column prop="operation" label="操作">
                    <template slot-scope="operation">
                    <el-button @click.native.prevent="update(operation.$index, operation.row)" size="small">
                      修改
                    </el-button>
                    <el-button @click.native.prevent="disable(operation.$index, operation.row)"  size="small">
                     停用
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatedialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      tabActiveName:'preJob_education',
      curTabName:'岗前教育',

      updatedialogVisible:false,
      trainForm:{
        trainContext:''
      },
      updatedialogTitle:'',
      //tab菜单列表数据
      tabMenuData:[
        {
          index:1,
          menuId:'preJob_education',
          menuName:'岗前教育'
        },{
          index:2,
          menuId:'theory_training',
          menuName:'基础理论培训'
        },{
          index:3,
          menuId:'basicSkills_training',
          menuName:'基础技能量化培训'
        },{
          index:4,
          menuId:'theory_evaluation',
          menuName:'三基理论考核'
        },{
          index:5,
          menuId:'basic_skills',
          menuName:'基础技能考核'
        }
      ],
      //tab页签内容数据
      tableData3:[
        {
          index:1,
          context:'中心静脉输液',
          status:'启用'
        },{
          index:2,
          context:'模拟抢救病人',
          status:'启用'
        },{
          index:3,
          context:'患者约束法',
          status:'停用'
        }
      ]
    }
  },
  methods: {
    //新增
    addNew(index, row){
      this.updatedialogTitle = '新增培训内容';
      this.updatedialogVisible = true;
    },
    //修改
    update(index, row) {
      this.updatedialogTitle = '修改培训内容';
      this.updatedialogVisible = true;
    },
    //停用、启用
    disable(index, row){
      this.disabledialogVisible = true;
      var status = row.status=='停用' ? '启用':'停用';
      this.$confirm('确定'+status+'“'+row.context+'”培训内容?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: status+'成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'+status
        });          
      });
    },
    handleClick(tab, event) {
      //console.log(tab.index+'-'+tab.label+':'+tab.name);
      this.tabActiveName = tab.name;
      this.curTabName = tab.label;
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
