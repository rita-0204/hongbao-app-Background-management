<template>
  <nav class="site-navbar">
    <div class="site-navbar-header">
      <h1>主页</h1>
    </div>
    <div class="site-navbar-content">
      <el-menu class="site-navbar__menu fr" mode="horizontal">
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
              <span class="el-dropdown-link">
                {{ userName }}
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!--弹窗-->
    <password v-show="flagShow" ref="updatePassowrd"></password>
  </nav>
</template>

<script>
  import Password from './home-navbar-update-password.vue'
  import { clearLoginInfo } from '@/utils'

  export default {
      data() {
          return {
              flagShow: false
          };
      },
      components:{
        Password
      },
      computed:{
        userName:{
          get(){
            return this.$store.state.user.name
          }
        }
      },
      methods: {
        // 修改密码
          updatePasswordHandle(){
            this.flagShow = true
            this.$nextTick(() => {
              this.$refs.updatePassowrd.init()  //父调子的方法用ref
            })
          },
        // 退出
          logoutHandle () {
            this.$confirm(`确定进行[退出]操作?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$http({
                url: this.$http.adornUrl('/controll/quit'),
                method: 'get',
                params: this.$http.adornParams({
                  'token': this.$cookie.get('token')
                })
              }).then(({data}) => {
                if (data.resultCode == 0) {
                  clearLoginInfo()  //清除登录信息及token
                  this.$router.push({ name: 'login' })  //重新跳转到登录页
                }
              })
            }).catch(() => {})
          }
      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>
  .site-navbar{
    position: fixed;
    top:0;
    left:0;
    right:0;
    height:50px;
    background:#409EFF;
    z-index:900;
    box-shadow: 0 2px 4px rgba(0,0,0,.08);
    .site-navbar-header{
      width:230px;
      height:50px;
      float:left;
      h1{
        width:230px;
        height:50px;
        line-height:50px;
        font-weight: bold;
        letter-spacing:5px;
        font-size:20px;
        color:#fff;
        text-align: center;
      }
    }
    .site-navbar-content{
      background:#fff;
      margin-left:230px;
      height:50px;
      line-height:50px;
      padding-right:50px;
      .site-navbar__avatar{
        height:49px;
        line-height:50px;
      }
    }
  }
</style>
