<template>
  <div class="certificationWatchDetail content" >
    <div class="userIdentifyPersonStatus"  v-if="status==2">
      <div class='content-title'>个人认证审核状态</div>
      <div class="IdentifyPerson_content">
        <el-row :gutter="20">
          <el-col :span="4">
          <div class="identifyTItle">
            {{['待审核','已认证','认证失败'][authenticationStatus]}}
          </div>
          </el-col>
          <el-col :span="16">
          <el-form label-width="100px">
            <div class="ide_person_content">
              <el-row>
                <el-col :span="24">
                <el-form-item label="真实姓名" prop="name">
                  <el-input type="text" v-model="getpersonalInfo.name" auto-complete="off" disabled/>
                </el-form-item>
                <el-form-item label="身份证号" prop="idCard">
                  <el-el-input type="text" v-model="getpersonalInfo.idCard" auto-complete="off" disabled/>
                </el-form-item>
                <el-form-item label="户籍地址"  prop="address">
                  <el-input type="text" v-model="getpersonalInfo.address" auto-complete="off" disabled/>
                </el-form-item>
                <el-form-item label="身份证正面"  prop="idCardFace">
                  <div class="img_box">
                    <img :src="getpersonalInfo.idCardFace"/>
                  </div>
                </el-form-item>
                <el-form-item label="身份证反面" prop="idCardBoth">
                  <div class="img_box">
                    <img :src="getpersonalInfo.idCardBoth"/>
                  </div>
                </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          </el-col>
          <el-col :span="4"><Button type="primary" @click="reset" class="new" v-if="status == 3">重新认证</Button></el-col>
        </el-row>
      </div>
    </div>
  </div>

</template>
<script>

  export default {
    name: "userIdentifyPerson",
    components: {
    },
    data() {
      return {
        UserInfo: {},
        status: null,
        showWord: false,
        checked: true,
        authenticationStatus: '',
        getpersonalInfo: {},
      };
    },
    created() {
      const {id} = this.$route.params

    },
    methods: {

    }
  };
</script>
<style lang="less">
  .certificationWatchDetail{
    .userIdentifyPersonStatus {
      .IdentifyPerson_content {
        background-color: #fff;
        padding: 30px 0;
        .identifyTItle{
          width:130px;
          height:130px;
          border-radius: 50%;
          border: 1px solid #ccc;
          line-height: 130px;
          text-align: center;
          margin: 20px 0 0 80px;
          font-size: 24px;
          color: #aaa;
        }
        .button {
          text-align: center;
        }
        .el-form {
          .ide_person_content {
            width: 600px;
            margin: auto;
            .el-form-item__label {
              vertical-align: middle;
              display: inline-block;
            }
            .img_box{
              margin:0!important;
              width: 350px!important;
              height: 200px!important;
              img{
                width:100%;
                height:100%;
              }
            }
          }
          .sub{
            text-align: center;
            .el-radio{
              padding:20px 0;
            }
          }
        }
        span{
          color:#c0c4cc;
        }
      }
    }
  }

</style>
