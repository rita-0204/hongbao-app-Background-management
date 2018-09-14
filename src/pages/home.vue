<template>
  <div
    class="site-wrapper"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <div class="home">
        <HomeNavbar></HomeNavbar>
        <HomeSilderbar></HomeSilderbar>
        <HomeContent></HomeContent>
      </div>
    </template>
  </div>
</template>

<script>
  import HomeNavbar from './home-navbar'
  import HomeSilderbar from './home-silderbar'
  import HomeContent from './home-content'
  export default {
      data () {
        return {
          loading: true
        }
      },
      components:{
          HomeNavbar,
          HomeSilderbar,
          HomeContent
      },
      computed:{
        //得到管理员ID
          userId:{
            get(){
              return this.$stroe.state.user.id  // 接收store 储存数据
            },
            set(val){
              this.$store.commit('user/updateId',val)
            }
          },
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
      created() {
        this.getList();
      },
      methods: {
        //请注管理员信息  1、请求不到东西，提示加载中，直到请求到关闭加载toast
        getList(){
          this.$http({
            url: this.$http.adornUrl('/sys/user/info'),
            method: 'get'
          }).then(({data}) => {
            if(data.code == 0){
              this.loading = false;
              this.userId = data.user.userId
              this.userName = data.user.username
            }
          })
        },
      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>

</style>
