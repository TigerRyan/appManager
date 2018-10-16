<template>
	<div class="informationAdd content_data">
	 <Breadcrumb/>

   <div class="teachercont bg_white">
    <div>
      <el-form ref="form" :model="ruleForm" label-width="80px" size="medium" max-width="500px" class="demo-ruleForm"  :rules="rules">
        <el-form-item label="资讯标题" prop="title">
          <el-col :span="24">
            <el-input v-model="ruleForm.title" placeholder="请填写资讯标题..." />
          </el-col>
        </el-form-item>
        <el-form-item label="文章简介" v-if="ruleForm.type== 0" prop="introduction">
          <el-col :span="24">
            <el-input type="textarea" v-model="ruleForm.introduction" placeholder="请输入公司简介(最多可写300个字符)..." :rows="10" />
          </el-col>
        </el-form-item>
        <el-form-item label="资讯内容" v-if="ruleForm.type== 0" prop="content">
          <el-col :span="24">
            <div class="editor-container">
						<VueUEditor :defaultMsg ="defaultMsg" :ueditorConfig="config" @ready="editorReady"></VueUEditor>
						</div>
          </el-col>
        </el-form-item>
        <el-form-item label="视频资讯" v-if="ruleForm.type== 1"  prop="videoUrl">
          <el-col :span="24">
         	  <VideoUpload :tipText="VidetipText" @success="uploadVide" :url="ruleForm.videoUrl"></VideoUpload>
          </el-col>
        </el-form-item>


        <el-form-item label="封面图" prop="imageUrl" >
          <el-row :gutter="20">
              <el-col :span="8" v-for="(item,index) in ruleForm.imageUrl" :key="index" class="coluploadimg">
                <div class="maskeCover">
                  <i class="el-icon el-icon-close" @click="dleteimg(index)"></i>
                </div>
                <img :src="item" alt="" srcset="" style="height:120px">
              </el-col>
              <el-col :span="8" class="showcoluploadimg" v-if="ruleForm.imageUrl.length<1">
                <Avatar @success="uploadimg3" ref="imageUrlImg" :defaultPic=" '../../../static/img/uploadimg_03.png'"/>

              </el-col>
              <el-tag type="info">建议上传图片大小160*160，格式为jpg,png</el-tag>
          </el-row>
        </el-form-item>
        <el-form-item label="资讯标签" prop="label" class="tagColitemWidth">
          <el-col :span="8" v-for="(tag,index) in ruleForm.label" :key="index">
            <el-tag :key="tag" closable 	:disable-transitions="false" 	@close="handleClose(tag,0)">
              {{tag}}
            </el-tag>
          </el-col>
          <el-col :span="8" >
            <el-input 	class="input-new-tag" v-if="inputVisible.flag0" v-model="inputValue[0]" ref="saveTagInput0" size="small" 	@keyup.enter.native="handleInputConfirm(0)"
            maxlength="4" @blur="handleInputConfirm(0)" @keypress.native="cantFive(inputValue[0],0)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(0)">点击添加(最大字数为4)</el-button>
          </el-col>
				</el-form-item>

        <el-form-item label="作者" prop="author">
          <el-col :span="24">
            <el-input v-model="ruleForm.author" placeholder="请输入姓名..." />
          </el-col>
        </el-form-item>
        <el-form-item  label="资讯分类" prop="tId">
          <el-col :span="24">
              <el-select v-model="ruleForm.tId"  placeholder="请选择分类">
                <el-option :label="item.name" :value="item.id" v-for="(item,index) in columnItem" :key="index"></el-option>
              </el-select>
          </el-col>
        </el-form-item>
        <el-form-item  label="是否推荐" prop="recommend">
          <el-col :span="24">
             <el-checkbox v-model="ruleForm.recommend">推荐</el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item  label="权重" prop="weight">
          <el-col :span="24">
              <el-input-number v-model="ruleForm.weight" :min="0" 
               label="权重"></el-input-number>
						</el-col>
        </el-form-item>

        <el-form-item  label="浏览用户" prop="browseCount">
            <el-col :span="24">
						  <el-input v-model.trim="ruleForm.browseCount"/>
						</el-col>
            <span class="browseCounttip" style="color:#999">	人</span>
				</el-form-item>
        <el-form-item  label="点赞用户" prop="likeCount">
            <el-col :span="24">
						  <el-input v-model.trim="ruleForm.likeCount"/>
						</el-col>
            <span class="browseCounttip" style="color:#999">	人</span>
				</el-form-item>
        <el-form-item>
					<!-- <Input type="text" v-model="ruleForm2.iphone" auto-complete="off" placeholder="请输入手机号码"/> -->
          <el-col :span="24" class="afffirm">
	          <el-button type="primary" @click="cancel">取消</el-button>
	          <el-button type="primary" @click="onSubmit">发布</el-button>
          </el-col>
				</el-form-item>
      </el-form>
    </div>
   </div>
	</div>
