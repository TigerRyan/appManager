<template>
	<div class="informationList content_data">
    <Breadcrumb/>

		<!-- 搜索 -->
		<div class="time_search">
				<el-col :span="6" >
					<div class="search kind">
						<el-input  placeholder="根据关键词查询"
						style="width: 378px;" v-model="searchText"/>
					</div>
				</el-col>

				<el-col :offset="1" :span="1" >
            栏目
				</el-col>
				<el-col  :span="2" >
            <el-select v-model="columnKeyWord" placeholder="请选择栏目">
							<el-option :label="item.name" :value="item.id" v-for="(item,index) in columnItem" :key="index"></el-option>
            </el-select>
				</el-col>
				<el-col :offset="1" :span="1" >
            类型
				</el-col>
				<el-col  :span="2" >
            <el-select v-model="typeKeyWord" placeholder="请资讯类型">
							<el-option label="全部" value=""></el-option>
							<el-option label="图文" value="0"></el-option>
              <el-option label="视频" value="1"></el-option>
            </el-select>
				</el-col>
				<el-button  style="margin-left: 67px;background:#51c5ff;color:#fff;" round @click="centerDialogVisible = true" :disabled='disabled'> <i class="iconfont icon-jiahao"></i> 新增资讯</el-button>
				<div class="block">
					<el-button  icon="el-icon-search" style="margin-left: 67px;background:#51c5ff;color:#fff;" round  @click="search">搜索</el-button>
					<el-button  icon="el-icon-refresh" style="background:#ecf5ff" round  @click="reset">重置</el-button>
				</div>

		</div>
		<!-- 列表 -->
		<TablePage>
				<el-table :data="list" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中..."  @header-click="uplist" >
          <el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column prop="title" label="文章标题" min-width="180"/>
					<el-table-column prop="label" label="文章标签" min-width="180"/>
					<el-table-column prop="titleName" label="所属栏目" min-width="130"/>
					<el-table-column prop="type" label="文章类型" :formatter="informationTypeFilter" min-width="130">
						<template slot-scope="scope">
						  <i v-if="scope.row.type==1" class="el-icon el-icon-caret-right" style="color:blue"></i>	{{informationTypeFilter(0,0,scope.row.type)}}
						</template>
					</el-table-column>
					<el-table-column prop="imageUrl" label="封面" min-width="150">
						<template slot-scope="scope">
						 <img :src="scope.row.imageUrl.split(',')[0] || '../../../static/img/logo.png'" width="90" height="90"/>
						</template>
					</el-table-column>
					<el-table-column prop="weight" label="权重值" min-width="80">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
					<el-table-column  label="操作" class=""  min-width="300" max-width='350'>
			            <template slot-scope="scope">
			            	<div style="display:flex;justify-content:center;">
			            		<el-button type="primary" @click="$router.push({path:'reviewComments',query:{id:scope.row.id,title:scope.row.title}})" plain>查看评论</el-button>
					            <el-button type="primary" @click="edit(scope.row.id,scope.row.type)" :disabled='disabled'>编辑</el-button>
					            <el-button type="danger" @click="delet(scope.$index,scope.row.id)" :disabled='disabled'>删除</el-button>
			            	</div>
			            </template>
          </el-table-column>
				</el-table>

				<el-row style="padding-top:20px;padding-left:20px">
          <el-col  :span="2" style="padding-top:10px">
              <el-checkbox-group v-model="radio">
                  <el-checkbox label="全选" name="type" ></el-checkbox>
              </el-checkbox-group>
          </el-col>
          <el-col  :span="2" >
              <el-button :type="colorFalg?'danger':'info'" @click="delet('all')" :disabled='disabled'>删除</el-button>
          </el-col>
				</el-row>

        <!-- 分页 -->
				<MyPagination :page="pageOption.pageNum" :size="pageOption.pageSize" :method="findList" :total="pageOption.total"/>
		</TablePage>
		<!-- 弹窗 -->
    <el-dialog title="请选择资讯类型" class="informationListMydialog" :visible.sync="centerDialogVisible" width="400px" center :append-to-body="true">
					<el-row  class="dialog-body" >
						<el-col :offset="5" :span="7" @click.native="gotoCreate(0)" class="hovercard">
							<div>
								<i class="el-icon el-icon-document"></i>
							</div>
								<h3  >文章资讯</h3>
						</el-col>
						<el-col :offset="1" @click.native="gotoCreate(1)" :span="7" class="hovercard">
							<div>
								<i class="el-icon el-icon-caret-right"></i>
							</div>
								<h3  >视频资讯</h3>
						</el-col>
					</el-row>
					<div style="padding:10px"></div>
      <span></span>
    </el-dialog>

	</div>
</template>

<script>
import TablePage from "../../components/TablePage.vue";
import Breadcrumb from "../../components/Breadcrumb.vue";
import MyPagination from "../../components/MyPagination.vue";
import { dateTimeFilter ,auditFilter,informationTypeFilter} from "../../constant/filter.js";

import { getInformationListApi,getInformationTitleApi ,deleteAllInformationApi} from "../../api/informationListApi.js";

