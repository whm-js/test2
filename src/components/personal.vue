<template>
<div id='personalHtml'>
    <div class="navhtml" v-if="userrole!='护理部'">
        <el-button icon="el-icon-edit" @click="isShowuserinfodialog=true">修改个人信息</el-button>
        <el-button icon="el-icon-edit" @click="isShowpwddialog=true">修改密码</el-button>
    </div>
    <div v-if="userrole=='护理部'" id="hulibutable">
        <el-main>
            <el-table :data="userinfoList" stripe border style="width: 100%;text-align:center;">
            <el-table-column prop="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="realname" label="姓名"></el-table-column>
            <el-table-column prop="userrole" label="角色"></el-table-column>
            <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="isShowpwddialog=true">修改密码</el-button>
                </template>
            </el-table-column>
            </el-table>
        </el-main>
    </div>
    <div id="showuserinfo" v-else>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>账号：</span></el-col>
            <el-col :span="4" class="left"><span>2342343</span></el-col>
            <el-col :span="4" class="textalign"><span>出生年月：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>姓名：</span></el-col>
            <el-col :span="4" class="left"><span>2342343</span></el-col>
            <el-col :span="4" class="textalign"><span>年纪批次：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>手机号：</span></el-col>
            <el-col :span="4" class="left"><span>2342343</span></el-col>
            <el-col :span="4" class="textalign"><span>学历：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>性别：</span></el-col>
            <el-col :span="4" class="left"><span>女</span></el-col>
            <el-col :span="4" class="textalign"><span>毕业院校：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>科室：</span></el-col>
            <el-col :span="4" class="left"><span>2342343</span></el-col>
            <el-col :span="4" class="textalign"><span>毕业年份：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>专业：</span></el-col>
            <el-col :span="4" class="left"><span>2342343</span></el-col>
            <el-col :span="4" class="textalign"><span>参加工作时间：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>职级：</span></el-col>
            <el-col :span="4" class="left"><span>NO</span></el-col>
            <el-col :span="4" class="textalign"><span>来院时间：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="3" :offset="3" class="textalign"><span>护士执业证书：</span></el-col>
            <el-col :span="4" class="left"><span>无</span></el-col>
            <el-col :span="4" class="textalign"><span>获取证书时间：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="2" :offset="4" class="textalign"><span>职称：</span></el-col>
            <el-col :span="4" class="left"><span>无</span></el-col>
            <el-col :span="4" class="textalign"><span>获得职称时间：</span></el-col>
            <el-col :span="6" class="left"><span>2000-09-09</span></el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top:20px;">
            <el-col :span="3" :offset="3" class="textalign"><span>家庭住址：</span></el-col>
            <el-col :span="10" class="left"><span>广西柳州市城中区高新一路15号信息产业园</span></el-col>
        </el-row>
    </div>
<!--修改个人信息弹出框 start-->
    <el-dialog id="edituserinfodialog" title="修改个人信息" :visible.sync="isShowuserinfodialog">

        <span slot="footer" class="dialog-footer">
            <el-button @click="isShowuserinfodialog = false">取 消</el-button>
            <el-button type="primary" @click="edituserinfo">确 定</el-button>
        </span>
    </el-dialog>
<!--修改个人信息弹出框 end-->
<!--修改密码弹出框 start-->
    <el-dialog id='editpwddialog' title='修改密码' :visible.sync="isShowpwddialog">
        <el-row :gutter="24" type="flex">
            <el-col :span="4" :offset="5" class="textalign"><span>账号：</span></el-col>
            <el-col :span="8" style="line-height: 40px;">
               <span>234434</span>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="4" :offset="5" class="textalign"><span>姓名：</span></el-col>
            <el-col :span="8" style="line-height: 40px;">
               <span>章三</span>
            </el-col>
        </el-row>
        <el-row :gutter="24" type="flex">
            <el-col :span="4" :offset="5" class="textalign"><font>*</font><span>原密码：</span></el-col>
            <el-col :span="8">
               <el-input v-model="txtpwdold" placeholder="请输入姓名"></el-input>
               <div class="redPrompt" v-show="showpwdoldVerif">{{txtpwdoldVerify}}</div>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="4" :offset="5" class="textalign"><font>*</font><span>新密码：</span></el-col>
            <el-col :span="8">
                <el-input v-model="txtpwdnew" placeholder="请输入"></el-input>
                <div class="redPrompt" v-show="showpwdnewVerif">{{txtpwdnewVerify}}</div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShowpwddialog = false">取 消</el-button>
            <el-button type="primary" @click="editpwd">确 定</el-button>
        </span>
    </el-dialog>
    <!--修改密码弹出框 end-->
</div>  
</template>

<script>
export default {
    name: '',
    data () {
        return {
            userinfoList:[{
                index:1,
                username:'111111',
                realname:'章三',
                userrole:'护理部',
            }],
            userrole:'护理部',
            isShowuserinfodialog:false,
            isShowpwddialog:false,
            txtpwdold:'',
            txtpwdnew:'',
            showpwdoldVerif:false,
            txtpwdoldVerify:'请输入原密码',
            showpwdnewVerif:false,
            txtpwdnewVerify:'请输入新密码',
        }
    },
    methods:{
        editdialog:function(){
            this.isShowuserinfodialog=false;
        },
        editpwd:function(){
            if(this.txtpwdold==null || this.txtpwdold==''){
                this.showpwdoldVerif=true;
                this.txtpwdoldVerify='请输入原密码！';
            }
            if(this.txtpwdnew==null || this.txtpwdnew==''){
                this.showpwdnewVerif=true;
                this.txtpwdnewVerify='请输入新密码！';
            }else{
                this.isShowpwddialog=false;
            }
            
        },
        edituserinfo:function(){

        }
    }
}
</script>

<style>
#personalHtml .navhtml{padding:20px;border-bottom:1px solid #ccc;}
#personalHtml #hulibutable table th,td{text-align: center;}
#personalHtml #editpwddialog .el-dialog__body{padding-top:8px;}
#personalHtml #editpwddialog .el-row{margin-top:25px;}
#personalHtml #editpwddialog .textalign el-input{width:200px!important;}
#personalHtml #showuserinfo,#editpwddialog .textalign{text-align: right;padding-right: 0px!important;}
#personalHtml #editpwddialog .textalign span{line-height: 40px;}
#personalHtml #showuserinfo .left{text-align: left;}
#personalHtml #editpwddialog .redPrompt{margin-left: 5px;margin-bottom: -25px;color:red;}
#personalHtml #editpwddialog font{color:red;padding-right:5px;font-weight: bolder;font-size: 20px;}
</style>