</template>

<script>
  import {
  BaiduMap,
  BmNavigation,
  BmScale,
  BmGeolocation,
  BmMarker,
  BmLocalSearch
} from 'vue-baidu-map'

import Avatar from '../../components/Avatar.vue'
import Breadcrumb from '../../components/Breadcrumb.vue'
import VideoUpload from '../../components/VideoUpload.vue'
import VueUEditor from 'vue-ueditor'

import { addInformationTitleApi,updateInformationApi ,getInformationApi
,getInformationTitleApi} from "../../api/informationListApi.js";
// 添加资讯

export default {
    name: 'informationAdd',
    components: {
      Avatar,
      BaiduMap, BmNavigation, BmScale, BmGeolocation, BmMarker, BmLocalSearch,
      Breadcrumb,
      VideoUpload,
      VueUEditor
    },

    data () {
      return {
          id: null,
          type: null,
          VidetipText: "",
          inputValue: ["","",""],
          dialogImageUrl: '',
          dialogVisible: false,
          sexOption:[{value:'未知',label:0},{value:'男',label:1},{value:'女',label:2}],

          // 栏目
          columnItem: [],
          ruleForm: {
            id: null,
            title: null,
            label: [],
            author: "",
            tId: "",
            weight: 0,
            recommend : false,
            browseCount: 100,
            introduction: null,
            imageUrl: [],
            content: null,
            likeCount: 100,
            videoUrl: "",
            type: null
          },
          inputVisible: {
            flag0: false
          },
          		// 富文本
          defaultMsg:'',
          config: {
            initialFrameWidth: null,
            initialFrameHeight: 350
          },
          ueditor: null,
          rules: {
            label: [{ required: true, message: '请添加资讯标签', trigger: 'change'}],
            title : [{ required: true, message: '请输入资讯标题', trigger: 'blur' },
                    { min: 2, max:22, message: '字符数在2到22个字符以内', trigger: 'blur' },
                    ],
            author: [{ required: true, message: '请输入作者姓名', trigger: 'blur' },
                    { min: 2, max:10, message: '字符数在2到10个字符以内', trigger: 'blur' },
                   {pattern: /^[\u4E00-\u9FA5A-Za-z\.]+$/, message: '请输入正确的姓名格式', trigger: 'blur' }
                    ],
            browseCount: [{ required: true, message: '请输入浏览用户数量', trigger: 'blur' },
                    {pattern: /^\d{1,20}$/, message: '请输入数字', trigger: 'blur' }],
            weight  : [{ required: true, message: '请输入权重值', trigger: 'blur' },
                          {pattern: /^\d{1,20}$/, message: '请输入正整数', trigger: 'blur' }],
            // recommend :
            tId   : [{ required: true, message: '请选择资讯分类', trigger: 'change' }],

            likeCount : [{ required: true, message: '请输入点赞用户数量', trigger: 'blur' },
                          {pattern: /^\d{1,20}$/, message: '请输入数字', trigger: 'blur' }],
            introduction: [{ required: true, message: '请输入文章简介', trigger: 'blur' },
                            { min: 15, max: 65, message: '字符数在13到65个字符以内', trigger: 'blur' }],
            // imageUrl: [{ required: true, message: '请选择封面图', trigger: 'change'}],

            content: [{ required: true, message: '请编辑资讯内容', trigger: 'change' },
                      { min: 15,  message: '最少添加15个字符', trigger: 'change' }
            ],
            videoUrl: [{ required: true, message: '上传视频', trigger: 'change' }],
          },
      }
    },

	created(){
    if (this.$route.query) {
      this.ruleForm.id = Math.abs(this.$route.query.id) || null
      this.ruleForm.type = this.$route.query.type
    }
    this.init()
    console.log( this.type);
    this.VidetipText = this.ruleForm.id? '点击重新上传视频':'点击上传视频'

    // /teacher/getTeacherInformation/{id}
	},

  methods: {
    init() {
      getInformationTitleApi({orderBy : 0}).then(data=>{
        console.log("栏目",data);
        this.columnItem = data.list
      })
      if (this.ruleForm.id) {
        getInformationApi(this.ruleForm.id).then(data=>{
          console.log("详情",data);
          this.ruleForm = {...data,imageUrl:data.imageUrl.split(","),tId:data.tId,label:data.label.split(","),recommend:data.recommend==1?true:false ,
          imageUrl: data.imageUrl?data.imageUrl.split(","):[]}
          // console.log();
          this.defaultMsg = data.content
          this.ueditor && this.ueditor.setContent(data.content)
        })
      }
    },

          // 富文本
    editorReady(ueditor) {
        this.ueditor = ueditor
        this.ueditor.setContent(this.defaultMsg)
    },

      //标签字数限定
      cantFive(value,index){
				if(value.length == 4){
					this.$message({
						message: '标签最多为4个字',
						type: 'warning'
					});
				}
      },
      successIdCardBack(){

      },

      //图片上传
      uploadimg3(url) {
        if (this.ruleForm.imageUrl.length >= 5) {
          this.$message({
						message: '最多可添加五张图片',
						type: 'warning'
					});
        }else{
          this.ruleForm.imageUrl.push(url)
          // this.$refs.imageUrlImg.clearImg()
        }
      },

      // 点击删除封面图
      dleteimg(index) {
        this.ruleForm.imageUrl.splice(index,1)
      },
      uploadimg2(url) {
        this.ruleForm.picture = url
      },
      successIdCardBack(val){
        this.ruleForm.userImg= val
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传视频
      uploadVide(url) {
        this.ruleForm.videoUrl = url
        this.VidetipText =  '点击重新上传视频'
        this.$refs.form.validateField('videoUrl')

      },
      	// 动态tag
			handleClose(tag,index) {
				// this.ruleFormSupplementary.group.push(inputValue);
							// this.showgroups.push(groupscontent[0].name);
				if (index == 0) {
					this.ruleForm.label.splice(this.ruleForm.label.indexOf(tag), 1);
				}

      },
      showInput(index) {
				if (index == 0) {
          this.inputVisible.flag0 = true
          console.log(this.inputVisible);
					// this.$nextTick(_ => {
					// 	// this.$refs.saveTagInput0.$refs.input.focus();
					// });
				}

			},
			cantFive(value,index){
				if(value.length == 4){
					this.$message({
						message: '标签最多为4个字',
						type: 'warning'
					});
				}
				console.log(value);

				var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/;
				if (patrn.test(value)) {// 如果包含特殊字符返回false
					this.$message({
						message: '包含非法字符',
						type: 'warning'
					});
					this.inputValue[index] = '';
						return ;
				}
			},
      handleInputConfirm(index) {
				console.log(this.inputValue[index]);

				let inputValue = this.inputValue[index] + "";
				inputValue = inputValue.trim()
				if (inputValue.length > 4 ) {
					this.$message({
						message: '标签最多为4个字',
						type: 'warning'
					});
					this.inputValue[index] = '';
					return
				}
				var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/;
				if (patrn.test(inputValue)) {// 如果包含特殊字符返回false
					this.$message({
						message: '包含非法字符',
						type: 'warning'
					});
					this.inputValue[index] = '';
						return ;
				}

				if (index == 0) {
					this.inputVisible.flag0 = false
					console.log("文件",inputValue);

					if (inputValue) {
						if (this.ruleForm.label.length >= 3) {
							this.$message({
								message: '最多可添加3个',
								type: 'warning'
							});
							// this.inputVisible.flag1 = false
						}else{
							this.ruleForm.label.push(inputValue);
							this.$refs.form.validateField('label')
						}
					}
					console.log("打野",this.inputValue);
				}
				this.inputValue[index] = ""

      },

      //提交
      onSubmit() {
        if (this.ruleForm.type ==  0) {
          this.ruleForm.content  = this.ueditor.getContent()
        }

        console.log(this.ruleForm);
        this.$refs.form.validate((val)=>{
          if(val)
          {
            if (!this.ruleForm.id) {
              addInformationTitleApi(
                {...this.ruleForm,imageUrl:this.ruleForm.imageUrl.join(","),label:this.ruleForm.label.join(","),recommend:this.ruleForm.recommend==false?0:1 ,imageUrl: this.ruleForm.imageUrl?this.ruleForm.imageUrl.join(","):""}
              ).then(data=>{
                console.log("提交",this.data);
                this.$router.push({ path: '/view/information/informationList'})
              })
            }else{
              updateInformationApi(
                {...this.ruleForm,imageUrl:this.ruleForm.imageUrl.join(","),label:this.ruleForm.label.join(","),recommend:this.ruleForm.recommend==false?0:1 ,imageUrl: this.ruleForm.imageUrl?this.ruleForm.imageUrl.join(","):""}
              ).then(data=>{
                console.log("提交",this.data);
                this.$router.push({ path: '/view/information/informationList'})
              })
            }

          }
          else {
						this.$message({
							message: '请把信息填写完整',
							type: 'warning'
						});
						// this.steps = 3
						console.log('error submit!!');
						return false;
					}
        })
      },
      // 取消
      cancel() {
        this.$router.push({ path: '/view/information/informationList'})
      }

}
}
</script>
<style lang="less">
.informationAdd{
  .browseCounttip {
    position: absolute;
    right: 10px;
    top:0px;
  }
   .el-upload-dragger{
      border-radius:50%;
    }
    .img_box{
      .avatar_box{
        .avatar-uploader{
          border:none;
          border-radius: 50%;
        }
      }
    }
    .coluploadimg {
      position: relative;
      .maskeCover {
        width: 100%;
        height: 100%;
        left: -2px;
        z-index: 99;
        position: absolute;
        text-align: center;
        i {
          color: rgba(59, 143, 211, 0.8);
          font-size: 30px;
          line-height: 130px;
          height: 130px;
          display: none;
        }
        &:hover {
          background-color: rgba(200,200,200,0.5);
          i {
            display: block;
          }
        }
      }
    }
  .showcoluploadimg {
    .el-upload-dragger{
        border:none;
        border-radius: 0;
      }
  }
  .coluploadimg.el-col{
    text-align: center;
    height: 130px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="less" scoped>
  .informationAdd{
    .bm-view{
      height: 300px;
      width: 100%;
      position: relative;
      border: 1px solid #dcdfe6;
		.anchorBL{
        display: none;
      }
    }
    .teachercont{
      .el-form{
         position: relative;
         margin: auto;
         width: 600px;
         .userImg{
           .img_box{
             width: 128px;
             height: 128px;
             position: relative;
             margin: 10px auto;
             border-radius: 50%;
             p{
               position: absolute;
               top:0;
               left:0;
               text-align:center;
               line-height:128px;
               width: 128px;
             }
              .avatar_box{
                .avatar-uploader{
                  display: inline-block;
                }
              }
           }
         }
      }
      .el-select{
        width:100%;
      }
      >div{
        width: 50%;
        margin:20px auto;
        padding-top: 20px;
        padding-bottom: 20px;
        max-width: 850px;
        min-width: 300px;
        // tag标签
        .el-tag{
          width: 100%;
        }
        .tagColitemWidth{
          .el-form-item__content{

            .el-col{
              padding-right: 20px;
              margin-bottom: 10px;
              	button{
                  width: 100%;
                }
            }
            .el-col:nth-child(3n){
              padding-right: 0;

            }
          }
        }
        // 富文本编辑器
        .editor-container{
          line-height: 1;
          #ue2{
            .view{
              height: 500px;
					    overflow: auto;
            }
          }
        }
        // 确认提交
        .afffirm{
          text-align: center;
        }


      }

    }
  }
</style>
