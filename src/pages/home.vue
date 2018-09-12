<template>
  <div class="home">
    <HomeNavbar></HomeNavbar>
    <HomeSilderbar></HomeSilderbar>
    <HomeContent></HomeContent>
  </div>
</template>

<script>
  import HomeNavbar from './home-navbar'
  import HomeSilderbar from './home-silderbar'
  import HomeContent from './home-content'
  export default {
      name: 'home',
      data () {
        return {

        }
      },
      components:{
          HomeNavbar,
          HomeSilderbar,
          HomeContent
      },
      created() {

      },
      methods: {

      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="stylesheet/scss" scoped>

</style>
