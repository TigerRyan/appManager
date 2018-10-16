<template>
  <div class="content_data mallSellGoods">
    <Breadcrumb>
    </Breadcrumb>
    <div class="serch">
      搜索:<el-input placeholder="请输入商品名称" clearable class="sc" v-model="data.name "></el-input>
      <el-select v-model="data.id " placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary"  icon="el-icon-search" style="margin-left:20px;" round @click="sou">查询</el-button>
      <el-button  icon="el-icon-refresh" style="margin-left:20px;background:#ecf5ff;border:none;" round  @click="reset">重置</el-button>
    </div>
    <TablePage class="lock">
      <el-table :data="data.list" v-loading="data.loading" element-loading-text="拼命加载中..." @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="商品" min-width="150" class="goodsName">
          <template slot-scope="scope" >
            <ImgView :src="scope.row.homeImg" defSrc="/static/img/idcard_front.png"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="purchasePrice" label="成本价" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="costPrice" label="价格" :formatter="defValFilter02" min-width="120"/>
        <el-table-column prop="showPrice" label="优惠价" :formatter="defValFilter02" min-width="60"/>
        <el-table-column prop="notIntegral" label="是否需要积分" min-width="130">
          <template slot-scope="scope">
            {{scope.row.notIntegral==1?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column prop="integral" label="积分" :formatter="defValFilter03" min-width="60"/>
        <el-table-column prop="totalStock" label="库存总量" :formatter="defValFilter03" min-width="60"/>
        <el-table-column prop="saleNumber" label="总销量" :formatter="defValFilter03" min-width="60"/>
        <el-table-column prop="addedTime" label="创建时间" :formatter="dateTimeFilter" min-width="150"/>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button class="codes"  size="small" :disabled='disabled' @click="sold(scope.row)" plain>上架</el-button>
            <el-button class="codes"  size="small" :disabled='disabled' @click="edit(scope.row)" plain>编辑商品</el-button>
            <el-button class="details"  size="small" :disabled='disabled' @click="del(scope.row)">删除商品</el-button>
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
          <el-button :disabled="colorFalg" @click="delet('all')">批量上架</el-button>
        </el-col>
      </el-row>
      <MyPagination :page="data.page" :size="data.pageSize" :method="findList" :total="data.total"/>
    </TablePage>
  </div>
</template>

<script>
  import Breadcrumb from "../../components/Breadcrumb.vue";
  import {
    dateTimeFilter,
    defValFilter01,
    defValFilter02,
    currencyFilter,
    defValFilter03,
    detailTimeFilter
  } from "../../constant/filter";
  import TablePage from "../../components/TablePage.vue";
  import MyPagination from "../../components/MyPagination.vue";
  import ImgView from '../../components/ImgView.vue'
  import {getgoodsCategory} from '../../api/commodity.js';
  import {storeGoodsList,updownFrameApi,getdeleteApi} from '../../api/administration.js';
  import {success,confirm,error} from '../../actions'
  export default {
    name: "mallSellGoods",
    data() {
      return {
        radio:false,
        colorFalg: true,
        allSelect: false,
        disabled:false,
        page:{
          page:1,
          pageSize:10,
        },
        data: {
          page:1,
          pageSize:10,
          name:'',
          id:'',
          list: [],
          loading: false
        },
        options: [],
        multipleSelection : []
      }
    },
    components: { Breadcrumb, TablePage, MyPagination,ImgView },
    created(){
      this.init()
      let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      this.disabled = usrType ? true:false
    },
    methods: {
      dateTimeFilter,
      defValFilter01,
      defValFilter02,
      defValFilter03,
      currencyFilter,
      detailTimeFilter,
      init(){
        getgoodsCategory().then((data)=>{ //获取商品分类
          this.options=data
        })
      },
      sold({id}){//下架
        updownFrameApi(id).then(data=>{
          success(`上架成功！`)
          this.findList(this.page)
        })
      },
      findList(page = {}) { //分页
        this.data.loading = true
        const {name,id}=this.data
        storeGoodsList({...page,name,id,status:1}).then((data)=>{
          this.data={...this.data,...data,...page, loading:false}
        })
      },
      edit({id}) {
        this.$router.push({name: 'mallPublishGoods',query: { id: id}})
      },
      del(row) {//删除商品
        confirm(`你确认删除 ${row.name} 吗?`, 'warning', '删除确认').then(
          () =>
            getdeleteApi(row.id)
              .then(res => {
                success(`删除成功！`)
                this.findList(this.page)
              })
              .catch(({ msg }) => error(msg || '取消失败！请稍后重试...'))
        )
    },
      delet(index){//批量上架
        if (index == 'all') {
          var ids = this.multipleSelection.map(its=>{
            return its.id
          })
          updownFrameApi(ids.join(",")).then(data=>{
            this.findList(this.page)
          })
        }else {
          this.list.splice(index,1)
        }
      },
      sou() { //搜索
      this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList(this.page)
      },
      reset() {//重置
        this.data.name=""
        this.data.id=""
        this.$router.replace({ query: { ...this.$route.query,page:1} })
        this.findList()
      },
      handleSelectionChange(val) {//多选
        this.multipleSelection = val;
        this.colorFalg = val.length > 0 ? false: true
        if (val.length == this.data.list.length) {
          this.allSelect=true
          this.radio = true
        }else {
          this.radio = false
          this.allSelect=false
        }
      },
      // 全选
      toggleSelection(rows,all) {
        if (rows) {

          this.$refs.multipleTable.clearSelection();
          this.data.list.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          if (!this.allSelect) {
            return
          }
          this.$refs.multipleTable.clearSelection();
        }
      },
    },
    watch: {
      'radio' :{
        handler:function(val,oldval){
          if(!this.allSelect || !this.radio){
            this.toggleSelection(val,true)
          }

        },
      },
      // '$route'(val,oldval){ //
      //   if(!val.query.page){
      //     this.data.name=""
      //     this.data.id=""
      //     this.init()
      //     this.findList()
      //     let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
      //     this.disabled = usrType ? true:false
      //   }
      // }
    }
  };
</script>

<style lang="less" scoped>
  .mallSellGoods {
    .serch {
      background: #fff;
      height: 70px;
      margin-top: 20px;
      padding-left: 25px;
      line-height: 70px;
      margin-bottom:20px;
      .sc {
        width: 20%;
        margin: 0 30px;
        .el-input__inner {
          border-radius: 40px;
        }
      }
      .el-select{
        padding-right: 40px;
      }
      .min{
        width: 5%;
      }
      .line{
        width: 30px;
        height: 1px;
        display: inline-block;
        background: #000;
      }
      .el-button--primary {
        background-color: #51c5ff;
        border-color: #51c5ff;

      }
    }
  }
</style>
<style lang="less">
  .mallSellGoods {
    .serch {
      .minPrice{
        width:10%;
      }
      .maxPrice{
        width:10%;
      }
      .Price {
        float: right;
        display: flex;
        justify-content: space-between;
        width:300px;
        height: 70px;
        line-height: 70px;
        input {
          width: 100px;
        }
        .line {
          width: 50px;
          height: 1px;
          background: #000;

        }
      }
    }
    .el-table_1_column_2 {
      .cell{
        display: flex;
        justify-content: space-between;
        p{
          width:150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

    }
  }
</style>
