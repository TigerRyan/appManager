<template>
  <div class="content_data">
    <Breadcrumb>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </Breadcrumb>
    <el-form :model="user" :rules="rules" ref="user" labelWidth="150px">
      <el-form-item label="头像" prop="pic">
        <Avatar :url="user.pic" @success="user.pic = $event"/>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name" placeholder="请输入姓名..."/>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone" >
        <el-input v-model="user.phone" placeholder="请输入手机号码..." disabled/>
      </el-form-item>
      <el-form-item label="输入新密码" prop="password">
        <el-input type="password" v-model="user.password" placeholder="请输入新密码..."/>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="password2">
        <el-input type="password" v-model="user.password2" placeholder="请再次输入密码..."/>
      </el-form-item>
      <el-form-item label="状态" prop="deleted">
        <el-switch v-model="user.deleted" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用" :active-value="0" :inactive-value="1"/>
      </el-form-item>
      <el-button type="edit" @click="submit">确认提交</el-button>
      <el-button type="del" @click="$router.back()">取消</el-button>
    </el-form>
  </div>
</template>

<script>
  import {getUserApi, updateUserApi} from '../../../api/userApi'
  import {success, error} from '../../../actions'
  import Avatar from '../../../components/Avatar.vue'
  import Breadcrumb from '../../../components/Breadcrumb.vue'

  export default {
    name: 'userEditor',
    data() {
      return {
        user: {pic: '/static/img/logo.png', name: '', phone: '', password: null, password2: null, deleted: 0},
        rules: {
          name: [{required: true, message: '请输入姓名...', trigger: 'blur'}, {max: 8, message: '名字不能超过8个字符...', trigger: 'blur'}],
          phone: [{required: true, message: '请输入电话号码...', trigger: 'blur'}, {min: 11, max: 11, message: '电话号码长度为11位...', trigger: 'blur'}],
          password: [{
            validator: (rule, value, callback) => {
              if (value && value.length < 6) {
                callback(new Error('密码长度不能少于6位！'))
              } else {
                if (this.user.password2) {
                  this.$refs.user.validateField('password2')
                }
                callback()
              }
            },
            trigger: 'blur',
          }],
          password2: [{
            validator: (rule, value, callback) => {
              if (this.user.password && !value) {
                callback(new Error('请再次输入密码！'))
              } else if (this.user.password && value !== this.user.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          }],
        },
      }
    },
    components: {Avatar, Breadcrumb},
    methods: {
      submit() {
        this.$refs.user.validate((valid) => {
          if (valid) {
            updateUserApi(this.user).then(() => {
              success(`修改学生“${this.user.name}”成功！`)
              this.$router.back()
            }).catch(({msg}) => error(msg || `修改学生“${this.user.name}”失败！`))
          } else {
            return false
          }
        })
      },
    },
    created() {
      const {id} = this.$route.params
      getUserApi(id).then(user => {
        this.user = user
      })
    },
  }
</script>