export default {
	name: "informationList",
	components: {
    TablePage,
    MyPagination,
    Breadcrumb
	},
	data() {
		return {
			disabled:false,
			loading: false,
      centerDialogVisible: false, //弹框
			colorFalg: false, //删除高亮
			allSelect: false,
      radio: false,  //全选
			columnKeyWord: "",
			typeKeyWord : [
				{val:'图文',lab:0},
				{val:'视频',lab:1}
			],
      columnItem: [],
			showText:true,
			status: "",
			searchText: "", //搜索框内容
			pageOption:{
				pageNum: 1,
				pageSize: 10,
				total:0
			},
			orderBy: 0,
			list:[
      ],
      // 多选
      multipleSelection: []

		};
	},

	created() {
		// vm.config.title("所有机构");

		// type, 0为编辑， 1为查看
      let UserType = JSON.parse(window.localStorage.getItem('userInfo')) && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = UserType ? true : false

		getInformationTitleApi({orderBy : 0}).then(data=>{

			this.columnItem = data.list
			this.columnItem.unshift({name:"全部",id:""})
		})

	},

	methods: {
		dateTimeFilter,
		auditFilter,
		informationTypeFilter,
		selectTime() {

		},
		findList(pagedata){
			// this.list = []
			this.loading = true
			var obj = {
				page: pagedata ? pagedata.page : this.pageOption.pageNum,
				pageSize: this.pageOption.pageSize,
				keys:this.searchText,
				titleId : this.columnKeyWord,
				type : this.typeKeyWord,
				orderBy : this.orderBy
			}
			getInformationListApi(obj).then(data => {

				this.list = data.list
				this.loading = false
				this.pageOption.pageNum = data.pageNum || 1
				this.pageOption.total  = data.total  || 0
			},err=>{
				this.loading = false
			})
		},
		// 搜索
		search() {
			this.findList()
		},
		// 重置
		reset() {
			this.searchText = ""
			this.columnKeyWord = ""
			this.typeKeyWord = ""
			this.findList()
		},
		// 新建机构
		gotoCreate(val) {
				var type = val == 0 ? 0 : 1
			 	this.$router.push({ path: '/view/information/informationAdd',query:{type:type}})
    },
    // 编辑
    edit(id,type) {

			type == 0 ? this.$router.push({ path: '/view/information/informationAdd',query:{type:0,id:id}}):""
			type == 1 ? this.$router.push({ path: '/view/information/informationAdd',query:{type:1,id:id}}):""

    },
    // 删除
    delet(index,id) {
			//  this.$message
				this.$confirm('此操作删除该资讯, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					if (index == 'all') {
						var ids = this.multipleSelection.map(its=>{
							return its.id
						})
						deleteAllInformationApi(ids.join(",")).then(data=>{
							this.findList()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						},err=>{
							this.$message({
								type: 'error',
								message: '删除失败，请稍后再试!'
							});
						})
					}else {
						deleteAllInformationApi(id).then(data=>{
							this.findList()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						},error=>{
							this.$message({
								type: 'error',
								message: '删除失败，请稍后再试!'
							});
						})
					}
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


    },
    // 全选
    toggleSelection(rows,all) {
      if (rows) {
				all == 'allselect' ? this.$refs.multipleTable.clearSelection() : ""
        this.list.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
				if (!this.allSelect) {
					return
				}
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
			this.colorFalg = val.length > 0 ? true: false
			if (val.length == this.list.length) {
				this.radio = true
				this.allSelect=true
			}else {
				this.radio = false
				this.allSelect=false
			}

		},
		// 排序
		uplist(row, column, cell, event) {
			if (row.label=="权重值") {
				if (this.orderBy == 1) {
					return
				}
				this.orderBy = 1
				this.findList()
			}
			if (row.label=="创建时间") {
				if (this.orderBy == 0) {
					return
				}
				this.orderBy = 0
				this.findList()
			}

		},
  },
  watch: {
    'radio' :{
      handler:function(val,oldval){
					this.toggleSelection(val,'allselect')


      },
    }
  }
}
</script>
<style lang="less" scoped>

.hovercard.el-col {
	background-color: #eee;
	padding: 20px;
	text-align: center;
	border-radius: 10px;
	position: relative;
	transition: all 0.5s ;
	bottom: 0px;
	cursor: pointer;
	i {
		font-size: 30px;
		font-weight: 900;
		color: #aaa;
	}
	h3 {
		color: #aaa;
	}
	&:hover{
		bottom: 6px;
		i {
			color: rgb(58, 106, 209);
		}
		h3 {
			color: rgb(58, 106, 209);
		}
	}
}
.informationList {


	.content-title{
		button{
			position: absolute;
			right: 30px;
			top: 15px;
			}}
	.statistics{
		width:100%;
		background-color: #fff;
		margin-bottom: 20px;
		.el-row{
			padding:20px 0;
			.el-col{
				position: relative;
				p{
					position: absolute;
					top:50%;
					left:50%;
					text-align:center;
					transform: translate(-50%, -50%);
					span{
						display: block;
					}
				}
			}
		}
	}
	.time_search {
		height: 74px;
		line-height: 74px;
		background-color: #fff;
		padding-left: 30px;
		font-size: 18px;
		display: flex;
		margin-bottom: 20px;
		position: relative;
		.block {
			margin-left: 40px;
			.el-range-editor {
				border-radius: 25px;
			}
			.el-range-separator {
				width: 10%;
			}
			.el-button {
				margin-left: 10px !important;
			}
		}
		>button{
			height: 40px;
			position: absolute;
			right: 20px;
			top: 20px;
		}
	}
	.search {
		height: 74px;
		display: flex;
		align-items: center;
		background-color: #fff;
		.el-input {
			width: 350px !important;
			 border-radius: 20px !important;
		}
		.el-input__inner {
			border-radius: 20px !important;
		}
	}
}
</style>
<style lang="less">
.informationListMydialog {
	.el-dialog__title {
		color: #606266;
		font-weight: 900;
	}
}


.informationList {
	.time_search {
		.el-input__inner {
			border-radius: 20px !important;
		}
	}
  .el-dialog--center .el-dialog__body {
		padding-bottom: 50px !important;
	}



}
</style>
