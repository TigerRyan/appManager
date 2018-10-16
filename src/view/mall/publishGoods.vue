<template>
 <div class="content_data" id="mallPublishGoods">
   <Breadcrumb>
     <el-breadcrumb-item v-if='$route.query.id'>编辑</el-breadcrumb-item>
   </Breadcrumb>
     <el-form :model="commodities" :rules="rules" ref="commodities" labelWidth="150px" v-if="showFrom">
       <div class="from-title">填写商品基本信息</div>
       <el-form-item label="商品类型" prop="type" class="mallPublishGoods">
          <el-select v-model="commodities.type" placeholder="请选择类型" style="margin-right:30px;">
            <el-option v-for="(item,index) in commodityType"
              :key="index"
              :label="item"
              :value="index">
              {{item}}
            </el-option>
          </el-select>
         </el-form-item>
       <div style="display:flex">
         <el-form-item label="商品分类" prop="classify" class="mallPublishGoods">
          <el-select v-model="commodities.classify" placeholder="请选择分类" style="margin-right:30px;" @change="pitch">
            <el-option v-for="item in parent"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              {{item.name}}
            </el-option>
          </el-select>
         </el-form-item>
         <div class="mallPublishGoods">
          <el-select v-model="commodities.classify5" @change="pitch2">
            <el-option v-for="item2 in children"
              :key="item2.index"
              :label="item2.name"
              :value="item2.id">
            </el-option>
          </el-select>
         </div>
       </div>
        <el-form-item label="商品名称" prop="goodsName" class="mallPublishGoods">
          <el-input v-model="commodities.goodsName" placeholder="请输入商品名称..."/>
        </el-form-item>
        <el-form-item label="商品图片" prop="homeImg" style='height:190px;'>
          <div class="imgUp">
            <ul>
              <li v-for="(item,index) in homeImgArrt" :key="index">
                <img :src="item"/>
                <div class="deleteImg">
                  <a>
                    <i v-if="(homeImgArrt.length==1 || index==0)?false:true" class="iconfont icon-web__bitebizuojiantou" @click="leftMove(index,item)"></i>
                    <i v-if="(homeImgArrt.length==1 || index==homeImgArrt.length-1)?false:true" class="iconfont icon-web__bitebiyoujiantou" @click="RightMove(index,item)"></i>
                  </a>
                  <i v-if="true" class="iconfont icon-unie639" @click="deleteImg(index)"></i>
                </div>
                <p v-if="index==0" ><span >*</span>商品主图</p>
              </li>
            </ul>
            <div class="upload" v-if="homeImgArrt.length<5">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="upload"
                list-type="picture"
                multiple
                :on-success="successFun"
                :on-exceed="handleExceed">
                <i class="el-icon-plus"/>
              </el-upload>
            </div>
          </div>
          <p style="margin-top:18px;color:#ccc;">注意: 商品图片大小不能超过3MB;图片尺寸大于等于500x500;至少上传一张图片.</p>
        </el-form-item>
        <el-form-item label="成本价(元)" prop="purchasePrice" class="mallPublishGoods">
          <el-input v-model="commodities.purchasePrice" type="number" placeholder="请输入成本价..."/>
        </el-form-item>
        <el-form-item label="原价(元)" prop="costPrice" class="mallPublishGoods">
          <el-input v-model="commodities.costPrice" type="number" placeholder="请输入商品原价..."/>
        </el-form-item>
        <el-form-item label="优惠价(元)" prop="showPrice" class="mallPublishGoods">
          <el-input v-model.number="commodities.showPrice" type="number" placeholder="请输入商品优惠价..."/>
        </el-form-item>
        <el-form-item label="默认销售量" prop="virtualSaleNumber" class="mallPublishGoods">
          <el-input v-model.number="commodities.virtualSaleNumber" type="number" placeholder="请输入默认销售量..."/>
        </el-form-item>
        <div id="integral">
          <el-form-item label="是否需要积分" prop="notIntegral">
            <el-radio-group v-model="commodities.notIntegral" @change="radio">
              <el-radio :label="0">不需要积分</el-radio>
              <el-radio :label="1" >需要积分</el-radio>
           </el-radio-group>
        </el-form-item>
          <el-form-item label="所需积分" prop="integral" v-if="show">
            <el-input v-model="commodities.integral" placeholder="请输入所需积分..."/>
          </el-form-item>
        </div>
        <div id="integral">
          <el-form-item label="是否可以使用购物券" prop="coupon">
            <el-radio-group v-model="commodities.coupon" @change="radioRoll">
              <el-radio :label="2">不能使用</el-radio>
              <el-radio :label="1" >可以使用</el-radio>
           </el-radio-group>
        </el-form-item>
        </div>
        <div v-if="showRoll" style="display:flex;position: relative;">
          <el-form-item label="设置购物券区间" prop="couponMin">
            <el-input type="number" v-model.number="commodities.couponMin" placeholder="请输入最低值..." style="width:132px;"/>
          </el-form-item>
          <el-form-item prop="couponMax">
            <el-input type="number" v-model.number="commodities.couponMax" placeholder="请输入最高值..." style="width:132px;margin:-150px;"/>
          </el-form-item>
          <span style="position: absolute;left:304px;top:10px;">--</span>
        </div>

        <el-form-item label="权重" prop="weight">
          <el-input-number v-model="commodities.weight" @change="handleChange" :min="1" ></el-input-number>
        </el-form-item>
        <el-form-item label="商品详情">
          <VueUEditor :ueditorConfig="config" @ready="editorReady"></VueUEditor>
        </el-form-item>
        <el-button type="primary" round  :disabled='disabled' @click="submit2()">保存</el-button>
        </el-form>
        <el-form v-if="showFrom2" @submit.native.prevent>
        <div class="from-title">填写商品基本信息</div>
        <el-form-item label="商品规格属性" prop="attribute"  class="mallPublishGoods" v-show="showButton">
            <div>
                <div v-for="(dynamic,index) in dynamicTags" :key="index">
                  <p>{{dynamic.name}}</p>
                  <div>
                      <el-tag
                        :key="idx"
                        v-for="(tag,idx) in dynamic.valueList"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(index,idx,tag)" style="margin-right:20px;">
                        {{tag}}
                      </el-tag>
                       <el-input
                        class="input-new-tag"
                        v-if="dynamic.inputVisible2"
                        v-model.trim="inputValue2"
                        ref="saveTagInput2"
                        size="small"
                        @keyup.enter.prevent.native="uploadTagChang(index)"
                        @blur="uploadTagChang(index)">
                      </el-input>
                      <el-button type="button" v-else class="button-new-tag" size="small" @click="showInput2(index)">+ 添加属性值</el-button>
                  </div>
                </div>
            </div>
          <div>
            <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model.trim="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.prevent.native="handleInputConfirm"
            @blur="handleInputConfirm">
          </el-input>
          <el-button type="button" v-else class="button-new-tag" size="small" @click="showInput">+ 添加属性</el-button>
          </div>
          <el-button type="primary" round @click="submit3()" v-show="showButton" style="margin:20px 100px;">保存</el-button>
        </el-form-item>
        <TablePage class="lock" v-show="showButton2">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
            >
              <el-table-column
                :prop="item.value ? item.value : 'attribute'+index"
                :label="item.name"
                v-for="(item,index) in attributeData"
                :key="index"
              >
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格"
              >
                <template slot-scope="scope">
                  <el-input type="number" v-model.number="scope.row.price" placeholder="请输入内容" @blur="blurHandle(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                  prop="totalStore"
                  label="库存"
                >
                  <template slot-scope="scope">
                    <el-input type="number"  v-model.number="scope.row.totalStore" placeholder="请输入内容" @blur="blurHandle(scope.row)"></el-input>
                  </template>
                </el-table-column>
            </el-table>

          </TablePage>
        <div style="margin-top:30px;">
          <el-button type="primary" round :disabled='disabled' @click="submit()" v-show="showButton2">保存</el-button>
        </div>
     </el-form>
 </div>
