<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="login-logo"><b>二头条管理后台</b></div>
        <div class="login-main">
          <h3 class="login-title">管理员登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()" style="height:30px;line-height: 3px;">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    computed:{
      //得到管理员name
      userName:{
        get(){
          return this.$store.state.user.name //接收store储存数据
        },
        set(val){
          this.$store.commit('user/updateName',val) //向store/同步提交
        }
      }
    },
    methods: {
      // 提交表单  1、提交用户名和密码，后台返token给我，我将token 存到cookie  2、成功后跳转到主页home
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(valid)
            this.$http({
              url: this.$http.adornUrl('/controll/login'),
              method: 'post',
              data: this.$http.adornData({
                username: this.dataForm.userName,
                password: this.dataForm.password
              })
            }).then(({data}) => {
//              console.log(JSON.parse(data))
              if (data.resultCode == 0) {
                this.userName = data.data.username
                this.$cookie.set('token', data.data.token)
                this.$router.replace({ name: 'home' })
              } else {
                this.$message.error('账号或密码错误，请重新输入')
              }
            })
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>
  .site-page--login{
    .site-content{
      width:360px;
      text-align: center;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 100px auto;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
      .login-logo b{
        font-size:35px;
        width:360px;
        font-weight:300;
      }
      .login-main{
        background: #fff;
        padding: 20px;
        border-top: 0;
        color: #666;
        .login-title{
          margin: 20px auto;
          font-weight:bold;
        }
        .login-btn-submit{
          width:100%;
        }
      }
    }
  }
</style>
