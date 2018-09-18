<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.id + ''">
    <template slot="title">
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.id"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.id + ''" @click="gotoRouteHandle(menu)">
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
  import SubMenu from './home-sidebar-sub-menu'
  export default {
    name: 'sub-menu',
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {  //接收父组件方法
        type: Array,
        required: true
      }
    },
    components: {
      SubMenu
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
//        console.log(menu)
        var route = this.dynamicMenuRoutes.filter(item => item.meta.id === menu.id)
//        console.log(route)
        if (route.length >= 1) {
//          console.log(route)
          this.$router.push({ name: route[0].name })
        }
      }
    }
  }
</script>
