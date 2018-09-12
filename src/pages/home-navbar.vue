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
    <password></password>
  </nav>
</template>

<script>
  import Password from './home-navbar-update-password.vue'

  export default {
      data() {
          return {
              activeIndex: '1',
              activeIndex2: '1',
              userName:''
          };
      },
      components:{
        Password
      },
      created(){
        this.getlist();
      },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            getlist(){
              this.$http({
                url: this.$http.adornUrl('/sys/user/info'),
                method: 'get'
              }).then(({data}) => {
                this.userName = data.user.username
              })
            },
            updatePasswordHandle(){

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
    background:#45c2b5;
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
