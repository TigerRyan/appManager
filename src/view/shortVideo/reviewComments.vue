<!--  -->
<template>
  <div class='reviewComments'>
    <Breadcrumb>
      <el-breadcrumb-item><i class="el-icon-date"/>查看评论</el-breadcrumb-item>
    </Breadcrumb>
    <h3 class="caption">
      查看评论
    </h3>
    <div class="cap">
        短视频："{{ detail.videoTitle }}"的全部评论
    </div>
    <!-- 列表 -->
		<TablePage>
				<el-table :data="data.list" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中..."   >
          <el-table-column type="selection" width="55" align="center"> </el-table-column>
					<el-table-column prop="content" label="评论内容" min-width="200" align="center">
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content" style="width:300px">{{ scope.row.content }}</div>
                  <span >{{  scope.row.content.length>=20?scope.row.content.slice(0,20)+'...':scope.row.content  }}</span>
                </el-tooltip>
              </template>
          </el-table-column>
					<!-- <el-table-column prop="label" label="用户" min-width="130"/> -->
					<el-table-column prop="user" label="用户" min-width="150" align="center">
						<template slot-scope="scope">
						 <img :src="scope.row.logo  || '../../../static/img/logo.png'" width="70"/>
             <span>{{ scope.row.name  }}</span>
						</template>
					</el-table-column>
				
					<el-table-column prop="createTime" label="评论时间" :formatter="dateTimeFilter" min-width="150" align="center"/>
					<el-table-column  label="操作" class=""  min-width="150" align="center">
            <template slot-scope="scope">
							<!-- <el-button type="primary" @click="$router.push({path:'reviewComments',query:{id:scope.row.id}})" plain>查看评论</el-button> -->
              <!-- <el-button type="primary" @click="edit(scope.row.id,scope.row.type)">编辑</el-button> -->
              <el-button type="danger" @click="delet(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
				</el-table>

				<el-row style="padding-top:20px;padding-left:20px">
          <el-col  :span="2" style="padding-top:10px">
              <el-checkbox-group v-model="radio" @change="toggleSelection(data.list)">
                  <el-checkbox label="全选" name="type" ></el-checkbox>
              </el-checkbox-group>
          </el-col>
          <el-col  :span="2" >
              <el-button :type="multipleSelection.length > 0?'danger':'info'"  @click="delet('all')">批量删除</el-button>
          </el-col>
				</el-row>

        <!-- 分页 -->
				<MyPagination :page="data.pageNum" :size="data.pageSize" :method="findList" :total="data.total"/>
		</TablePage>
  </div>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb.vue";
import TablePage from "../../components/TablePage.vue";
import MyPagination from "../../components/MyPagination.vue";
import { dateTimeFilter ,auditFilter,informationTypeFilter} from "../../constant/filter.js";
import { getshortVideoCommentsApiListApi,getDetailshortVideoApi,deleteCommentshortVideoApi } from "../../api/shortVideoApi"
export default {
  name: 'reviewComments',
  components: {Breadcrumb,TablePage,MyPagination},
  created () {
  },
  data () {
    return {
      loading:false,
      radio:false,
      detail: {

      },
      id:JSON.parse(this.$route.query.id),
      data:{
        page:1,
        pageSize:10,
        list:[
          // {
          //   id : 2 ,
          //   content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容' ,
          //   logo: '../../../static/img/33.png' ,
          //   name : '用户姓名' ,
          //   createTime: 123548965
          // },
          // {
          //   id : 3 ,
          //   content: '评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容' ,
          //   logo: '../../../static/img/33.png' ,
          //   name : '用户姓名' ,
          //   createTime: 123548965
          // },
        ]
      },
      multipleSelection: []
    }
  },
  created() {
    // console.log(33,this.$route.query.id,this.$route.query);
    
    this.id = this.$route.query.id
    this.init()
  },
  methods: {
    dateTimeFilter,
    auditFilter,
    informationTypeFilter,
    init() {
      getDetailshortVideoApi({id: this.id}).then((data)=>{
        this.detail = {...data}
        console.log(111,data);
        
      })
    },
    findList(page = {}){
      getshortVideoCommentsApiListApi({id:this.id,...page}).then(data=>{
          this.data={...this.data,...page,...data}
          // console.log(data)
          // this.findList()
      })
    },
    // 全选
    toggleSelection(rows) {
        if (this.radio) {
          this.$refs.multipleTable.clearSelection()
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val,555,this.multipleSelection.length)
        if (this.multipleSelection.length==this.data.list.length) {
          this.radio=true
          
        }else{
          this.radio=false
        }
      },
      
      delet(val){
        let ids=[]
        if (val=='all' && this.multipleSelection.length <= 0) {
          this.$message({
          message: '请选择要删除的项',
          type: 'warning'
        });
        }else if(val=='all' && this.multipleSelection.length > 0){
          this.multipleSelection.forEach(item=>{
              ids.push(item.id)
          })
          deleteCommentshortVideoApi(ids.join(',')).then(data=>{
            this.$message({
              message: '批量删除成功',
              type: 'success'
            });
            this.findList()
          })
        }else{
          console.log(999,val);
          
          deleteCommentshortVideoApi(val).then(data=>{
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.findList()
          })
        }
        
      },
  },

}
</script>
<style lang='less' scoped>
.reviewComments{
  .caption {
    width: 100%;
    height: 70px;
    border-left: 3px solid #4ebbf2;
    background: #fff;
    line-height: 70px;
    padding-left: 32px;
    font-size: 24px;
    color: #4ebbf2;
    position: relative;
    margin-bottom: 20px;
  }
  .cap{
    height: 70px;
    line-height: 70px;
    margin-bottom: 20px;
    padding-left: 20px;
    font-size: 20px;
  }
  .cap{
    height: 70px;
    line-height: 70px;
    margin-bottom: 20px;
    font-size: 20px;
    padding-left: 20px;
  }
}
</style>
<style lang="less">
.reviewComments{
    .el-table{
      tr{
        height: 80px;
        th{
         background: #f6f7fb;
        }
      }
      .el-table__body{
        .cell{
          img{
            vertical-align: middle;
            padding-right:10px;
          }
        }
      }
    }
  .el-pagination{
     text-align: center;
      padding-bottom: 20px;
  }
}
</style>