</template>

<script>
import {upload, token} from '../../api/systemApi'
import {warning} from '../../actions'
import VueUEditor from 'vue-ueditor'
import DynamicTable from '../../components/DynamicTable.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import Avatar from '../../components/Avaters.vue'
import TablePage from '../../components/TablePage.vue'
import { getgoodsCategory } from '../../api/commodity.js'
import {postaddGoods,postaddGoodsSku,postaddGoodsSub,getinfoApi,putUpDataApi,getGoodsSkuApi,getGoodsSkubApi,updateGoodsSubApi,updateGoodsSkuApi} from "../../api/administration.js"
import { addNoticeApi } from '../../api/noticeApi';
import {success,error} from '../../actions'
export default {
  name: 'mallPublishGoods',
  data() {
    return {
      tableData: [],
      showState:false,
      attributeData: [],
      obj2:{},
      allArr: [],
      skuData: [],
      showButton:true,
      showButton2:false,
      disabled:false,
      commodityType:['虚拟','实物',"合成券"],
      goodsImage:'',
      homeImg:'',
      commodities: {
        classify: '', //商品分类
        classify2: '',
        classify4:'',
        classify5:'',
        purchasePrice :'',//成本价
        virtualSaleNumber :null,//默认销量
        goodsCategoryId : '', //产品id
        goodsName: '', //商品名称
        costPrice: '', //原价
        showPrice: '', //优惠价
        inventory: '', //商品库存
        notIntegral: 0, //是否需要积分
        coupon :2,      //是否可以使用购物劵 1可以 2 不可以
        couponMin:null, //使用购物劵最低值
        couponMax: null,//使用购物劵最高值
        type:null,      //商品类型
        integral: '', //积分数
        attribute: '', //商品规格
        details: '', //富文本内容
        weight: 1 ,//权重,
        idValue:null
      },
      config: {
        initialFrameWidth: 750,
        initialFrameHeight: 380
      },
      homeImg2:'',
      homeImg3:'',
      homeImg4:'',
      homeImg5:'',
      show:false,
      showFrom:true,    //判断信息显示影藏
      showFrom2:false,  //判断规格显示影藏
      showRoll:false,
      homeImgArrt:[],
      ueditor: null,
      commodityId:'',
      inputValue: '', //输入得值  规格
      valuehead: [],
      dynamicTags: [], //展示数据  规格
      inputVisible: false, //规格
      inputValue2: '', //输入得值  属性
      sheet: null,
      goodCateId:'',
      parent: [],
      children: [],
      exhibition:[],
      putaway:true,
      aa:'',
      information:[],
      goodsAddParam:null,
      redactTag:[],
      tableData2:[],   //有数据的table
      compileType:0,     //编辑类型,  不添加属性0    新建属性1
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名...', trigger: 'blur' },
          { max: 40, message: '商品名不能超过40个字符...', trigger: 'blur' }
        ],
        classify: [
          { required: true, message: '请选择分类...', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型...', trigger: 'change' }
        ],
        // 原价
        costPrice: [
          { required: true, message: '请输入原价',trigger: 'blur'},
          {pattern: /(?!^0+\.0{0,2}$)(^\d+$|^\d+\.\d{2}$)/, message: '原价不能为负数且需保留两位小数', trigger: 'blur' },
        ],
        couponMin:[
           { required: true, message: '请输入最小值',trigger: 'blur'},
        ],
        purchasePrice:[
            { required: true, message: '请输入成本价',trigger: 'blur'},
            {pattern: /(?!^0+\.0{0,2}$)(^\d+$|^\d+\.\d{2}$)/, message: '成本价不能为负数且需保留两位小数', trigger: 'blur' },
        ],
        virtualSaleNumber:[
           { required: true, message: '请输入销售量',trigger: 'blur'},
           {pattern: /^[0-9]+$/, message: '销售量需是整数', trigger: 'blur' },
        ],
        // 优惠价
        showPrice: [
          { required: true, message: '请输入价格',trigger: 'blur'},
          {pattern: /^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '价格不能为负数且需保留两位小数', trigger: 'blur' },
          {validator:(rule,value,callback)=>{
           if(this.commodities.costPrice-this.commodities.showPrice<0){
               callback(new Error("优惠价不能高于原价!"));
           }else{
							callback()
						}
         }, trigger: 'blur'},
        ],
        weight: [
          { required: true, message: '请输入序号', trigger: 'blur' },
            { pattern:/^[0-9]+$/, message: '请输入数字', trigger: 'blur'}
        ],
        integral:[
          { required: true, message: '请输入积分', trigger: 'blur' },
            { pattern:/^[0-9]+$/, message: '积分为整数', trigger: 'blur'}
        ],
        // 购物圈价值
        couponMax:[
          { required: true, message: '请输入最大值',trigger: 'blur'},
          {validator:(rule,value,callback)=>{
           if(this.commodities.couponMin-this.commodities.couponMax>0){
               callback(new Error("最小值不能大于最高值!"));
           }else if(this.commodities.showPrice){
             if(this.commodities.couponMax-this.commodities.showPrice>0){
               callback(new Error("不能大于优惠价!"));
             }
           }
            if(!this.commodities.showPrice){
              callback(new Error("请输入优惠券!"));
           }else{
							callback()
						}
         }, trigger: 'blur'}
        ],
      }
    }
  },
  components: {
    Breadcrumb,
    Avatar,
    VueUEditor,
    TablePage,
    DynamicTable
  },
  created() {
    this.init()
    let  usrType = window.localStorage.getItem('userInfo') && JSON.parse(window.localStorage.getItem('userInfo')).type
    this.disabled = usrType ? true:false
  },
  methods: {
      upload,
      init() {
        if(this.$route.query.id){
          this.showFrom2=true
          this.showButton2=true
          this.redactCommodity()
          // 商品属性查询
          getGoodsSkuApi(this.$route.query.id).then(res=>{
            this.queryProperty(res,true)
          })
          //查询规格
          getGoodsSkubApi(this.$route.query.id).then(res=>{
            this.querySpecification(res)
          })
        }else{
          getgoodsCategory().then(data => {
              this.parent = data.filter(item => item.name != '')
          })
        }
      },
      redactCommodity(){
        //商品信息
        this.homeImgArrt=[]
          getinfoApi(this.$route.query.id).then((des)=>{
            this.goodsAddParam=des
            if(des.type==3){//商品类型修改
              this.commodities.type=2
            }else{
              this.commodities.type=des.type
            }
            this.commodityId=des.goodsId
            this.commodities.goodsId= des.goodsId , //商品id
            this.commodities.goodsName= des.goodsName, //商品名称
            this.commodities.costPrice= des.costPrice, //原价
            this.commodities.showPrice= des.showPrice , //优惠价
            this.commodities.notIntegral= des.notIntegral, //是否需要积分
            this.commodities.integral= des.integral , //积分数
            this.commodities.details= des.details, //富文本内容
            this.commodities.weight =des.weight //权重
            this.commodities.coupon =des.coupon //是否可以使用购物劵 1可以 2 不可以
            this.commodities.couponMin =des.couponMin //最小值
            this.commodities.couponMax =des.couponMax //最大致
            this.commodities.purchasePrice=des.purchasePrice //成本价
            this.commodities.virtualSaleNumber=des.virtualSaleNumber //销售量
            this.ueditor ? this.ueditor.setContent(this.commodities.details) : ""
            this.homeImgArrt.push(des.homeImg)
            if(des.goodsImage.length){
              this.homeImgArrt=this.homeImgArrt.concat(des.goodsImage.split(','))
            }

            this.show = this.commodities.notIntegral?true:false
            this.showRoll=this.commodities.coupon==1?true:false
            getgoodsCategory().then(data => {
              this.parent = data.filter(item => item.name != '')
              this.parent.forEach(element => {
                if(element.id==des.goodsCategoryId){
                  this.commodities.classify=element.name
                  this.commodities.goodsCategoryId=element.id
                  this.children = element.list //第二个商品分类数据
                }else{
                  element.list.forEach(aa => {
                    if(aa.id==des.goodsCategoryId ){
                      this.commodities.classify5=aa.name
                      this.commodities.goodsCategoryId=aa.id
                      this.commodities.classify2=aa.parentId //父级
                    }
                  });
                }
              });
              if(this.commodities.classify2){ //获取父级
                this.parent.forEach(element => {
                  if(element.id==this.commodities.classify2){
                      this.commodities.classify=element.name
                  }
                });
              }

            })
          })
      },
      //查询属性
      queryProperty(res,aa){
        res.forEach(element => {
              var property={
                name:element.name,
                id:element.id,
                inputVisible2:false,
                valueList:[]
              }
              if(element.valueList && element.valueList.length){
                element.valueList.forEach((ress,index) => {
                    this.exhibition.push(ress.name)
                    property.valueList.push(ress.name)
                });
              }
              this.dynamicTags.push(property)
            });
            if(aa){
              this.attributeData=[...this.dynamicTags]
            }
      },
      // 查询规格
      querySpecification(res){
        if(res.valueList.length){
              let list = []
              res.valueList.forEach((item, index) =>{
                let ele = item.goodsSkuValueName.split('/')
                let obj = {}
                ele.forEach((e,i)=>{
                  obj['attribute'+i] = ele[i]
                })
                obj['price'] = item.price,
                obj['totalStore'] = item.totalStore,
                obj['goodsSkuValueId'] = item.goodsSkuValueId,
                obj['id'] = item.id
                list.push(obj)

            });
            this.tableData2=list
            this.arr(res.attributeList)
            }else{
              this.arr(res.attributeList)
            }
      },

      successFun(data) {
        const url = `${token.path}${data.key}`
        if(this.homeImgArrt.length<5){
          this.homeImgArrt.push(url)
        }else{
           warning(`已经超过5张图片`);
        }

      },
      beforeUpload(file) {
        if(this.homeImgArrt.length>5){
          warning(`已经超过5张图片`);
          return false
        }
        const isJPEG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isJPG = file.type === 'image/jpg';
        if (this.type !== 'text' && file.size >= this.size) {
                warning(`图片大小不能超过 ${this.size / 1024 / 1024} M！请修改后重新上传！`)
                return false
        }
        if (!isJPEG && !isPNG && !isJPG) {
            warning(`上传图片必须是JPG/PNG/JPEG格式！`)
            return false
        }
        return true
      },
      // 删除图片
      deleteImg(index){
        this.homeImgArrt.splice(index,1)
      },
      // 向左移动
      leftMove(index,item){
        let tempOption = this.homeImgArrt[index - 1];
        this.homeImgArrt.splice(index, 1, tempOption)
        this.homeImgArrt.splice(index-1, 1, item)
      },
      // 向右移动
      RightMove(index,item){
        let tempOption = this.homeImgArrt[index + 1];
        this.homeImgArrt.splice(index, 1, tempOption)
        this.homeImgArrt.splice(index+1, 1,item)
      },
    //  超出上传个数
    handleExceed(file,fileList){
       warning(`当前限制选择 5 个文件，本次选择了 ${file.length} 个文件，共选择了 ${file.length + fileList.length} 个文件`);
    },
    radio(){//单选
        this.show=this.commodities.notIntegral?true:false
    },
    radioRoll(){//单选 优惠劵
        this.showRoll=this.commodities.coupon==1?true:false
    },
    pitch(val) {//选中  //商品id1
    this.commodities.goodsCategoryId=val
      this.parent.forEach(element => {
        if (element.id == this.commodities.classify) {
          this.commodities.classify5=null
          this.children = element.list //第二个商品分类数据
        }
      })
    },
    pitch2(val){ //商品id2
      this.commodities.goodsCategoryId=val
    },
    handleClose(index, idx,tag) {//删除属性值 属性
        if(this.exhibition.indexOf(tag)==-1){
          this.dynamicTags[index].valueList.splice(idx, 1)
        }else{
          error('不能删除原有属性值')
          return
        }
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
        if (inputValue) {
          var map = {
            name: inputValue,
            valueList: [],
            inputVisible2: false
          }
          this.dynamicTags.push(map)[``]
        }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      //显示输入框  规格
      this.inputVisible = true
    },
    // 表格修改后失去焦点事件
    blurHandle(row){
      // 得到修改后的表格数据
      console.log(row,"row")
      this.tableData.forEach((item,index)=>{
        if(item.goodsSkuValueId == row.goodsSkuValueId){
          item.price = row.price
          item.totalStore = row.totalStore
        }
      })
      let a = []
      this.tableData.forEach((item,index)=>{
        var arr = [], obj = {}
        for(var i in item) {
          if(item.hasOwnProperty(i)) { //判断属性是否是该对象的实例属性
            if(i.indexOf('attribute')>=0){
              arr.push(item[i])
            }
          }
        }
        // 使用变量保存每一项的序列化结果
        if(this.$route.query.id){
          obj.id=item.id
        }
          obj.goodsId = this.commodityId
        obj['goodsSkuValueName'] = arr.join('/')
        obj.goodsSkuValueId = item.goodsSkuValueId
        obj.price = item.price
        obj.totalStore = item.totalStore
        a.push(obj)
      })

      // 得到最终能够传递给后端的数据格式
      this.skuData = a
    },

    // 提交属性，并将返回的数据，重装渲染出表格
    submit3(){ //第二次提交
      if(!this.showState){
        error('未修改属性,不能提交')
        return
      }
      if(this.$route.query.id){
        // let arr2=[]
        //     for(var i= 0;i<this.redactTag.length;i++){
        //       var faly=true
        //         for(var j= 0;j<arr2.length;j++){
        //             if(this.redactTag[i].name==arr2[j].name){
        //               arr2[j].valueList.push(this.redactTag[i].value)
        //               faly=false
        //             }
        //         }
        //         if(faly){
        //           arr2.push(this.redactTag[i])
        //         }
        //     }
        //     let addarr=[]
        //     let addarr2=[]
        //     arr2.forEach(element=> {
        //       if(!element.id){
        //         let addArrt={}
        //         addArrt.name=element.name
        //         addArrt.valueList=element.valueList
        //         addarr.push(addArrt)
        //       }else{
        //         let addArrt2 ={}
        //         addArrt2.id=element.id
        //         addArrt2.name=element.name
        //         addArrt2.valueList=element.valueList
        //         addarr2.push(addArrt2)
        //       }
        //     });
        //     let obj3 ={}
        //     obj3.goodsId=parseInt(this.$route.query.id)
        //     obj3.skuList=addarr.concat(addarr2)
            // if(this.saleNumber || this.saleNumber==0){
            //   this.obj2.saleNumber=this.saleNumber
            // }
            this.obj2.goodsAddParam=this.goodsAddParam
            updateGoodsSkuApi(this.obj2).then(res=>{
              this.showState=false
              this.dynamicTags=[]
              this.attributeData=[]
              this.tableData=[]
              this.information=[]
              this.commodityId=res.goodsId
              this.$router.replace({ query: {id:res.goodsId} })
              this.queryProperty(res.goodsSkuInfoList,false)
              this.querySpecification(res.goodsSubInfo)
            })
            // this.redactTag = [];

      }else{
        postaddGoodsSku(this.obj2).then((res)=>{
          this.showButton=false
          this.showButton2=true
          this.arr(res)
        })
      }

    },
    arr(res){
      var attributeIdList = res

        var DescartesUtils = {
          /**
           * 如果传入的参数只有一个数组，求笛卡尔积结果
           * @param arr1 一维数组
           * @returns {Array}
           */
          descartes1:function(arr1){
              // 返回结果，是一个二维数组
              var result = [];
              var i = 0;
              for (i = 0; i < arr1.length; i++) {
                  var item1 = arr1[i];
                  result.push([item1]);
              }
              return result;
          },

          /**
           * 如果传入的参数只有两个数组，求笛卡尔积结果
           * @param arr1 一维数组
           * @param arr2 一维数组
           * @returns {Array}
           */
          descartes2: function(arr1, arr2) {
              // 返回结果，是一个二维数组
              var result = [];
              var i = 0, j = 0;
              for (i = 0; i < arr1.length; i++) {
                  var item1 = arr1[i];
                  for (j = 0; j < arr2.length; j++) {
                      var item2 = arr2[j];
                      result.push([item1, item2]);
                  }
              }
              return result;
          },

          /**
           *
           * @param arr2D 二维数组
           * @param arr1D 一维数组
           * @returns {Array}
           */
          descartes2DAnd1D: function(arr2D, arr1D) {
              var i = 0, j = 0;
              // 返回结果，是一个二维数组
              var result = [];

              for (i = 0; i < arr2D.length; i++) {
                  var arrOf2D = arr2D[i];
                  for (j = 0; j < arr1D.length; j++) {
                      var item1D = arr1D[j];
                      result.push(arrOf2D.concat(item1D));
                  }
              }

              return result;
          },

          descartes3: function(list) {
              var listLength = list.length;
              var i = 0, j = 0;
              // 返回结果，是一个二维数组
              var result = [];
              // 为了便于观察，采用这种顺序
              var arr2D = DescartesUtils.descartes2(list[0], list[1]);
              for (i = 2; i < listLength; i++) {
                  var arrOfList = list[i];
                  arr2D = DescartesUtils.descartes2DAnd1D(arr2D, arrOfList);
              }
              return arr2D;
          },

          //笛卡儿积组合
          descartes: function(list){
              if (!list) {
                  return [];
              }
              if (list.length <= 0) {
                  return [];
              }
              if (list.length == 1) {
                  return DescartesUtils.descartes1(list[0]);
              }
              if (list.length == 2) {
                  return DescartesUtils.descartes2(list[0], list[1]);
              }
              if (list.length >= 3) {
                  return DescartesUtils.descartes3(list);
              }
          },

          // 生成sku数组
          getSkuList: function(arr){
            if (!arr || !arr.length) {
              return [];
            }

            let list = []
            arr.forEach((item,index)=>{
              let skuIds = [], skuName = []
              item.forEach((ele, i)=> {
                skuIds.push(ele['goodsSkuValueId'])
                skuName.push(ele['goodsSkuValueName'])
              });
              list.push({
                goodsSkuValueName:skuName.join('/'),
                goodsSkuValueId:skuIds.join(','),
                price:0,
                totalStore: 0
              })
            })
            return list
          },

          // 生成table数组
          getTableList: function(arr){
            let list = []
            arr.forEach((item, index) =>{
              let ele = item.goodsSkuValueName.split('/')

              let obj = {}
              ele.forEach((e,i)=>{
                obj['attribute'+i] = ele[i]
              })
              obj['price'] = item.price,
              obj['totalStore'] = item.totalStore,
              obj['goodsSkuValueId'] = item.goodsSkuValueId,
              list.push(obj)
            });

            return list
          },

          // 生成属性数组
          getAttributeList: function(arr){
            var map = {}, dest = [], list = [];
            for(var i = 0; i < arr.length; i++){
              var ai = arr[i];
              if(!map[ai.goodsSkuName]){
                  dest.push({
                      goodsSkuName: ai.goodsSkuName,
                      data: [{
                        goodsSkuValueId: ai.goodsSkuValueId,
                        goodsSkuValueName: ai.goodsSkuValueName
                      }]
                  });
                  map[ai.goodsSkuName] = ai;
              }else{
                  for(var j = 0; j < dest.length; j++){
                      var dj = dest[j];
                      if(dj.goodsSkuName == ai.goodsSkuName){
                          dj.data.push({
                            goodsSkuValueId: ai.goodsSkuValueId,
                            goodsSkuValueName: ai.goodsSkuValueName
                          });
                          break;
                      }
                  }
              }
            }

            dest.forEach((item, index)=>{
              list.push(item.data)
            });
            return list
          }
        };
       // 保存属性数组3
      var attributeList = this.allArr
      attributeList.forEach((item,index)=>{
        this.attributeData.push(item)
      })

      // 生成属性数组4
      let list3 = DescartesUtils.getAttributeList(attributeIdList)
      // 生成笛卡尔积后的属性数组
      var result = DescartesUtils.descartes(list3);

      // 生成后端可以接收的属性/id数组
      let arr = DescartesUtils.getSkuList(result)

      // // 得到渲染表格的数据
      // this.tableData = DescartesUtils.getTableList(arr)
      let arr4=[]

      if(this.tableData2.length){
        arr4=DescartesUtils.getTableList(arr)
        arr4.forEach((element,index) => {
            this.tableData2.forEach(reas => {
              if(element.goodsSkuValueId==reas.goodsSkuValueId){
                element.totalStore=reas.totalStore
                element.price=reas.price
                element.id=reas.id
              }
            });
        });
        this.tableData=arr4
      }else{
        // 得到渲染表格的数据
        this.tableData = DescartesUtils.getTableList(arr)
      }
    },
    //添加属性
    uploadTagChang(index) {
      let inputValue2 = this.inputValue2
      if(this.exhibition.indexOf(this.inputValue2)>=0){
        error('不能重复添加')
        return
      }
      // 编辑状态
      // if(this.$route.query.id){
        // if(inputValue2){
        //   this.dynamicTags[index].valueList.push(inputValue2)
        //     let map={id:this.dynamicTags[index].id,name:this.dynamicTags[index].name,value:inputValue2,valueList:[inputValue2]}
        //     this.redactTag.push(map)
        //   }
      // }else{
        if (inputValue2) {
          this.showState=true
          this.allArr=[]
          this.dynamicTags[index].valueList.push(inputValue2)
          if(!this.$route.query.id){
            this.exhibition.push(inputValue2)
          }
          // 转化数组，去除 inputVisible2 字段
          this.dynamicTags.forEach((element,key) => {
            let obj={}
            obj.name=element.name
            obj.valueList=element.valueList
            this.information.push(obj)
          });
          // 去重
          for(var i=0;i<this.information.length;i++){
          　　var flag = true;
          　　for(var j=0;j<this.allArr.length;j++){
          　　　　if(this.information[i].name == this.allArr[j].name){
          　　　　　　flag = false;
          　　　　};
          　　};
          　　if(flag){
          　　　　this.allArr.push(this.information[i]);
          　　};
          };
          // 转化参数，将属性值传给后端
          this.obj2={}
          this.obj2['attributeList']=this.allArr
          this.obj2.goodsId=this.commodityId || this.$route.query.id
        }
      // }
      this.dynamicTags[index].inputVisible2 = false
      this.inputValue2 = ''
    },

    showInput2(index) {
      //显示输入框  属性
      this.dynamicTags[index].inputVisible2 = true
    },
    editorReady(ueditor) {
      //富文本
      this.ueditor = ueditor
      this.ueditor.setContent(this.commodities.details)
    },
    submit2(){ //第一次提交
      this.commodities.details = this.ueditor.getContent()//专题详情
       if(this.$route.query.id){
         const {goodsName,costPrice,purchasePrice,virtualSaleNumber,showPrice,notIntegral ,integral,details,weight,goodsCategoryId,coupon,couponMin,couponMax,type}=this.commodities
         if(this.commodities.type==2){//商品类型修改
           this.commodities.type=3
         }
          putUpDataApi({goodsCategoryId,purchasePrice,virtualSaleNumber,goodsName ,homeImg:this.homeImgArrt[0],goodsImage:this.homeImgArrt.splice(1,this.homeImgArrt.length-1).join(','),costPrice,showPrice,notIntegral,integral,details,weight,coupon,couponMin,couponMax,type:this.commodities.type,id:this.$route.query.id}).then((res)=>{
             success('保存成功')
             this.redactCommodity()
          })
      }else{
        this.$refs.commodities.validate(valid => {
          if(valid){
            const {goodsName  ,costPrice,purchasePrice,virtualSaleNumber,showPrice,notIntegral,integral,details,weight,goodsCategoryId,coupon,couponMin,couponMax,type}=this.commodities
            if(this.commodities.type==2){//商品类型修改
              this.commodities.type=3
            }
              postaddGoods({goodsCategoryId, goodsName,purchasePrice,virtualSaleNumber,homeImg:this.homeImgArrt[0],goodsImage:this.homeImgArrt.splice(1,this.homeImgArrt.length-1).join(','),costPrice,showPrice,notIntegral,integral,details,weight,coupon,couponMin,couponMax,type:this.commodities.type}).then(data=>{
                success(`填写商品基本信息成功！`)
                  this.showFrom=false
                  this.showFrom2=true
                  this.commodityId=data
              })
          }
        })
      }
    },
    submit() {//第三次提交
      let obj = {}
      var allArr = []
      for(var i=0;i<this.skuData.length;i++){
      　　var flag = true;
      　　for(var j=0;j<allArr.length;j++){
      　　　　if(this.skuData[i].goodsSkuValueId == allArr[j].goodsSkuValueId){
      　　　　　　flag = false;
      　　　　};
      　　};
      　　if(flag){
      　　　　allArr.push(this.skuData[i]);
      　　};
      };

      obj['subList'] = allArr

      if(this.$route.query.id){
        if(!obj['subList'].length){
          error('未修改规格,不能提交')
          return
        }
        updateGoodsSubApi(obj).then(res=>{
          success('修改成功')
          this.$router.push({name: 'mallSellGoods'})
        })
      }else{
        postaddGoodsSub(obj).then(res=>{
          success('发布成功')
          this.$router.push({name: 'mallSellGoods'})
        })
      }
    },
    handleChange() {}
  },
  watch:{
    '$route'(to,from){ //当路由变化时清空里面的值
      if(!to.query.id){
        this.commodities={classify: '', classify2: '',classify4:'',
        goodsCategoryId : '', //产品id
        goodsName: '', //商品名称
        costPrice: '', //原价
        showPrice: '', //优惠价
        inventory: '', //商品库存
        notIntegral: 0, //是否需要积分
        integral: '', //积分数
        attribute: '', //商品规格
        details: '', //富文本内容
        weight: 1 ,//权重,
        type:null,
        coupon :2,      //是否可以使用购物劵 1可以 2 不可以
        couponMin:null, //使用购物劵最低值
        couponMax: null,//使用购物劵最高值
        purchasePrice:'',
        virtualSaleNumber:null
      }
      this.homeImgArrt=[]
      this.ueditor.setContent(this.commodities.details)
      this.showFrom2=false
      this.showButton2=false
      this.dynamicTags=[]
      this.attributeData=[]
      this.exhibition=[]
      this.show = this.commodities.notIntegral?true:false
      this.showRoll=this.commodities.coupon==1?true:false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.from-title{
  height:50px;
  line-height: 50px;
  text-align: left;
  padding-left: 20px;
  border-left:3px solid #409EFF;
  margin-left: 30px;
  margin-bottom:20px;
}
</style>
<style lang="less">
#mallPublishGoods {
  .el-form {
    .mallPublishGoods {
      .el-input {
        width: 260px;
      }
    }
    .imgUp{
      display: flex;
      ul{
        display: flex;
        li{
          width:150px;
          height: 150px;
          margin-right: 15px;
          position: relative;
          img{
            width:100%;
            height: 100%;
          }
          .deleteImg{
            position: absolute;
            bottom:0px;
            height:25px;
            width: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            padding: 0 10px;
            overflow: hidden;
            justify-content: space-between;
            a{
              height:100%;
              display: flex;
              align-items: center;
            }
            i{
              color:#fff;
              margin-right: 15px;
              cursor: pointer;
            }
            i:last-child{
              margin-right: 0;
            }
          }
          p{
            text-align:center;
            margin-top:-24px;
            span{
              color:red;
            }
          }
        }
      }
      .upload{
        width:150px;
        height: 150px;
        border:1px dashed #666;
        .avatar-uploader{
          width:100%;
          height: 100%;
          .el-upload{
            width:100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .el-upload__input{
              width:100%;
              height:100%;
            }
            .el-icon-plus{
              font-size:19px;
            }
          }
        }
      }
    }

  }

  #integral {
    display: flex;
    justify-content: baseline;
  }
}
</style>

